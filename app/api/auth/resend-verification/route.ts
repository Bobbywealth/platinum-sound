import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, getVerificationEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

// POST /api/auth/resend-verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      console.log(`[RESEND-VERIFICATION] User not found: ${email}`)
      return NextResponse.json(
        { message: 'If an unverified account exists with this email, you will receive a new verification link.' }
      )
    }

    // If already verified, don't send another verification email
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'This email is already verified. You can log in to your account.' }
      )
    }

    // Generate new verification token
    const verificationToken = randomBytes(32).toString('hex')

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: verificationToken,
      },
    })

    // Generate verification URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const verificationUrl = `${baseUrl}/verify-email/${verificationToken}`

    // Send verification email
    const { subject, html } = getVerificationEmail(verificationUrl)
    const emailSent = await sendEmail({
      to: user.email,
      subject,
      html,
    })

    if (!emailSent) {
      console.error('[RESEND-VERIFICATION] Failed to send email')
      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again later.' },
        { status: 500 }
      )
    }

    console.log(`[RESEND-VERIFICATION] Verification email sent to ${user.email}`)
    
    return NextResponse.json(
      { message: 'If an unverified account exists with this email, you will receive a new verification link.' }
    )
  } catch (error) {
    console.error('[RESEND-VERIFICATION] Error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
