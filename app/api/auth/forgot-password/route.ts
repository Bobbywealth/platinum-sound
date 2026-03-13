import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, getPasswordResetEmail } from '@/lib/email'
import { randomBytes } from 'crypto'

// POST /api/auth/forgot-password
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
    // This is a security best practice - don't reveal whether email exists
    if (!user) {
      console.log(`[FORGOT-PASSWORD] User not found: ${email}`)
      return NextResponse.json(
        { message: 'If an account exists with this email, you will receive a password reset link.' }
      )
    }

    // Generate password reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    })

    // Generate reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`

    // Send password reset email
    const { subject, html } = getPasswordResetEmail(resetUrl)
    const emailSent = await sendEmail({
      to: user.email,
      subject,
      html,
    })

    if (!emailSent) {
      console.error('[FORGOT-PASSWORD] Failed to send email')
      return NextResponse.json(
        { error: 'Failed to send reset email. Please try again later.' },
        { status: 500 }
      )
    }

    console.log(`[FORGOT-PASSWORD] Password reset link sent to ${user.email}`)
    
    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' }
    )
  } catch (error) {
    console.error('[FORGOT-PASSWORD] Error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
