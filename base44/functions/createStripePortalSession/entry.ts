import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { stripe_customer_id } = await req.json();
    if (!stripe_customer_id) {
      return Response.json({ error: 'Missing stripe_customer_id' }, { status: 400 });
    }

    const appUrl = Deno.env.get("BASE44_APP_URL") || "https://app.base44.com";

    const session = await stripe.billingPortal.sessions.create({
      customer: stripe_customer_id,
      return_url: `${appUrl}/client-dashboard`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});