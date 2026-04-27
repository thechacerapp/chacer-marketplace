import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const CHACER_APP_ID = '69c52d933aac298a84254f99';
const CHACER_API_KEY = Deno.env.get('CHACER_APP_API_KEY');
const CHACER_BASE_URL = 'https://app.base44.com/api/apps';

async function chacerRequest(method, path, body) {
  const res = await fetch(`${CHACER_BASE_URL}/${CHACER_APP_ID}/entities/${path}`, {
    method,
    headers: {
      'api_key': CHACER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  return res.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, data } = payload;

    // Only handle create and update events
    if (!['create', 'update'].includes(event?.type)) {
      return Response.json({ ok: true, skipped: true });
    }

    const office = data;
    if (!office) {
      return Response.json({ ok: false, error: 'No office data in payload' });
    }

    // Build the sync payload - only the fields we care about
    const syncData = {
      name: office.name,
      contact_email: office.contact_email,
      office_type: office.office_type,
      status: office.status,
    };

    // Always pull subscription data for plan_type and end date
    // Try to find matching subscription
    const subs = await base44.asServiceRole.entities.Subscription.filter({ office_id: office.id });
    if (subs.length > 0) {
      const sub = subs[0];
      syncData.plan_type = sub.plan_type;
      syncData.subscription_status = sub.status;
      // Use ends_on_date if it exists (paid subscription), otherwise use trial_end
      syncData.subscription_end_date = sub.ends_on_date || sub.trial_end;
    } else {
      // No subscription found - set a default future date so account isn't locked
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      syncData.subscription_end_date = futureDate.toISOString().split('T')[0];
      syncData.subscription_status = 'active';
    }

    // Check if an Office record with this email already exists in the Chacer app
    const existing = await chacerRequest('GET', `Office?contact_email=${encodeURIComponent(office.contact_email)}`);
    const existingList = Array.isArray(existing) ? existing : [];
    const match = existingList.find(o => o.contact_email === office.contact_email);

    if (match) {
      // Update existing record
      await chacerRequest('PUT', `Office/${match.id}`, syncData);
      return Response.json({ ok: true, action: 'updated', chacer_office_id: match.id });
    } else {
      // Create new record
      const created = await chacerRequest('POST', 'Office', syncData);
      return Response.json({ ok: true, action: 'created', chacer_office_id: created.id });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});