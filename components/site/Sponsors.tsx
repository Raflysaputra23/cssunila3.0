import { sponsors, mediaPartners } from "@/lib/data";

const Sponsors = () => {
  return (
    <section id="sponsor" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-cyan-strong">
            Didukung Oleh
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            <span className="gradient-text">Sponsor</span> & Media Partner
          </h2>
        </div>

        <div className="glass mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/5 sm:grid-cols-4">
          {sponsors.map((name) => (
            <div
              key={name}
              className="flex h-24 items-center justify-center bg-background/40 px-4 text-center font-display text-sm font-semibold text-foreground/80 transition hover:text-foreground"
            >
              {name}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Media Partner
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {mediaPartners.map((m) => (
              <span key={m} className="font-display font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Sponsors;