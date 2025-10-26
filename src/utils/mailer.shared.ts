import envirnment from "@/envirnment";
import nodemailer from "nodemailer";
import { encrypt } from "./crypto.server";
import { APP_NAME, generateSixDigitCode } from "./shared";
import { updateFire } from "./firebase.utils";

// 1️⃣ Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envirnment.email.user,
    pass: envirnment.email.password,
  },
});

export const verificationHtml = (data: any, verificationCode: any) => {
  const code = encrypt(`${data.email}#${verificationCode}`)
  const text = `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center;">
      <h2>Email Verification</h2>
    </div>
    <p>Dear ${data.name},</p>
    <p>Please verify your email by clicking the link below:</p>
    <div style="text-align: center; margin-top: 20px;">
      <a href="${envirnment.frontUrl}verify?q=${code}" 
         style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">
        Verify Email
      </a>
    </div>
    <p style="margin-top: 20px;">If you did not request this verification, please ignore this email.</p>
    <div style="margin-top: 20px; text-align: center; color: #777;">
      <p>Thank you,</p>
      <p>Mohitk-Art</p>
    </div>
  </div>
</div>
`

  return text
}

export async function sendMail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    // 2️⃣ Mail options
    const mailOptions: any = {
      from: envirnment.email.from,
      to,
      subject,
      html: html,
    };
    // 3️⃣ Send mail
    const info = await transporter.sendMail(mailOptions);
    return { success: true, data: info }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function sendVerificationEmail({ data }: { data: any }) {
  try {
    const verificationCode = generateSixDigitCode()
    const ures = await updateFire({
      table: 'users', payload: {
        id: data.id,
        verificationCode: verificationCode,
      }
    })
    if (!ures.success) {
      return { success: false, message: 'Verification code is not updated' }
    }

    const mailOptions: any = {
      from: envirnment.email.from,
      to: data.email,
      subject: `${APP_NAME} - Verification Email`,
      html: verificationHtml(data, verificationCode),
    };
    const info = await sendMail(mailOptions)
    return { success: true, data: info }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
