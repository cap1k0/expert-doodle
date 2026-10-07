"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate } from "../lib/format";

export type CardArticle = {
  id: string;
  slug: string;
  title: string;
  abstract?: string;
  publishedDate?: string;
  categories: string[];
  cover?: string;
  coverAlt?: string;
  authors: string[];
  minutes: number;
};

export const GRADIENTS = [
  "from-blue-600 to-indigo-800",
  "from-emerald-500 to-teal-800",
  "from-orange-400 to-rose-600",
  "from-violet-500 to-fuchsia-800",
  "from-slate-600 to-slate-900",
];

export function Cover({
  article,
  index,
  className = "",
}: {
  article: Pick<CardArticle, "cover" | "coverAlt" | "title">;
  index: number;
  className?: string;
}) {
  if (article.cover) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={article.cover}
        alt={article.coverAlt || article.title}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`relative flex h-full w-full items-end bg-gradient-to-br p-6 ${GRADIENTS[index % GRADIENTS.length]} ${className}`}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:18px_18px]" />
      <span className="relative text-6xl font-semibold tracking-[-0.06em] text-white/90">
        {article.title.trim().charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

export default function ArticleExplorer({
  articles,
  startIndex = 1,
}: {
  articles: CardArticle[];
  startIndex?: number;
}) {
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.categories.forEach((c) => set.add(c)));
    return ["All", ...Array.from(set)];
  }, [articles]);

  const visible =
    active === "All"
      ? articles
      : articles.filter((a) => a.categories.includes(active));

  return (
    <section className="py-14 sm:py-20">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">
            Latest
          </p>
          <h2 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
            Recent thinking
          </h2>
        </div>

        {categories.length > 2 && (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  active === c
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black/55 hover:border-black/30 hover:text-black"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-black/45">Nothing in this category yet.</p>
      ) : (
        <div className="grid gap-x-7 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((a, i) => (
            <Link key={a.id} href={`/${a.slug}`} className="group flex flex-col">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-black/10 bg-white">
                <Cover
                  article={a}
                  index={i + startIndex}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                {a.categories[0] && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-black/70 backdrop-blur">
                    {a.categories[0]}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-2 text-xs text-black/40">
                {a.publishedDate && (
                  <time dateTime={a.publishedDate}>
                    {formatDate(a.publishedDate, "short")}
                  </time>
                )}
                <span>•</span>
                <span>{a.minutes} min read</span>
              </div>

              <h3 className="mt-2 text-xl font-medium leading-snug tracking-[-0.025em] transition-colors group-hover:text-blue-600 sm:text-2xl">
                {a.title}
              </h3>

              {a.abstract && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/50">
                  {a.abstract}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between text-xs text-black/40">
                <span>{a.authors.join(", ")}</span>
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
