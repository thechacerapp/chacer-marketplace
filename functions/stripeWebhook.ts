import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    const data = event.data.object;

    if (event.type === "checkout.session.completed") {
      const officeId = data.metadata?.office_id;
      const plan = data.metadata?.plan;
      const subscriptionId = data.subscription;
      const customerId = data.customer;

      if (!officeId || !subscriptionId) {
        return Response.json({ received: true });
      }

      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
      const trialEnd = stripeSub.trial_end
        ? new Date(stripeSub.trial_end * 1000).toISOString().split("T")[0]
        : null;
      const trialStart = stripeSub.trial_start
        ? new Date(stripeSub.trial_start * 1000).toISOString().split("T")[0]
        : null;

      // Create subscription record
      await base44.asServiceRole.entities.Subscription.create({
        office_id: officeId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        plan_type: plan,
        billing_interval: plan?.toLowerCase().includes("annual") ? "annual" : "monthly",
        status: stripeSub.status,
        trial_start: trialStart,
        trial_end: trialEnd,
        start_date: new Date().toISOString().split("T")[0],
        amount: (stripeSub.items.data[0]?.price?.unit_amount || 0) / 100
      });

      // Update office status to active
      await base44.asServiceRole.entities.Office.update(officeId, {
        status: "active",
        stripe_customer_id: customerId
      });
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscriptionId = data.id;
      const status = data.status;

      const subs = await base44.asServiceRole.entities.Subscription.filter({
        stripe_subscription_id: subscriptionId
      });

      if (subs.length > 0) {
        await base44.asServiceRole.entities.Subscription.update(subs[0].id, { status });

        if (status === "canceled") {
          await base44.asServiceRole.entities.Office.update(subs[0].office_id, { status: "cancelled" });
        }
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
});