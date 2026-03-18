import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

const PRICE_IDS = {
  "Basic Monthly": Deno.env.get("STRIPE_BASIC_MONTHLY_PRICE_ID"),
  "Basic Annual": Deno.env.get("STRIPE_BASIC_ANNUAL_PRICE_ID"),
  "Premium Monthly": Deno.env.get("STRIPE_PREMIUM_MONTHLY_PRICE_ID"),
  "Premium Annual": Deno.env.get("STRIPE_PREMIUM_ANNUAL_PRICE_ID"),
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { office_id, office_name, email, plan, billing, discount_code } = await req.json();

    // Normalize plan name — handle both "Monthly"/"Annual" and "Basic Monthly"/"Basic Annual"
    const planAliases = {
      "Monthly": "Basic Monthly",
      "Annual": "Basic Annual",
    };
    const normalizedPlan = PRICE_IDS[plan] ? plan : (planAliases[plan] || plan);

    const priceId = PRICE_IDS[normalizedPlan];
    if (!priceId) {
      return Response.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    // Create or find Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({ email, name: office_name });
    }

    // Save stripe_customer_id on office
    await base44.asServiceRole.entities.Office.update(office_id, {
      stripe_customer_id: customer.id
    });

    const appUrl = Deno.env.get("BASE44_APP_URL") || "https://app.base44.com";

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 10,
        metadata: { office_id, plan: normalizedPlan }
      },
      metadata: { office_id, plan: normalizedPlan },
      success_url: `${appUrl}/client-dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});