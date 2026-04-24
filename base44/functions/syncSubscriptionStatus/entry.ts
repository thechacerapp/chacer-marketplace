import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    let body = {};
    try { body = await req.json(); } catch { return Response.json({ error: 'Invalid JSON' }, { status: 400 }); }

    // Verify shared secret
    const secret = req.headers.get('x-sync-secret') || body.secret;
    if (secret !== Deno.env.get('CHACER_SYNC_SECRET')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, subscription_status, plan_type, trial_ends_date } = body;
    if (!email || !subscription_status) {
      return Response.json({ error: 'Missing required fields: email, subscription_status' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const users = await base44.asServiceRole.entities.User.filter({ email });

    if (!users || users.length === 0) {
      return Response.json({ error: `No user found with email: ${email}` }, { status: 404 });
    }

    const user = users[0];
    const updateData = { subscription_status };
    if (plan_type !== undefined) updateData.plan_type = plan_type;
    if (trial_ends_date !== undefined) updateData.trial_ends_date = trial_ends_date;

    await base44.asServiceRole.entities.User.update(user.id, updateData);
    console.log(`[syncSubscriptionStatus] Updated user ${email}: status=${subscription_status}`);

    return Response.json({ success: true, updated: { email, ...updateData } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});