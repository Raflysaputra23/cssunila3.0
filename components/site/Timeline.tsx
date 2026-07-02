import { eventTimeline } from "@/lib/data";

type TimelineItem = {
  date: string;
  label: string;
  description: string;
};

type TimelineProps = {
  items?: TimelineItem[];
};

const Timeline = ({ items }: TimelineProps) => {
  const timelineItems: TimelineItem[] =
    items && items.length > 0
      ? items
      : eventTimeline.map((e) => ({
          date: e.date,
          label: e.label,
          description: e.description,
        }));

  return (
    <section id="timeline" className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-cyan-strong">
            Rangkaian Acara
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Timeline <span className="gradient-text">CSS 3.0</span>
          </h2>
        </div>

        <ol className="relative flex flex-col">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-sapphire via-cyan-strong to-transparent md:left-1/2" />
          {timelineItems.map((item, i) => (
            <li
              key={`${item.label}-${i}`}
              className="relative mb-8 md:mb-12 w-full"
            >
              <span
                className="absolute left-4 top-6 size-3 -translate-x-1/2 rounded-full bg-cyan-strong shadow-[0_0_14px_var(--cyan-strong)] md:left-1/2"
                aria-hidden
              />
              <div
                className={`glass ml-10 p-5 rounded-2xl md:ml-0 md:w-[calc(50%-2.5rem)] ${
                  i % 2 === 0
                    ? "md:mr-auto md:text-right"
                    : "md:ml-auto md:text-left"
                }`}
              >
                <div className="text-xs font-medium tracking-wider text-cyan-strong uppercase glass inline-flex justify-center items-center rounded-xl px-2.5 py-2">
                  {item.date}
                </div>
                <h3 className="mt-1 font-display text-xl font-semibold">
                  {item.label}
                </h3>
                <p className="text-sm text-muted-foreground text-justify mt-2">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Timeline;