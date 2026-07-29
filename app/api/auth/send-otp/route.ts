/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdmin } from "@/supabase/admin";
import { NextResponse } from "next/server";
import { createHash, randomInt } from "crypto";
import { sendVerificationEmail } from "@/lib/mailer";

const generateOTP = () => {
  return String(randomInt(100000, 999999));
}

const hashOTP = (code: string) => {
  return createHash("sha256")
    .update(code + (process.env.OTP_SALT ?? "css-unila-otp-2026"))
    .digest("hex");
}

const validateTurnstile = async (token: string) => {
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, fullName, captchaToken } = body as {
      email?: string;
      fullName?: string;
      captchaToken?: string;
    };

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 }
      );
    }

    if (captchaToken) {
      const captchaValid = await validateTurnstile(captchaToken);
      if (!captchaValid) {
        return NextResponse.json(
          { error: "Validasi captcha gagal, coba lagi" },
          { status: 400 }
        );
      }
    }

    const adminClient = createAdmin();

    const { data: authList } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    const alreadyRegistered = authList?.users?.some(
      (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
    );

    if (alreadyRegistered) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    await adminClient
      .from("email_verifications")
      .delete()
      .eq("email", email.trim().toLowerCase());

    const code = generateOTP();
    const hashedCode = hashOTP(code);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); 

    const { error: insertError } = await adminClient
      .from("email_verifications")
      .insert({
        email: email.trim().toLowerCase(),
        code: hashedCode,
        full_name: fullName?.trim() || null,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        verified: false,
      });

    if (insertError) throw insertError;

    // Send email
    await sendVerificationEmail(email.trim(), code, fullName?.trim() || "");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[send-otp] error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal mengirim kode verifikasi" },
      { status: 500 }
    );
  }
}
