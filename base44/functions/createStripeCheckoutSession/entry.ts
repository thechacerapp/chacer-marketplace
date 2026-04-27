import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

const PRICE_IDS = {
  "Basic Monthly": Deno.env.get("STRIPE_BASIC_MONTHLY_PRICE_ID"),
  "Basic Annual": Deno.env.get("STRIPE_BASIC_ANNUAL_PRICE_ID"),
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { office_name, email, office_type, contact_phone, plan, billing, discount_code, existing_office_id } = await req.json();

    const planAliases = { "Monthly": "Basic Monthly", "Annual": "Basic Annual" };
    const normalizedPlan = PRICE_IDS[plan] ? plan : (planAliases[plan] || plan);
    const priceId = PRICE_IDS[normalizedPlan];
    if (!priceId) {
      return Response.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    const rawAppUrl = Deno.env.get("BASE44_APP_URL") || "";
    const appUrl = rawAppUrl.startsWith("http") ? rawAppUrl.replace(/\/$/, "") : `https://${rawAppUrl.replace(/\/$/, "")}`;

    // Check if this is an existing manually-created office paying for the first time
    let officeId = existing_office_id || null;
    let existingStripeCustomerId = null;

    if (!officeId) {
      // Brand new signup — block duplicates
      const existingOffices = await base44.asServiceRole.entities.Office.filter({ contact_email: email });
      if (existingOffices.length > 0) {
        const existingOffice = existingOffices[0];
        // Check if they already have a stripe subscription set up
        const existingSubs = await base44.asServiceRole.entities.Subscription.filter({ office_id: existingOffice.id });
        const hasPaidSub = existingSubs.some(s => s.stripe_subscription_id);
        if (hasPaidSub) {
          return Response.json({ error: `An account already exists for ${email}. Please log in to your Client Dashboard instead.` }, { status: 409 });
        }
        // Manual trial — let them pay, reuse the existing office
        officeId = existingOffice.id;
        existingStripeCustomerId = existingOffice.stripe_customer_id || null;
      }
    } else {
      // Existing office paying — check if they already have a stripe customer
      const existingOffices = await base44.asServiceRole.entities.Office.filter({ id: officeId });
      if (existingOffices.length > 0) {
        existingStripeCustomerId = existingOffices[0].stripe_customer_id || null;
      }
    }

    // Create or reuse Stripe customer
    let customerId = existingStripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email, name: office_name });
      customerId = customer.id;
    }

    // Build metadata so the webhook knows which office to link
    const metadata = {
      plan: normalizedPlan,
      office_name,
      email,
      office_type,
      contact_phone,
      ...(officeId ? { existing_office_id: officeId } : {})
    };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
        metadata,
      },
      metadata,
      success_url: `${appUrl}/ClientDashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/PricingPage`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});