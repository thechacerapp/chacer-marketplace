import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

const PRICE_IDS = {
  "Basic Monthly": Deno.env.get("STRIPE_BASIC_MONTHLY_PRICE_ID"),
  "Basic Annual": Deno.env.get("STRIPE_BASIC_ANNUAL_PRICE_ID"),
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { office_name, email, office_type, contact_phone, plan, billing, discount_code } = await req.json();

    const planAliases = { "Monthly": "Basic Monthly", "Annual": "Basic Annual" };
    const normalizedPlan = PRICE_IDS[plan] ? plan : (planAliases[plan] || plan);
    const priceId = PRICE_IDS[normalizedPlan];
    if (!priceId) {
      return Response.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    const rawAppUrl = Deno.env.get("BASE44_APP_URL") || "";
    const appUrl = rawAppUrl.startsWith("http") ? rawAppUrl.replace(/\/$/, "") : `https://${rawAppUrl.replace(/\/$/, "")}`;

    // Create Stripe customer
    const customer = await stripe.customers.create({ email, name: office_name });

    let discountOptions = {};

    const hasDiscount = Object.keys(discountOptions).length > 0;

    // Store form data in session metadata to recreate Office on success
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        ...(!hasDiscount ? { trial_period_days: 10 } : {}),
        metadata: { plan: normalizedPlan, office_name, email, office_type, contact_phone }
      },
      metadata: { plan: normalizedPlan, office_name, email, office_type, contact_phone },
      success_url: `${appUrl}/ClientDashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/PricingPage`,
      ...discountOptions,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});