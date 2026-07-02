import { Info } from "lucide-react";

const HelpLabel = ({ label, hint, required }: { label: string; hint: string; required?: boolean }) => {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-foreground/90">
        {label} {required && <span className="text-destructive">*</span>}
        <span className="group relative inline-flex">
          <Info size={12} className="cursor-help text-muted-foreground" />
          <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-56 -translate-x-1/2 rounded-lg bg-background/95 p-2 text-[10px] text-muted-foreground shadow-lg ring-1 ring-white/10 group-hover:block">
            {hint}
          </span>
        </span>
      </span>
    </label>
  );
}

export default HelpLabel;