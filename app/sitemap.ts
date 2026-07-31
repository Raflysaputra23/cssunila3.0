import { createClient } from "@/supabase/server";
import type { MetadataRoute } from "next";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data: competitions } = await supabase
    .from("competitions")
    .select("slug, updated_at");

  const competitionPages =
    competitions?.map((competition) => ({
      url: `${baseUrl}/lomba/${competition.slug}`,
      lastModified: competition.updated_at
        ? new Date(competition.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })) ?? [];

  const { data: news } = await supabase.from("news").select("slug, updated_at");
  const newsPages =
    news?.map((n) => ({
      url: `${baseUrl}/lomba/${n.slug}`,
      lastModified: n.updated_at ? new Date(n.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) ?? [];

  const { data: seminars } = await supabase
    .from("seminars")
    .select("slug, updated_at");
  const seminarPages =
    seminars?.map((seminar) => ({
      url: `${baseUrl}/lomba/${seminar.slug}`,
      lastModified: seminar.updated_at
        ? new Date(seminar.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) ?? [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tentang-kami`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pengumuman`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...competitionPages,
    ...newsPages,
    ...seminarPages,
  ];
}

export default sitemap;