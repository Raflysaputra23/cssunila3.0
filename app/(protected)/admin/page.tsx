"use client"

import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import RegistrationsTab from "@/components/site/RegistrationsTab";
import CompetitionsTab from "@/components/site/CompetitionsTab";
import NewsTab from "@/components/site/NewsTab";
import SeminarsTab from "@/components/site/SeminarsTab";
import GroupLinksTab from "@/components/site/GroupLinksTab";
import WinnersTab from "@/components/site/WinnersTab";
import SiteSettingsTab from "@/components/site/SiteSettingsTab";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


const AdminPage = () => {
  const { role, loading, user } = useAuth();
  const router = useRouter();
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth");
      } else if (!isAdmin) {
        router.replace("/");
      }
    }
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden flex items-center justify-center">
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="animate-spin" size={16} /> Memuat dashboard admin…
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <section className="pt-32 pb-16 md:pt-40">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={14} /> Beranda
          </Link>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">Admin</span> Dashboard
          </h1>

          <Tabs defaultValue="reg" className="mt-10">
            <TabsList className="glass px-1 py-5 w-full md:w-fit pl-16 md:pl-1 overflow-y-hidden overflow-x-auto">
              <TabsTrigger value="reg" className="p-4 cursor-pointer">Pendaftaran</TabsTrigger>
              <TabsTrigger value="comp" className="p-4 cursor-pointer">Lomba</TabsTrigger>
              <TabsTrigger value="news" className="p-4 cursor-pointer">Berita</TabsTrigger>
              <TabsTrigger value="sem" className="p-4 cursor-pointer">Seminar</TabsTrigger>
              <TabsTrigger value="groups" className="p-4 cursor-pointer">Grup</TabsTrigger>
              <TabsTrigger value="winners" className="p-4 cursor-pointer">Juara</TabsTrigger>
              <TabsTrigger value="website" className="p-4 cursor-pointer">Website</TabsTrigger>
            </TabsList>
            <TabsContent value="reg" className="mt-6"><RegistrationsTab /></TabsContent>
            <TabsContent value="comp" className="mt-6"><CompetitionsTab /></TabsContent>
            <TabsContent value="news" className="mt-6"><NewsTab /></TabsContent>
            <TabsContent value="sem" className="mt-6"><SeminarsTab /></TabsContent>
            <TabsContent value="groups" className="mt-6"><GroupLinksTab /></TabsContent>
            <TabsContent value="winners" className="mt-6"><WinnersTab /></TabsContent>
            <TabsContent value="website" className="mt-6"><SiteSettingsTab /></TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={`animate-spin text-cyan-strong ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default AdminPage;
