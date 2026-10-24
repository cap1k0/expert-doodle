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

// Soft three-colour fields — no hard edges, nothing is one colour.
const MESHES: [string, string, string][] = [
  ["#c4b5fd", "#fdba9b", "#a7f0d2"],
  ["#a7f0d2", "#fde68a", "#c4b5fd"],
  ["#fdba9b", "#f9a8d4", "#fde68a"],
  ["#93c5fd", "#c4b5fd", "#a7f0d2"],
  ["#fde68a", "#a7f0d2", "#fdba9b"],
];

function mesh([a, b, c]: [string, string, string]) {
  return `radial-gradient(60% 70% at 20% 20%, ${a}, transparent 70%), radial-gradient(60% 70% at 85% 30%, ${b}, transparent 70%), radial-gradient(70% 80% at 50% 100%, ${c}, transparent 70%), #f3efff`;
}

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
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: mesh(MESHES[index % MESHES.length]) }}
    >
      <div className="blob absolute aspect-square h-2/3 bg-white/35 backdrop-blur-md" />
      <span className="relative text-6xl font-semibold tracking-[-0.06em] text-black/70">
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
        <h2 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
          Recent thinking
        </h2>

        {categories.length > 2 && (
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  active === c
                    ? "bg-[#15131c] text-white"
                    : "chip text-black/55 hover:text-black"
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((a, i) => (
            <Link
              key={a.id}
              href={`/${a.slug}`}
              className="group glass flex flex-col overflow-hidden rounded-[1.75rem] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-25px_rgba(124,92,255,0.35)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Cover
                  article={a}
                  index={i + startIndex}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
                {a.categories[0] && (
                  <span className="chip absolute left-3 top-3 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-black/70">
                    {a.categories[0]}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-black/40">
                  {a.publishedDate && (
                    <time dateTime={a.publishedDate}>
                      {formatDate(a.publishedDate, "short")}
                    </time>
                  )}
                  <span>•</span>
                  <span>{a.minutes} min read</span>
                </div>

                <h3 className="mt-3 text-xl font-medium leading-snug tracking-[-0.025em] transition-colors group-hover:text-violet-600">
                  {a.title}
                </h3>

                {a.abstract && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/50">
                    {a.abstract}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-5 text-xs text-black/40">
                  <span>{a.authors.join(", ")}</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
