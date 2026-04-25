import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const SYNC_SECRET = Deno.env.get("SYNC_SECRET");
const CHACER_SYNC_URL = "https://thechacerapp.com/api/functions/syncSubscriptionStatus";

async function syncToChacerApp(payload) {
  try {
    await fetch(CHACER_SYNC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-sync-secret": SYNC_SECRET
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error("Failed to sync to ChacerApp:", e.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    const data = event.data.object;

    if (event.type === "checkout.session.completed") {
      const plan = data.metadata?.plan;
      const subscriptionId = data.subscription;
      const customerId = data.customer;
      const { office_name, email, office_type, contact_phone, existing_office_id } = data.metadata || {};

      if (!subscriptionId) {
        return Response.json({ received: true });
      }

      // Find or create the Office record
      let officeId = existing_office_id || null;
      if (!officeId) {
        let offices = await base44.asServiceRole.entities.Office.filter({ contact_email: email });
        if (offices.length === 0 && office_name && email) {
          const newOffice = await base44.asServiceRole.entities.Office.create({
            name: office_name,
            contact_email: email,
            office_type: office_type || "General Office",
            contact_phone: contact_phone || "",
            stripe_customer_id: customerId,
            status: "active"
          });
          officeId = newOffice.id;
        } else {
          officeId = offices[0]?.id;
        }
      }

      if (!officeId) {
        return Response.json({ received: true });
      }

      const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
      const trialEnd = stripeSub.trial_end
        ? new Date(stripeSub.trial_end * 1000).toISOString().split("T")[0]
        : null;
      const trialStart = stripeSub.trial_start
        ? new Date(stripeSub.trial_start * 1000).toISOString().split("T")[0]
        : null;

      const subData = {
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
      };

      // If this office already has a manual (no-stripe) subscription, update it. Otherwise create new.
      const existingSubs = await base44.asServiceRole.entities.Subscription.filter({ office_id: officeId });
      const manualSub = existingSubs.find(s => !s.stripe_subscription_id);
      if (manualSub) {
        await base44.asServiceRole.entities.Subscription.update(manualSub.id, subData);
      } else {
        await base44.asServiceRole.entities.Subscription.create(subData);
      }

      // Update office status and stripe customer id
      await base44.asServiceRole.entities.Office.update(officeId, {
        status: "active",
        stripe_customer_id: customerId
      });

      // Sync new subscription to ChacerApp
      await syncToChacerApp({
        event: "checkout.session.completed",
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        email,
        office_name,
        plan,
        status: stripeSub.status,
        trial_end: trialEnd
      });

      // Send welcome email to the new customer
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: email,
        from_name: "Chacer",
        subject: "Welcome to Chacer — Your App is Ready to Set Up!",
        body: `Hi ${office_name},

Welcome to Chacer! Your account has been created and your app is ready for you to set up.

Here's what to do next:

1. Set up your app — follow our step-by-step setup guide to get your rooms, team members, and call reasons configured:
   https://thechacer.com/setupguide

2. Access your dashboard — manage your subscription and find your Chacer app link here:
   https://thechacer.com/clientdashboard

Your 10-day free trial has started. You won't be charged until the trial ends, and you can cancel anytime with no charge during the trial period.

If you have any questions, just reply to this email — we're happy to help.

Welcome aboard!
The Chacer Team`
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

        // Sync subscription status change to ChacerApp
        await syncToChacerApp({
          event: event.type,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: data.customer,
          status
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
});