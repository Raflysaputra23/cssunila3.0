"use client"

import { createClient } from "@/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  status: "draft" | "published";
  image_url: string | null;
  content: string | null;
  drive_link: string | null;
  gallery: string[] | null;
};

const NewsTab = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<NewsRow> | null>(null);
  const suparef = useRef(createClient());

  const { data, isLoading } = useQuery({
    queryKey: ["admin-news"],
    queryFn: async (): Promise<NewsRow[]> => {
      const supabase = suparef.current;
      const { data, error } = await supabase.from("news").select("id,slug,title,excerpt,category,status,image_url,content,drive_link,gallery").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = useMutation({
    mutationFn: async (v: Partial<NewsRow>) => {
      const payload = {
        slug: v.slug!, title: v.title!, excerpt: v.excerpt ?? null, category: v.category ?? null,
        status: v.status ?? "draft", image_url: v.image_url ?? null, content: v.content ?? null,
        drive_link: v.drive_link ?? null,
        gallery: (v.gallery ?? []).filter(Boolean),
        published_at: v.status === "published" ? new Date().toISOString() : null,
      };
      const supabase = suparef.current;
      if (v.id) {
        const { error } = await supabase.from("news").update(payload).eq("id", v.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Tersimpan");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-news"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const supabase = suparef.current;
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Dihapus");
      qc.invalidateQueries({ queryKey: ["admin-news"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setEditing({ status: "draft" })} className="btn-hero inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold">
          <Plus size={14} /> Berita baru
        </button>
      </div>
      {isLoading && <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">Memuat…</div>}
      <div className="space-y-2">
        {data?.map((n) => (
          <div key={n.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
            <div>
              <p className="font-display font-semibold">{n.title}</p>
              <p className="text-xs text-muted-foreground">/{n.slug} · {n.category ?? "—"} · {n.status}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(n)} className="rounded-full bg-white/5 p-2 hover:bg-white/10"><Pencil size={14} /></button>
              <button onClick={() => confirm(`Hapus ${n.title}?`) && del.mutate(n.id)} className="rounded-full bg-destructive/15 p-2 text-destructive hover:bg-destructive/25"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
         {!isLoading && (!data || data.length === 0) && (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">Belum ada berita.</div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 p-4 backdrop-blur">
          <form
            onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}
            className="glass-strong mx-auto my-6 w-full max-w-2xl space-y-4 rounded-3xl p-6"
          >
            <h3 className="font-display text-lg font-bold">{editing.id ? "Edit Berita" : "Berita Baru"}</h3>

            {/* Identitas */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Judul</label>
                <input className="inputCls" placeholder="Judul berita" required value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Slug (huruf kecil, tanpa spasi)</label>
                <input className="inputCls" placeholder="contoh-slug-unik" required pattern="[a-z0-9-]+" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Kategori</label>
                <input className="inputCls" placeholder="Misal: Pengumuman" value={editing.category ?? ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Status</label>
                <select className="inputCls" value={editing.status ?? "draft"} onChange={(e) => setEditing({ ...editing, status: e.target.value as "draft" | "published" })}>
                  <option className="bg-background" value="draft">Draft</option>
                  <option className="bg-background" value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Media */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">URL Gambar Banner</label>
              <input className="inputCls" placeholder="https://<URL>" value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Link Google Drive (Opsional)</label>
              <input className="inputCls" placeholder="https://drive.google.com/..." value={editing.drive_link ?? ""} onChange={(e) => setEditing({ ...editing, drive_link: e.target.value })} />
            </div>

            {/* Galeri */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Galeri Foto Dokumentasi (URL tiap gambar)</label>
                <button
                  type="button"
                  onClick={() => setEditing({ ...editing, gallery: [...(editing.gallery ?? []), ""] })}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs hover:bg-white/5"
                >
                  <Plus size={10} /> Tambah Foto
                </button>
              </div>
              {(editing.gallery ?? []).map((url, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="inputCls flex-1"
                    placeholder={`https://... (foto ${i + 1})`}
                    value={url}
                    onChange={(e) => {
                      const g = [...(editing.gallery ?? [])];
                      g[i] = e.target.value;
                      setEditing({ ...editing, gallery: g });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const g = [...(editing.gallery ?? [])].filter((_, j) => j !== i);
                      setEditing({ ...editing, gallery: g });
                    }}
                    className="rounded-full p-2 text-destructive hover:bg-destructive/10"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {(editing.gallery ?? []).length === 0 && (
                <p className="text-xs text-destructive italic">Belum ada foto galeri. Klik &quot;Tambah Foto&quot; untuk menambahkan.</p>
              )}
            </div>

            {/* Konten */}
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Ringkasan</label>
              <textarea className="inputCls" rows={2} placeholder="Ringkasan singkat berita..." value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground after:content-['*'] after:ml-1 after:text-red-500">Konten Lengkap</label>
              <textarea className="inputCls" rows={8} placeholder="Isi berita selengkapnya... (bisa multi-paragraf, tekan Enter untuk paragraf baru)" value={editing.content ?? ""} onChange={(e) => setEditing({ ...editing, content: e.target.value })} />
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

export default NewsTab;