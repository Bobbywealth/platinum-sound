import nodemailer from 'nodemailer'

// Create Outlook SMTP transporter
const createTransporter = () => {
  const host = process.env.EMAIL_SERVER_HOST || 'smtp.office365.com'
  const port = parseInt(process.env.EMAIL_SERVER_PORT || '587')
  const user = process.env.EMAIL_SERVER_USER
  const pass = process.env.EMAIL_SERVER_PASSWORD

  return nodemailer.createTransport({
    host,
    port,
    secure: false, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

export interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const from = process.env.EMAIL_FROM || 'Platinum Sound Studio <noreply@platinum-sound.com>'
    
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    })
    
    console.log(`[EMAIL] Sent ${subject} to ${to}`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send email:', error)
    return false
  }
}

// Password Reset Email Template
export function getPasswordResetEmail(resetUrl: string): { subject: string; html: string } {
  const subject = 'Reset Your Password - Platinum Sound Studio'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1a1a1a; margin: 0; font-size: 24px;">Platinum Sound Studio</h1>
    </div>
    
    <h2 style="color: #333333; font-size: 20px; margin-bottom: 20px;">Reset Your Password</h2>
    
    <p style="color: #666666; line-height: 1.6; margin-bottom: 30px;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Reset Password
      </a>
    </div>
    
    <p style="color: #999999; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
      This link will expire in 1 hour for security purposes.
    </p>
    
    <p style="color: #999999; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
      If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        &copy; ${new Date().getFullYear()} Platinum Sound Studio. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`
  
  return { subject, html }
}

// Email Verification Email Template
export function getVerificationEmail(verificationUrl: string): { subject: string; html: string } {
  const subject = 'Verify Your Email - Platinum Sound Studio'
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #1a1a1a; margin: 0; font-size: 24px;">Platinum Sound Studio</h1>
    </div>
    
    <h2 style="color: #333333; font-size: 20px; margin-bottom: 20px;">Verify Your Email</h2>
    
    <p style="color: #666666; line-height: 1.6; margin-bottom: 30px;">
      Thank you for registering! Please verify your email address by clicking the button below:
    </p>
    
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${verificationUrl}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600;">
        Verify Email
      </a>
    </div>
    
    <p style="color: #999999; font-size: 14px; line-height: 1.6; margin-bottom: 0;">
      If you didn't create an account with Platinum Sound Studio, please ignore this email.
    </p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        &copy; ${new Date().getFullYear()} Platinum Sound Studio. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`
  
  return { subject, html }
}
