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

      // Send welcome email to the new customer via Resend
      const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
      const firstName = (office_name || "").split(" ")[0] || office_name || "there";
      const welcomeHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; font-size: 15px; color: #222; max-width: 620px; margin: 0 auto; padding: 24px;">

  <p>Hi ${firstName},</p>

  <p>Thank you for signing up for <strong>The Chacer App</strong>!</p>

  <p>Please <strong>save this email for future reference</strong>. It includes the important setup information and download file you'll need to get started.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <h3 style="color: #1d4ed8;">Step 1: Create Your Account</h3>
  <p>Go to <strong><a href="https://thechacerapp.com" style="color:#1d4ed8;">thechacerapp.com</a></strong> and create your account using this email address.<br>
  Set a password that can be shared with the staff who will be setting up your tablets.</p>

  <h3 style="color: #1d4ed8;">Step 2: Download the Setup Guide</h3>
  <p>👉 <strong><a href="https://thechacer.com/SetupGuide" style="color:#1d4ed8;">Click here to view the Setup Guide</a></strong></p>

  <h3 style="color: #1d4ed8;">Step 3: Download The Chacer App</h3>
  <p>👉 <strong><a href="https://drive.google.com/uc?export=download&id=1-ZRSUQvQjIn2cwEB1AH1LVjUUAR-n7jc" style="color:#1d4ed8;">Click here to download the app</a></strong></p>

  <p>The setup guide will walk you through installation and getting everything running smoothly.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <h3 style="color: #1d4ed8;">📱 Tablet Quick Setup Checklist</h3>
  <p>Before going live, make sure each tablet is configured correctly:</p>
  <ol style="line-height: 2;">
    <li>Set screen brightness to <strong>79–80%</strong></li>
    <li>Set <strong>Battery Saver to ON</strong></li>
    <li>Set an <strong>on/off schedule</strong> if you have a set daily office schedule</li>
    <li>Set screen timeout to <strong>Never turn off</strong></li>
  </ol>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p><strong>Note:</strong><br>
  To manage your account, settings, and billing, visit:<br>
  👉 <strong><a href="https://thechacer.com/ClientDashboard" style="color:#1d4ed8;">https://thechacer.com</a></strong> (Client Dashboard)</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p>Thank you again for choosing <strong>The Chacer App</strong>. We're excited to help your team stay connected and communicate more efficiently.</p>

  <p>Best,<br><strong>The Chacer App Team</strong></p>

</body>
</html>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "The Chacer App <noreply@thechacerapp.com>",
          to: [email],
          subject: "Welcome to The Chacer App — Important Setup Info Inside!",
          html: welcomeHtml,
        }),
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