"use client"

import { Instagram, Twitter, Youtube, Mail } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/supabase/client";
import { useEffect, useRef, useState } from "react";

const Footer = () => {
  const [lomba, setLomba] = useState<string[]>([]);
  const suparef = useRef(createClient());
  const [settings, setSettings] = useState<Record<string, string>>({
    site_logo: "/css-logo.png",
    site_title_main: "CSS",
    site_title_sub: "3.0",
  });

  useEffect(() => {
    (async() => {
      const supabase = suparef.current;
      
      // Load competitions
      const { data: compData } = await supabase.from('competitions').select("name");
      if (compData) {
        setLomba(compData.map(comp => comp.name));
      }

      // Load settings
      const { data: setValues } = await supabase
        .from("site_settings")
        .select("id, value")
        .in("id", ["site_logo", "site_title_main", "site_title_sub"]);
      if (setValues && setValues.length > 0) {
        const map: Record<string, string> = {};
        setValues.forEach((item) => {
          map[item.id] = item.value;
        });
        setSettings((prev) => ({ ...prev, ...map }));
      }
    })()
  }, []);

  return (
    <footer className="relative mt-12 border-t border-border/60 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <Image src={settings.site_logo} width={80} height={80} alt={`${settings.site_title_main} ${settings.site_title_sub}`} className="h-9 w-auto" />
              <span className="font-display text-lg font-bold tracking-wider">
                <span className="gradient-text">{settings.site_title_main} {settings.site_title_sub}</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Computer Science Showdown — event teknologi himakom terbesar, mempertemukan
              talenta, komunitas, dan sekolah SMA/SMK sederajat se-Provinsi Lampung.
            </p>
            <div className="mt-5 flex gap-2">
              {[Instagram, Twitter, Youtube, Mail].map((I, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label="social"
                  className="glass flex size-10 items-center justify-center rounded-full text-foreground/80 transition hover:text-cyan-strong"
                >
                  <I size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Lomba
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {lomba.length > 0 ?
                lomba.map((comp, idx) => (
                  <li key={idx}><a href="#lomba" className="hover:text-foreground">{comp}</a></li>
                ))
                :
                <li><a href="#lomba" className="hover:text-foreground">Belum tersedia</a></li>
              }
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">
              Event
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#timeline" className="hover:text-foreground">Timeline</a></li>
              <li><a href="#seminar" className="hover:text-foreground">Seminar</a></li>
              <li><a href="#berita" className="hover:text-foreground">Berita</a></li>
              <li><a href="#sponsor" className="hover:text-foreground">Sponsor</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 {settings.site_title_main} {settings.site_title_sub} — Computer Science Showdown. All rights reserved.</p>
          <p>Made with M. Rafly Saputra</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;