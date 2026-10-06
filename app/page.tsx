import Link from "next/link";
import { getPublishedArticles } from "./lib/cms";

export const revalidate = 300;

export default async function BlogIndex() {
  const articles = await getPublishedArticles();

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8 sm:py-14">
        <nav className="mb-20 flex items-center justify-between border-b border-neutral-200 pb-5">
          <span className="text-sm font-semibold tracking-tight text-neutral-900">
            BRUCA
          </span>

          <a
            href="https://bruca.space"
            className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          >
            bruca.space <span className="ml-1">→</span>
          </a>
        </nav>

        <header className="mb-16">
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-blue-700">
            Insights & Research
          </p>

          <h1 className="mb-5 text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
            Blog
          </h1>

          <p className="max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
            Research, ideas, and perspectives on AI, language, creativity,
            technology, and the future of human work.
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="border-t border-neutral-200 py-10">
            <p className="text-neutral-500">
              No articles published yet.
            </p>
          </div>
        ) : (
          <div className="border-t border-neutral-200">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group border-b border-neutral-200 py-9"
              >
                <Link href={`/${article.slug}`} className="block">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                    {article.publishedDate && (
                      <time dateTime={article.publishedDate}>
                        {new Date(
                          article.publishedDate
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    )}

                    {article.categories?.length > 0 && (
                      <>
                        <span>·</span>

                        {article.categories.map((c) => (
                          <span
                            key={c.id}
                            className="font-medium text-blue-700"
                          >
                            {c.title}
                          </span>
                        ))}
                      </>
                    )}
                  </div>

                  <h2 className="mb-3 max-w-3xl text-xl font-medium leading-snug tracking-tight transition-colors group-hover:text-blue-700 sm:text-2xl">
                    {article.title}
                  </h2>

                  {article.abstract && (
                    <p className="max-w-2xl line-clamp-2 text-sm leading-6 text-neutral-500 sm:text-base">
                      {article.abstract}
                    </p>
                  )}

                  {article.author?.length > 0 && (
                    <div className="mt-5 text-xs text-neutral-400">
                      By {article.author.map((a) => a.name).join(", ")}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
