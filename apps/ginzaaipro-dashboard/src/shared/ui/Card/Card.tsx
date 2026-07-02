import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function Card({ title, description, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
      {(title || description) && (
        <header className="mb-5">
          {title && (
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          )}

          {description && (
            <p className="mt-2 text-sm text-slate-400">{description}</p>
          )}
        </header>
      )}

      {children}
    </section>
  );
}
