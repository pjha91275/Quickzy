import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    const brevoApiKey = process.env.BREVO_API_KEY;
    const emailFrom = process.env.EMAIL_FROM; // e.g. "Quickzy <shopquickzy@gmail.com>"
    const recipientEmail = process.env.ADMIN_EMAIL; // Recipient from env

    if (!brevoApiKey) {
      return NextResponse.json(
        { error: "Brevo API key is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Quickzy Enquiry",
          email: emailFrom.match(/<([^>]+)>/)?.[1] || emailFrom,
        },
        to: [{ email: recipientEmail }],
        subject: `New Contact Form Submission: ${subject}`,
        htmlContent: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #253D4E; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #3BB77E; padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0;">New Inquiry Received</h1>
            </div>
            <div style="padding: 24px;">
              <p>You have received a new message through the Quickzy contact form.</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0;">${subject}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background-color: #f8fafc; border-radius: 8px;">
                <p style="margin-top: 0; font-weight: bold; font-size: 14px; text-transform: uppercase; color: #64748b;">Message:</p>
                <p style="margin-bottom: 0;">${message}</p>
              </div>
            </div>
            <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
              This email was sent from your Quickzy App Contact Form.
            </div>
          </div>
        `,
        replyTo: { email: email },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
