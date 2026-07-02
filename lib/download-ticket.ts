import { createClient } from "@/supabase/client";
import { jsPDF } from "jspdf";
import QR from "qrcode";

type Row = {
    id: string;
    team_name: string;
    leader_name: string;
    leader_whatsapp: string;
    status: string;
    created_at: string;
    competition: { id: string; slug: string; name: string } | null;
    payments: { amount_idr: number; status: string };
};

const downloadTicket = async (r: Row) => {
    const supabase = createClient();
    let group: { link_url: string | null; qr_url: string | null } | null = null;

    if (r.competition?.id) {
        const { data } = await supabase
            .from("group_links")
            .select("link_url,qr_url")
            .eq("competition_id", r.competition.id)
            .maybeSingle();
        group = data ?? null;
    }

    const doc = new jsPDF({ unit: "pt", format: "a5" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    doc.setFillColor(11, 18, 32);
    doc.rect(0, 0, w, 110, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("CSS 3.0", 28, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("E-Tiket Peserta Resmi", 28, 72);
    doc.setFontSize(9);
    doc.text(new Date(r.created_at).toLocaleString("id-ID"), 28, 90);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    let y = 150;
    const line = (label: string, value: string) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(120, 120, 130);
        doc.text(label, 28, y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        const wrapped = doc.splitTextToSize(value, w - 170);
        doc.text(wrapped, 28, y + 14);
        y += 14 + wrapped.length * 12 + 10;
    };
    line("Lomba", r.competition?.name ?? "-");
    line("Nama Tim", r.team_name);
    line("Ketua", `${r.leader_name} · ${r.leader_whatsapp}`);
    line("Biaya", `Rp. ${(r.payments?.amount_idr ?? 0).toLocaleString("id-ID")}`);

    try {
        const qr = await QR.toDataURL(`${r.id}-${r.competition?.name}-${r.team_name}`, { margin: 1, width: 220 });
        doc.addImage(qr, "PNG", w - 140, 140, 110, 110);
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 130);
        doc.text(`ID: ${r.id.slice(0, 8)}`, w - 140, 262);
    } catch {  }

    const cx = w - 90;
    const cy = y + 70;
    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 0.85 }));
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(3);
    doc.circle(cx, cy, 42, "S");
    doc.setLineWidth(1);
    doc.circle(cx, cy, 36, "S");
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("LUNAS", cx, cy - 4, { align: "center" });
    doc.setFontSize(8);
    doc.text("VALID • CSS 3.0", cx, cy + 12, { align: "center" });
    doc.restoreGraphicsState();

    const gy = y + 20;
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.5);
    doc.line(28, gy, w - 28, gy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("Selamat! Pembayaran terverifikasi.", 28, gy + 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 90, 110);
    const msg = "Terima kasih telah mendaftar di CSS 3.0. Tunjukkan tiket ini saat technical meeting & hari-H. Gabung grup peserta untuk info teknis:";
    doc.text(doc.splitTextToSize(msg, w - 56), 28, gy + 36);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 99, 184);
    doc.text(group?.link_url ?? "Link grup akan dibagikan panitia.", 28, gy + 78);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 145, 155);
    doc.text("Tiket sah jika QR dapat diverifikasi panitia.", 28, h - 22);

    doc.save(`tiket-CSS3.0-${r.team_name}.pdf`);
}

export default downloadTicket;