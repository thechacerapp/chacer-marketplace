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

    const { office_id, office_name, email, plan, billing, discount_code } = await req.json();

    const planAliases = { "Monthly": "Basic Monthly", "Annual": "Basic Annual" };
    const normalizedPlan = PRICE_IDS[plan] ? plan : (planAliases[plan] || plan);
    const priceId = PRICE_IDS[normalizedPlan];
    if (!priceId) {
      return Response.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    const rawAppUrl = Deno.env.get("BASE44_APP_URL") || "";
    const appUrl = rawAppUrl.startsWith("http") ? rawAppUrl.replace(/\/$/, "") : `https://${rawAppUrl.replace(/\/$/, "")}`;

    // Always create a new Stripe customer (fastest path — no lookup needed)
    const customer = await stripe.customers.create({ email, name: office_name });

    // Save customer ID to office (fire and forget — don't await)
    base44.asServiceRole.entities.Office.update(office_id, { stripe_customer_id: customer.id });

    // Handle discount code
    let discountOptions = {};
    if (discount_code) {
      const code = discount_code.trim().toUpperCase();
      const codes = await base44.asServiceRole.entities.DiscountCode.filter({ code, active: true });
      const dc = codes[0];
      if (!dc) {
        return Response.json({ error: "Invalid or inactive discount code." }, { status: 400 });
      }

      let couponId = dc.stripe_coupon_id;
      if (!couponId) {
        let couponParams = {};
        if (dc.type === "free_forever") {
          couponParams = { percent_off: 100, duration: "forever", name: "CHACEFREE" };
        } else if (dc.type === "free_month") {
          couponParams = { percent_off: 100, duration: "once", name: "Free Month" };
        } else if (dc.type === "percent_off_annual") {
          if (normalizedPlan !== "Basic Annual") {
            return Response.json({ error: "This discount code is only valid for the yearly plan." }, { status: 400 });
          }
          couponParams = { percent_off: dc.percent_off || 10, duration: "once", name: `${dc.percent_off || 10}% Off Annual` };
        }
        const coupon = await stripe.coupons.create(couponParams);
        couponId = coupon.id;
        base44.asServiceRole.entities.DiscountCode.update(dc.id, { stripe_coupon_id: couponId, times_used: (dc.times_used || 0) + 1 });
      } else {
        base44.asServiceRole.entities.DiscountCode.update(dc.id, { times_used: (dc.times_used || 0) + 1 });
      }
      discountOptions = { discounts: [{ coupon: couponId }] };
    }

    const hasDiscount = Object.keys(discountOptions).length > 0;

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        ...(!hasDiscount ? { trial_period_days: 10 } : {}),
        metadata: { office_id, plan: normalizedPlan }
      },
      metadata: { office_id, plan: normalizedPlan },
      success_url: `${appUrl}/ClientDashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/PricingPage`,
      ...discountOptions,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});