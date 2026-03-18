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

    // Handle discount code
    let discountOptions = {};
    if (discount_code) {
      const code = discount_code.trim().toUpperCase();
      const codes = await base44.asServiceRole.entities.DiscountCode.filter({ code, active: true });
      const dc = codes[0];
      if (!dc) {
        return Response.json({ error: "Invalid or inactive discount code." }, { status: 400 });
      }

      if (dc.type === "free_forever") {
        // 100% off forever — use Stripe coupon if set, otherwise create one
        let couponId = dc.stripe_coupon_id;
        if (!couponId) {
          const coupon = await stripe.coupons.create({ percent_off: 100, duration: "forever", name: "CHACEFREE" });
          couponId = coupon.id;
          await base44.asServiceRole.entities.DiscountCode.update(dc.id, { stripe_coupon_id: couponId });
        }
        discountOptions = { discounts: [{ coupon: couponId }] };
      } else if (dc.type === "free_month") {
        let couponId = dc.stripe_coupon_id;
        if (!couponId) {
          const coupon = await stripe.coupons.create({ percent_off: 100, duration: "once", name: "Free Month" });
          couponId = coupon.id;
          await base44.asServiceRole.entities.DiscountCode.update(dc.id, { stripe_coupon_id: couponId });
        }
        discountOptions = { discounts: [{ coupon: couponId }] };
      } else if (dc.type === "percent_off_annual") {
        if (normalizedPlan !== "Basic Annual") {
          return Response.json({ error: "This discount code is only valid for the yearly plan." }, { status: 400 });
        }
        let couponId = dc.stripe_coupon_id;
        if (!couponId) {
          const coupon = await stripe.coupons.create({
            percent_off: dc.percent_off || 10,
            duration: "once",
            name: `${dc.percent_off || 10}% Off Annual`
          });
          couponId = coupon.id;
          await base44.asServiceRole.entities.DiscountCode.update(dc.id, { stripe_coupon_id: couponId });
        }
        discountOptions = { discounts: [{ coupon: couponId }] };
      }

      // Increment usage count
      await base44.asServiceRole.entities.DiscountCode.update(dc.id, { times_used: (dc.times_used || 0) + 1 });
    }

    const sessionParams = {
      customer: customer.id,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: discount_code ? 0 : 10,
        metadata: { office_id, plan: normalizedPlan }
      },
      metadata: { office_id, plan: normalizedPlan },
      success_url: `${appUrl}/ClientDashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/PricingPage`,
      ...discountOptions,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});