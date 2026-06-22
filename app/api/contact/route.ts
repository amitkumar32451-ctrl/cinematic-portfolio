import { NextResponse } from 'next/server';

// Simple in-memory rate limiting map (IP -> timestamps[])
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 3600 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps outside the window
  const activeTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW);
  
  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // 1. Rate Limiting Check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many submissions. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, company, subject, message, projectName, botField } = body;

    // 2. Honeypot Spam Protection Check
    if (botField && botField.trim() !== '') {
      console.warn(`[Anti-Spam Block]: Honeypot field filled by bot: "${botField}". Dropping request.`);
      return NextResponse.json({ success: true, message: 'Submission received successfully' });
    }

    // 3. Server-side Validation
    if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const recipientEmail = 'amitkumar32451@gmail.com';

    // 4. HTML Email Body Template
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #ff6b35; border-bottom: 2px solid #ff6b35; padding-bottom: 12px; margin-top: 0;">New Portfolio Inquiry</h2>
        <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #666; font-size: 14px;">Name:</td>
            <td style="padding: 8px 0; color: #111; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666; font-size: 14px;">Email:</td>
            <td style="padding: 8px 0; color: #ff6b35; font-size: 14px; font-weight: 500;"><a href="mailto:${email}" style="color: #ff6b35; text-decoration: none;">${email}</a></td>
          </tr>
          ${company && company.trim() ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666; font-size: 14px;">Company:</td><td style="padding: 8px 0; color: #111; font-size: 14px;">${company}</td></tr>` : ''}
          ${projectName && projectName.trim() ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666; font-size: 14px;">Project:</td><td style="padding: 8px 0; color: #ff6b35; font-size: 14px; font-weight: 700;">${projectName}</td></tr>` : ''}
          ${subject && subject.trim() && !projectName ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #666; font-size: 14px;">Subject:</td><td style="padding: 8px 0; color: #111; font-size: 14px;">${subject}</td></tr>` : ''}
        </table>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #ff6b35;">
          <h4 style="margin: 0 0 10px 0; color: #555; font-size: 12px; uppercase; letter-spacing: 0.05em;">Message:</h4>
          <p style="margin: 0; line-height: 1.5; color: #222; font-size: 14px; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="margin-top: 30px; font-size: 11px; color: #aaa; text-align: center;">Sent from Amiit.ai Contact System.</p>
      </div>
    `;

    const emailSubject = projectName 
      ? `Project Inquiry – ${projectName}` 
      : `Contact Form – ${subject || 'Inquiry'}`;

    // 5. Send using Resend API (HTTP Fetch to avoid dependency weight)
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Amiit.ai Contact <onboarding@resend.dev>',
          to: recipientEmail,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Resend API Error]:', errorData);
        throw new Error('Failed to send email via Resend.');
      }

      return NextResponse.json({ success: true, message: 'Message sent successfully.' });
    } else {
      // Dev mock response if no API key is specified (prevents crashing, simplifies local testing)
      console.warn('[API Warning]: RESEND_API_KEY environment variable is not defined.');
      console.log('[Mock Email Outbox]:', {
        to: recipientEmail,
        subject: emailSubject,
        html: emailHtml,
      });
      
      // Simulate slight network latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      return NextResponse.json({
        success: true,
        message: 'Message processed locally (mock mode, set RESEND_API_KEY to send live emails).',
      });
    }
  } catch (error: unknown) {
    console.error('[Contact API Catch Error]:', error);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
