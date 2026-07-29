/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAdmin } from "@/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHash } from "crypto";

const hashOTP = (code: string) => {
  return createHash("sha256")
    .update(code + (process.env.OTP_SALT ?? "css-unila-otp-2026"))
    .digest("hex");
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, code, password, fullName } = body as {
      email?: string;
      code?: string;
      password?: string;
      fullName?: string;
    };

    if (!email || !code || !password) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    if (typeof code !== "string" || code.trim().length !== 6) {
      return NextResponse.json(
        { error: "Format kode tidak valid" },
        { status: 400 }
      );
    }

    const adminClient = createAdmin();
    const normalizedEmail = email.trim().toLowerCase();

    const { data: record, error: fetchError } = await adminClient
      .from("email_verifications")
      .select("*")
      .eq("email", normalizedEmail)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !record) {
      return NextResponse.json(
        {
          error:
            "Kode verifikasi tidak ditemukan atau sudah kadaluarsa. Silakan daftar ulang.",
        },
        { status: 404 }
      );
    }

    if (new Date() > new Date(record.expires_at)) {
      await adminClient
        .from("email_verifications")
        .delete()
        .eq("email", normalizedEmail);
      return NextResponse.json(
        {
          error:
            "Kode verifikasi sudah kadaluarsa. Silakan daftar ulang untuk mendapatkan kode baru.",
        },
        { status: 400 }
      );
    }

    if (record.attempts >= 5) {
      await adminClient
        .from("email_verifications")
        .delete()
        .eq("email", normalizedEmail);
      return NextResponse.json(
        {
          error: "Terlalu banyak percobaan yang salah. Silakan daftar ulang.",
        },
        { status: 429 }
      );
    }

    const hashedInput = hashOTP(code.trim());
    if (hashedInput !== record.code) {
      await adminClient
        .from("email_verifications")
        .update({ attempts: record.attempts + 1 })
        .eq("email", normalizedEmail);

      const remaining = 4 - record.attempts;
      return NextResponse.json(
        {
          error: `Kode salah. Sisa percobaan: ${remaining < 0 ? 0 : remaining}`,
        },
        { status: 400 }
      );
    }

    const resolvedFullName =
      fullName?.trim() || record.full_name?.trim() || "";

    const { error: createError } = await adminClient.auth.admin.createUser({
      email: normalizedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: resolvedFullName,
      },
    });

    if (createError) {
      if (createError.message?.includes("already been registered")) {
        return NextResponse.json(
          { error: "Email sudah terdaftar. Silakan login." },
          { status: 409 }
        );
      }
      throw createError;
    }

    await adminClient
      .from("email_verifications")
      .update({ verified: true })
      .eq("email", normalizedEmail);

    const cookieStore = await cookies();
    const serverSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { error: signInError } = await serverSupabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: password,
    });

    if (signInError) {
      const { data: linkData } = await adminClient.auth.admin.generateLink({
        type: "magiclink",
        email: normalizedEmail,
      });

      if (linkData?.properties?.email_otp) {
        await serverSupabase.auth.verifyOtp({
          email: normalizedEmail,
          token: linkData.properties.email_otp,
          type: "magiclink",
        });
      }
    }

    return NextResponse.json({ success: true, fullName: resolvedFullName });
  } catch (err: any) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memverifikasi kode" },
      { status: 500 }
    );
  }
};
