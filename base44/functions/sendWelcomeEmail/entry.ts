import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, data } = payload;
    
    // Only handle create events
    if (event?.type !== 'create') {
      return Response.json({ ok: true, skipped: true });
    }

    const office = data;
    if (!office?.contact_email) {
      return Response.json({ ok: false, error: 'No office email' });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const firstName = office.name?.split(' ')[0] || 'there';
    const office_name = office.name;

    const welcomeHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; font-size: 15px; color: #222; max-width: 620px; margin: 0 auto; padding: 24px;">

  <p>Hi ${firstName},</p>

  <p>Thank you for signing up for <strong>The Chacer App</strong>!</p>

  <p>Please <strong>save this email for future reference</strong>. It includes the important setup information and download file you'll need to get started.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <h3 style="color: #1d4ed8;">Step 1: Create Your Account</h3>
  <p>Go to <strong><a href="https://thechacerapp.com" style="color:#1d4ed8;">thechacerapp.com</a></strong> and create your account using this email address.<br>
  Set a password that can be shared with the staff who will be setting up your tablets.</p>

  <h3 style="color: #1d4ed8;">Step 2: Download the Setup Guide</h3>
  <p>👉 <strong><a href="https://thechacer.com/SetupGuide" style="color:#1d4ed8;">Click here to view the Setup Guide</a></strong></p>

  <h3 style="color: #1d4ed8;">Step 3: Download The Chacer App</h3>
  <p>👉 <strong><a href="https://drive.google.com/uc?export=download&id=1-ZRSUQvQjIn2cwEB1AH1LVjUUAR-n7jc" style="color:#1d4ed8;">Click here to download the app</a></strong></p>

  <p>The setup guide will walk you through installation and getting everything running smoothly.</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <h3 style="color: #1d4ed8;">📱 Tablet Quick Setup Checklist</h3>
  <p>Before going live, make sure each tablet is configured correctly:</p>
  <ol style="line-height: 2;">
    <li>Set screen brightness to <strong>79–80%</strong></li>
    <li>Set <strong>Battery Saver to ON</strong></li>
    <li>Set an <strong>on/off schedule</strong> if you have a set daily office schedule</li>
    <li>Set screen timeout to <strong>Never turn off</strong></li>
  </ol>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p><strong>Note:</strong><br>
  To manage your account, settings, and billing, visit:<br>
  👉 <strong><a href="https://thechacer.com/ClientDashboard" style="color:#1d4ed8;">https://thechacer.com</a></strong> (Client Dashboard)</p>

  <hr style="border: none; border-top: 1px solid #ddd; margin: 24px 0;" />

  <p>Thank you again for choosing <strong>The Chacer App</strong>. We're excited to help your team stay connected and communicate more efficiently.</p>

  <p>Best,<br><strong>The Chacer App Team</strong></p>

</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "The Chacer App <noreply@thechacerapp.com>",
        to: [office.contact_email],
        subject: "Welcome to The Chacer App — Important Setup Info Inside!",
        html: welcomeHtml,
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to send");

    // Log the email
    await base44.asServiceRole.entities.EmailLog.create({
      email: office.contact_email,
      name: office_name,
      subject: "Welcome to The Chacer App — Important Setup Info Inside!",
      type: "welcome"
    });

    return Response.json({ ok: true, sent: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});