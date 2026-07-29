import { Suspense } from "react";
import { Metadata } from "next";
import VerifyEmailClient from "@/components/site/VerifyEmailClient";

export const metadata: Metadata = {
  title: "Verifikasi Email",
  description:
    "Masukkan kode verifikasi 6 digit yang telah dikirim ke email Anda untuk mengaktifkan akun CSS 3.0.",
};

const VerifyEmailPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-strong border-t-transparent" />
        </div>
      }
    >
      <VerifyEmailClient />
    </Suspense>
  );
}

export default VerifyEmailPage;