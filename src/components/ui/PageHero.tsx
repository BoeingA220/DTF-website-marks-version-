export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-ink text-white">
      <div className="container-brand py-12 sm:py-16">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-cyan">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
