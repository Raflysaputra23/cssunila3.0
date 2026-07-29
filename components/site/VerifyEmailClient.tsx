"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OTPInput } from "input-otp";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  const stars = "*".repeat(Math.min(Math.max(local.length - 2, 3), 6));
  return `${visible}${stars}@${domain}`;
}

function OTPSlot({
  char,
  hasFakeCaret,
  isActive,
}: {
  char: string | null;
  hasFakeCaret: boolean;
  isActive: boolean;
}) {
  return (
    <div
      className={[
        "relative flex h-14 w-11 items-center justify-center rounded-xl border text-2xl font-bold font-mono transition-all duration-200 sm:h-16 sm:w-12",
        isActive
          ? "border-cyan-strong bg-cyan-strong/10 ring-2 ring-cyan-strong/20 shadow-[0_0_20px_rgba(76,179,212,0.18)]"
          : "border-border bg-white/4 hover:border-white/20",
      ].join(" ")}
    >
      {char !== null ? (
        <span className={isActive ? "text-cyan-strong" : "text-foreground"}>
          {char}
        </span>
      ) : (
        <span className="text-muted-foreground/20">·</span>
      )}

      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-px animate-pulse bg-cyan-strong" />
        </div>
      )}
    </div>
  );
}

const VerifyEmailClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!email) router.replace("/auth");
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) {
      (async() => {
        setCanResend(true);
        return;
      })()
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleVerify = useCallback(
    async (code: string) => {
      if (code.length !== 6 || verifyingRef.current) return;
      verifyingRef.current = true;
      setLoading(true);

      try {
        const stored = sessionStorage.getItem(`css_reg:${email}`);
        if (!stored) {
          toast.error(
            "Data registrasi tidak ditemukan. Silakan daftar ulang."
          );
          router.replace("/auth");
          return;
        }
        const { password, fullName } = JSON.parse(stored) as {
          password: string;
          fullName: string;
        };

        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code, password, fullName }),
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Kode verifikasi tidak valid");
          setOtp("");
          return;
        }

        sessionStorage.removeItem(`css_reg:${email}`);
        toast.success("Akun berhasil dibuat!");
        router.replace("/");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Terjadi kesalahan, coba lagi"
        );
        setOtp("");
      } finally {
        setLoading(false);
        verifyingRef.current = false;
      }
    },
    [email, router]
  );

  const handleOTPChange = useCallback(
    (value: string) => {
      setOtp(value);
      if (value.length === 6) handleVerify(value);
    },
    [handleVerify]
  );

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    setResendLoading(true);
    try {
      const stored = sessionStorage.getItem(`css_reg:${email}`);
      const { fullName } = stored
        ? (JSON.parse(stored) as { fullName: string })
        : { fullName: "" };

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Kode verifikasi baru telah dikirim ke email Anda!");
      setCountdown(60);
      setCanResend(false);
      setOtp("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengirim ulang kode"
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-16">
      <div className="pointer-events-none absolute -left-24 top-24 -z-10 h-80 w-80 rounded-full bg-sapphire/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 -z-10 h-80 w-80 rounded-full bg-cyan-strong/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-evergreen/20 blur-3xl" />

      <div className="w-full max-w-md">
        <Link
          href="/auth"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Kembali ke halaman daftar
        </Link>

        <div className="glass-strong rounded-3xl p-8">
          <div className="mb-8 flex items-center gap-3">
            <Image
              src="/css-logo.png"
              width={80}
              height={80}
              alt="CSS 3.0"
              className="h-8 w-auto"
            />
            <div>
              <p className="font-display text-lg font-bold">
                CSS <span className="gradient-text">3.0</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Computer Science Showdown
              </p>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex h-17 w-17 items-center justify-center rounded-2xl border border-cyan-strong/20 bg-gradient-to-br from-sapphire/20 to-cyan-strong/20">
              <Mail size={30} className="text-cyan-strong" />
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-bold">
              Verifikasi Email
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Kode 6 digit telah dikirim ke
              <br />
              <span className="font-medium text-foreground">
                {maskEmail(email)}
              </span>
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <OTPInput
              maxLength={6}
              value={otp}
              onChange={handleOTPChange}
              disabled={loading}
              render={({ slots }) => (
                <div className="flex gap-2 sm:gap-3">
                  {slots.map((slot, i) => (
                    <OTPSlot key={i} {...slot} />
                  ))}
                </div>
              )}
            />
          </div>

          <button
            id="btn-verify-otp"
            onClick={() => handleVerify(otp)}
            disabled={loading || otp.length !== 6}
            className="btn-hero hover:btn-hero-hover mb-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShieldCheck size={16} />
            )}
            {loading ? "Memverifikasi..." : "Verifikasi Email"}
          </button>

          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              Tidak menerima kode?
            </p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-cyan-strong transition-opacity hover:underline disabled:opacity-60"
              >
                {resendLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
                Kirim ulang kode
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Kirim ulang dalam{" "}
                <span className="font-semibold text-foreground">
                  {countdown}s
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 glass rounded-2xl px-5 py-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            💡{" "}
            <strong className="text-foreground">Tips:</strong> Periksa folder{" "}
            <em>Spam</em> atau <em>Junk</em> jika email tidak masuk ke kotak
            masuk. Kode berlaku selama{" "}
            <strong className="text-foreground">15 menit</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailClient;