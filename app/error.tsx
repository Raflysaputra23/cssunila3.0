"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ChevronRight } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.55 0.22 200 / 0.18), transparent), radial-gradient(ellipse 60% 50% at 80% 90%, oklch(0.5 0.2 270 / 0.12), transparent)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="glass relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl sm:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "oklch(0.65 0.25 200 / 0.25)" }}
        />

        <div className="mb-8 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
            <AlertTriangle size={36} className="text-orange-400" />
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-2xl border border-orange-400/30"
              style={{ animationDuration: "2.5s" }}
            />
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="font-display mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Ups,{" "}
            <span className="gradient-text">Terjadi Kesalahan</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Sesuatu yang tidak terduga terjadi.
            Silakan coba lagi atau kembali ke beranda.
          </p>
        </div>

        {error.digest && (
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs text-muted-foreground">
              ID: {error.digest}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="btn-hero hover:btn-hero-hover inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-black transition-all"
          >
            <RefreshCw size={16} />
            Coba Lagi
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-white/10"
          >
            <Home size={16} />
            Kembali ke Beranda
          </Link>
        </div>

        <div className="my-8 h-px w-full bg-white/8" />

        <div className="space-y-2">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Halaman Populer
          </p>
          {[
            { href: "/lomba", label: "Daftar Lomba" },
            { href: "/pengumuman", label: "Pengumuman" },
            { href: "/kontak", label: "Hubungi Kami" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {label}
              <ChevronRight size={14} className="opacity-40" />
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-muted-foreground/60">
        CSS UNILA 3.0 — Computer Science Showdown
      </p>
    </div>
  );
}
