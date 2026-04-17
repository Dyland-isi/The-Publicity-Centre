import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

interface ContactRequest {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  serviceInterest?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();
    const { name, company, email, phone, serviceInterest, message } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const subject = `Website Enquiry — ${name}${serviceInterest ? ` [${serviceInterest}]` : ""}`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Arial',sans-serif;background:#f4f7f0;padding:32px;margin:0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-top:4px solid #93C63B;">
    <div style="padding:32px 36px 24px;">
      <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#93C63B;font-weight:600;">
        THE PUBLICITY CENTRE
      </p>
      <h1 style="margin:12px 0 0;font-size:26px;font-weight:800;color:#0a1a00;letter-spacing:-0.02em;">
        New Website Enquiry
      </h1>
    </div>

    <div style="padding:0 36px 24px;border-bottom:1px solid #e8f5d0;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:6px 0;color:#666;width:140px;">Name</td><td style="padding:6px 0;font-weight:600;color:#0a1a00;">${name}</td></tr>
        ${company ? `<tr><td style="padding:6px 0;color:#666;">Company</td><td style="padding:6px 0;color:#0a1a00;">${company}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#666;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#93C63B;">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 0;color:#666;">Phone</td><td style="padding:6px 0;color:#0a1a00;">${phone}</td></tr>` : ""}
        ${serviceInterest ? `<tr><td style="padding:6px 0;color:#666;">Service</td><td style="padding:6px 0;color:#0a1a00;">${serviceInterest}</td></tr>` : ""}
      </table>
    </div>

    <div style="padding:24px 36px;">
      <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#666;font-weight:600;">Message</p>
      <div style="background:#f4f7f0;padding:16px;white-space:pre-wrap;font-size:14px;color:#0a1a00;line-height:1.6;">${message}</div>
    </div>

    <div style="padding:20px 36px;background:#f4f7f0;border-top:1px solid #e8f5d0;">
      <p style="margin:0;font-size:12px;color:#999;">
        Reply directly to this email to respond to ${name}.
      </p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "The Publicity Centre <noreply@publicitycentre.com>",
      to: "info@publicitycentre.com",
      replyTo: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
