"use client"

import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type SeminarRow = {
  id: string;
  slug: string;
  title: string;
  speaker: string | null;
  speaker_image_url: string | null;
  description: string | null;
  image_url: string | null;
  scheduled_at: string | null;
  location: string | null;
  status: "draft" | "published";
};

const SeminarsTab = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<SeminarRow> | null>(null);
  const suparef = useRef(createClient());

  const { data, isLoading } = useQuery({
    queryKey: ["admin-seminars"],
    queryFn: async (): Promise<SeminarRow[]> => {
      const supabase = suparef.current;
      const { data, error } = await supabase
        .from("seminars")
        .select("id,slug,title,speaker,speaker_image_url,description,image_url,scheduled_at,location,status")
        .order("scheduled_at", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (v: Partial<SeminarRow>) => {
      const payload = {
        slug: v.slug!, title: v.title!, speaker: v.speaker ?? null,
        speaker_image_url: v.speaker_image_url ?? null,
        description: v.description ?? null, image_url: v.image_url ?? null,
        scheduled_at: v.scheduled_at || null, location: v.location ?? null,
        status: v.status ?? "draft",
      };
      const supabase = suparef.current;
      if (v.id) {
        const { error } = await supabase.from("seminars").update(payload).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("seminars").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Tersimpan");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-seminars"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const supabase = suparef.current;
      const { error } = await supabase.from("seminars").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dihapus");
      qc.invalidateQueries({ queryKey: ["admin-seminars"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing({ status: "draft" })} className="btn-hero inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold">
          <Plus size={14} /> Seminar baru
        </button>
      </div>
      {isLoading && <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">Memuat…</div>}
      <div className="space-y-2">
        {data?.map((s) => (
          <div key={s.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
            <div>
              <p className="font-display font-semibold">{s.title}</p>
              <p className="text-xs text-muted-foreground">
                /{s.slug} · {s.speaker ?? "—"} · {s.scheduled_at ? new Date(s.scheduled_at).toLocaleString("id-ID") : "tanggal belum diatur"} · {s.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(s)} className="rounded-full bg-white/5 p-2 hover:bg-white/10"><Pencil size={14} /></button>
              <button onClick={() => confirm(`Hapus ${s.title}?`) && del.mutate(s.id)} className="rounded-full bg-destructive/15 p-2 text-destructive hover:bg-destructive/25"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {!isLoading && (!data || data.length === 0) && (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">Belum ada seminar.</div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-4 backdrop-blur">
          <form
            onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}
            className="glass-strong mx-auto my-6 w-full max-w-2xl space-y-4 rounded-3xl p-6"
          >
            <h3 className="font-display text-lg font-bold">{editing.id ? "Edit Seminar" : "Seminar Baru"}</h3>

            {/* Identitas */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Judul</label>
                <input className="inputCls" placeholder="Judul seminar" required value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Slug (huruf kecil, tanpa spasi)</label>
                <input className="inputCls" placeholder="contoh-slug-unik" required pattern="[a-z0-9-]+" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
            </div>

            {/* Pembicara */}
            <div className="rounded-2xl border border-white/10 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Informasi Pembicara</p>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Nama Pembicara</label>
                <input
                  className="inputCls"
                  placeholder="Misal: Dr. Budi Santoso — Pakar AI, Universitas Lampung"
                  value={editing.speaker ?? ""}
                  onChange={(e) => setEditing({ ...editing, speaker: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">URL Foto Pembicara</label>
                <input
                  className="inputCls"
                  placeholder="https://<URL gambar foto pembicara>"
                  value={editing.speaker_image_url ?? ""}
                  onChange={(e) => setEditing({ ...editing, speaker_image_url: e.target.value })}
                />
              </div>
            </div>

            {/* Waktu & Lokasi */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Tanggal & Waktu</label>
                <input
                  className="inputCls"
                  type="datetime-local"
                  value={editing.scheduled_at ? editing.scheduled_at.slice(0, 16) : ""}
                  onChange={(e) => setEditing({ ...editing, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Lokasi</label>
                <input className="inputCls" placeholder="Misal: Aula Gedung Teknik" value={editing.location ?? ""} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
              </div>
            </div>

            {/* Media */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">URL Gambar Banner</label>
              <input className="inputCls" placeholder="https://<URL gambar banner>" value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Deskripsi Seminar</label>
              <textarea
                rows={5}
                className="inputCls"
                placeholder="Deskripsi acara seminar..."
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Status</label>
              <select className="inputCls" value={editing.status ?? "draft"} onChange={(e) => setEditing({ ...editing, status: e.target.value as "draft" | "published" })}>
                <option className="bg-background" value="draft">Draft</option>
                <option className="bg-background" value="published">Published</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-full border border-white/10 px-4 py-2 text-sm">Batal</button>
              <button type="submit" disabled={save.isPending} className="btn-hero inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold">
                {save.isPending && <Loader2 size={14} className="animate-spin" />} Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SeminarsTab;
