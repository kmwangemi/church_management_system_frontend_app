// lib/notifications.ts
// You'll need to implement these based on your preferred providers

// Example using Twilio for SMS and Resend/SendGrid for email

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

interface SMSOptions {
  to: string;
  message: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  // Example implementation with Resend
  try {
    const emailContent = generateEmailContent(options.template, options.data);

    // Replace with your email service implementation
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: emailContent,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email service error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function sendSMS(options: SMSOptions): Promise<void> {
  // Example implementation with Twilio
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!((accountSid && authToken ) && fromNumber)) {
      throw new Error('Twilio credentials not configured');
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: options.to,
          Body: options.message,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`SMS service error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw error;
  }
}

function generateEmailContent(
  template: string,
  data: Record<string, any>
): string {
  switch (template) {
    case 'login-verification':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Login Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h1 style="color: #333; text-align: center;">Login Verification Code</h1>
            <p style="color: #666; font-size: 16px;">
              Hello ${data.firstName || 'there'},
            </p>
            <p style="color: #666; font-size: 16px;">
              Your login verification code is:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007bff; background-color: #e9f4ff; padding: 20px 30px; border-radius: 8px; display: inline-block;">
                ${data.verificationCode}
              </span>
            </div>
            <p style="color: #666; font-size: 16px;">
              This code will expire in ${data.expiryMinutes || 10} minutes.
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </body>
        </html>
      `;
    default:
      return `<p>Your verification code is: ${data.verificationCode}</p>`;
  }
}

// Alternative providers you might consider:
// - Email: SendGrid, Mailgun, AWS SES, Postmark
// - SMS: Twilio, AWS SNS, MessageBird, Vonage

// Environment variables you'll need:
// RESEND_API_KEY=your_resend_api_key
// FROM_EMAIL=noreply@yourdomain