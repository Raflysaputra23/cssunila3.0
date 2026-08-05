import { useCallback, useEffect, useRef } from "react";

export type DraftData = {
  teamName: string;
  leaderName: string;
  leaderWhatsapp: string;
  leaderEmail: string;
  slot: number;
  answers: Record<string, string>;
  fileFields: string[];
  savedAt: number;
};

const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

const buildKey = (slug: string, userId: string) => {
  return `css_data_${slug}_${userId}`;
}

export const useFormDraft = (slug: string, userId: string | undefined) => {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveDraft = useCallback(
    (data: Omit<DraftData, "savedAt">) => {
      if (!userId) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        try {
          const payload: DraftData = { ...data, savedAt: Date.now() };
          localStorage.setItem(buildKey(slug, userId), JSON.stringify(payload));
        } catch { }
      }, 600);
    },
    [slug, userId]
  );

  const readDraft = useCallback((): DraftData | null => {
    if (!userId) return null;
    try {
      const raw = localStorage.getItem(buildKey(slug, userId));
      if (!raw) return null;

      const parsed: DraftData = JSON.parse(raw);
      if (Date.now() - parsed.savedAt > EXPIRY_MS) {
        localStorage.removeItem(buildKey(slug, userId));
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }, [slug, userId]);

  const clearDraft = useCallback(() => {
    if (!userId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    try {
      localStorage.removeItem(buildKey(slug, userId));
    } catch { }
  }, [slug, userId]);

  const formatSavedAt = useCallback((savedAt: number): string => {
    const diffMs = Date.now() - savedAt;
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "baru saja";
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} jam lalu`;
    return `${Math.floor(diffHr / 24)} hari lalu`;
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { saveDraft, readDraft, clearDraft, formatSavedAt };
}
