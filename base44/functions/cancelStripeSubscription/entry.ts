import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stripe_subscription_id, office_id } = await req.json();

    if (!stripe_subscription_id) {
      return Response.json({ error: 'Missing stripe_subscription_id' }, { status: 400 });
    }

    // Cancel at period end so they keep access until the end of the billing period
    const canceledSubscription = await stripe.subscriptions.update(stripe_subscription_id, {
      cancel_at_period_end: true
    });

    // Update subscription status in our DB
    const subs = await base44.asServiceRole.entities.Subscription.filter({ stripe_subscription_id });
    if (subs.length > 0) {
      await base44.asServiceRole.entities.Subscription.update(subs[0].id, {
        status: 'canceled'
      });
    }

    // Send notification email
    const offices = await base44.asServiceRole.entities.Office.filter({ id: office_id });
    const officeName = offices[0]?.name || 'Unknown Office';

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: "thechacerapp@gmail.com",
      subject: "Subscription Cancellation Request",
      body: `A subscription has been cancelled.\n\nOffice: ${officeName}\nUser: ${user.full_name} (${user.email})\nStripe Subscription ID: ${stripe_subscription_id}\n\nThe subscription will remain active until the end of the current billing period.`
    });

    // The period_end from Stripe tells us when access ends
    const accessUntil = new Date(canceledSubscription.current_period_end * 1000).toLocaleDateString();

    return Response.json({ success: true, access_until: accessUntil });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});