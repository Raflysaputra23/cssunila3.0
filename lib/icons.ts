import { Gamepad2, Trophy, Brain, Code2, Mic, Camera, Music, Palette, Sparkles, Star, Award, Cpu, type LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  Gamepad2, Trophy, Brain, Code2, Mic, Camera, Music, Palette, Sparkles, Star, Award, Cpu,
};

export const iconNames = Object.keys(iconMap);

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Trophy;
  return iconMap[name] ?? Trophy;
}

export const accentGlow: Record<string, string> = {
  sapphire: "from-sapphire/40 to-transparent",
  cyan: "from-cyan-strong/40 to-transparent",
  evergreen: "from-emerald-500/30 to-transparent",
  twilight: "from-twilight/40 to-transparent",
};

export const accentOptions = ["cyan", "sapphire", "evergreen", "twilight"] as const;