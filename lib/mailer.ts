import nodemailer from "nodemailer";
import path from "path";
import { generateVerificationEmailHtml } from "@/lib/email-template";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASS,
  },
});

export const sendVerificationEmail = async (
  to: string,
  code: string,
  fullName: string
) => {
  const html = generateVerificationEmailHtml(to, code, fullName);
  const logoPath = path.join(process.cwd(), "public", "css-logo.png");

  await transporter.sendMail({
    from: `"CSS 3.0 — Computer Science Showdown" <${process.env.EMAIL_SMTP_USER}>`,
    to,
    subject: `[CSS 3.0] Kode Verifikasi Email`,
    html,
    attachments: [
      {
        filename: "css-logo.png",
        path: logoPath,
        cid: "csslogo",
      },
    ],
  });
};
