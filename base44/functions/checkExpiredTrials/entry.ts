import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const CHACER_SYNC_URL = Deno.env.get('CHACER_SYNC_URL');
const SYNC_SECRET = Deno.env.get('SYNC_SECRET');

async function syncOfficeToChacer(office, sub) {
  if (!CHACER_SYNC_URL) return;
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
    subscription_status: sub?.status || office.status,
    trial_end: sub?.trial_end || '',
    subscription_end_date: sub?.ends_on_date || '',
    chacer_app_url: office.chacer_app_url || '',
    chacer_app_id: office.chacer_app_id || ''
  };
  await fetch(CHACER_SYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-sync-secret': SYNC_SECRET },
    body: JSON.stringify(payload)
  });
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const today = new Date().toISOString().split('T')[0];

    // Get all trialing subscriptions
    const trialingSubs = await base44.asServiceRole.entities.Subscription.filter({ status: 'trialing' });

    let suspended = 0;
    let warned = 0;
    const errors = [];

    for (const sub of trialingSubs) {
      if (!sub.trial_end) continue;

      const trialEnd = new Date(sub.trial_end);
      const todayDate = new Date(today);
      const daysLeft = Math.ceil((trialEnd - todayDate) / (1000 * 60 * 60 * 24));

      const office = await base44.asServiceRole.entities.Office.get(sub.office_id);
      if (!office) continue;

      // If trial has expired — suspend
      if (daysLeft <= 0) {
        try {
          await base44.asServiceRole.entities.Subscription.update(sub.id, { status: 'canceled' });
          await base44.asServiceRole.entities.Office.update(office.id, { status: 'suspended' });

          const updatedSub = { ...sub, status: 'canceled' };
          const updatedOffice = { ...office, status: 'suspended' };
          await syncOfficeToChacer(updatedOffice, updatedSub);

          // Send suspension email
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: office.contact_email,
            subject: 'Your Chacer trial has ended',
            body: `Hi ${office.name},\n\nYour free trial has ended and your account has been suspended.\n\nTo restore access, please sign up for a plan at https://thechacer.com/GetStarted.\n\nQuestions? Reply to this email.\n\nThe Chacer Team`
          });

          suspended++;
        } catch (e) {
          errors.push({ office: office.name, error: e.message });
        }

      // If trial ends in exactly 3 days — send warning
      } else if (daysLeft === 3) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: office.contact_email,
            subject: 'Your Chacer trial ends in 3 days',
            body: `Hi ${office.name},\n\nYour free trial expires in 3 days (${sub.trial_end}).\n\nTo keep access, please set up a subscription at https://thechacer.com/GetStarted.\n\nThe Chacer Team`
          });
          warned++;
        } catch (e) {
          errors.push({ office: office.name, error: `Warning email failed: ${e.message}` });
        }
      }
    }

    return Response.json({ ok: true, suspended, warned, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});