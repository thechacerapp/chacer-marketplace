import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SYNC_SECRET = Deno.env.get('SYNC_SECRET');
// This is the syncSubscriptionStatus function URL on thechacerapp — find it at Dashboard → Code → Functions
const CHACER_SYNC_URL = Deno.env.get('CHACER_SYNC_URL');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!CHACER_SYNC_URL) {
      return Response.json({ error: 'CHACER_SYNC_URL secret is not set. Go to Dashboard → Code → Functions on thechacerapp and copy the syncSubscriptionStatus URL, then set it as CHACER_SYNC_URL in secrets.' }, { status: 500 });
    }

    // Fetch all offices and subscriptions from this app
    const [offices, subscriptions] = await Promise.all([
      base44.asServiceRole.entities.Office.list(),
      base44.asServiceRole.entities.Subscription.list()
    ]);

    const subByOfficeId = {};
    for (const sub of subscriptions) {
      subByOfficeId[sub.office_id] = sub;
    }

    let succeeded = 0;
    const errors = [];

    for (const office of offices) {
      try {
        const sub = subByOfficeId[office.id];
        const payload = {
          event: 'admin_sync',
          email: office.contact_email,
          office_name: office.name,
          contact_phone: office.contact_phone || '',
          office_type: office.office_type || '',
          office_status: office.status,
          stripe_customer_id: office.stripe_customer_id || '',
          stripe_subscription_id: sub?.stripe_subscription_id || '',
          plan: sub?.plan_type || '',
          status: sub?.status || office.status,
          trial_end: sub?.trial_end || '',
          subscription_end_date: sub?.ends_on_date || '',
          chacer_app_url: office.chacer_app_url || '',
          chacer_app_id: office.chacer_app_id || ''
        };

        const res = await fetch(CHACER_SYNC_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-sync-secret': SYNC_SECRET
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const text = await res.text();
          errors.push({ office: office.name, error: `HTTP ${res.status}: ${text}` });
        } else {
          succeeded++;
        }
      } catch (e) {
        errors.push({ office: office.name, error: e.message });
      }
    }

    return Response.json({
      ok: true,
      total: offices.length,
      created: succeeded,
      updated: 0,
      errors
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});