import Link from "next/link";
import { getPublishedArticles } from "./lib/cms";

export const revalidate = 300;

export default async function BlogIndex() {
  const articles = await getPublishedArticles();

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* NAVIGATION */}
        <nav className="flex items-center justify-between border-b border-black/10 py-6">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white transition-transform group-hover:rotate-12">
              B
            </span>

            <span className="text-sm font-semibold tracking-[0.18em]">
              BRUCA
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <a
              href="https://bruca.space"
              className="hidden text-sm text-black/50 transition-colors hover:text-black sm:block"
            >
              Main site
            </a>

            <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium">
              Research & Ideas
            </span>
          </div>
        </nav>

        {/* HERO */}
        <header className="relative overflow-hidden border-b border-black/10 py-20 sm:py-28">

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative max-w-5xl">
            <p className="mb-7 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-blue-600">
              Bruca / Journal
            </p>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-[6.5rem]">
              Thinking about
              <br />
              <span className="text-black/35">AI, language & bias.</span>
            </h1>

            <p className="mt-9 max-w-2xl text-base leading-7 text-black/55 sm:text-lg">
              Research, experiments, and ideas exploring how artificial
              intelligence is changing language, creativity, products,
              and human work.
            </p>
          </div>
        </header>

        {/* FEATURED */}
        {featured ? (
          <section className="py-14 sm:py-20">

            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">
                Featured
              </span>

              <span className="text-xs text-black/30">
                01 / {articles.length.toString().padStart(2, "0")}
              </span>
            </div>

            <Link
              href={`/${featured.slug}`}
              className="group block"
            >
              <article className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">

                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

                  <div className="relative min-h-[360px] overflow-hidden bg-[#111] p-7 text-white sm:p-10 lg:min-h-[500px]">

                    <div className="absolute right-10 top-10 h-40 w-40 rounded-full border border-white/10" />
                    <div className="absolute right-20 top-20 h-20 w-20 rounded-full border border-white/10" />

                    <div className="absolute bottom-8 left-8 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                      BRUCA / 001
                    </div>

                    <div className="relative flex h-full min-h-[300px] flex-col justify-between">

                      <div>
                        {featured.categories?.[0] && (
                          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white/70">
                            {featured.categories[0].title}
                          </span>
                        )}
                      </div>

                      <div className="max-w-xl">
                        <p className="mb-4 text-sm text-white/40">
                          Featured research
                        </p>

                        <h2 className="text-3xl font-medium leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                          {featured.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">

                    <div>
                      <div className="mb-8 flex items-center gap-3 text-xs text-black/40">
                        {featured.publishedDate && (
                          <time dateTime={featured.publishedDate}>
                            {new Date(
                              featured.publishedDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        )}

                        <span>•</span>

                        <span>Article</span>
                      </div>

                      {featured.abstract && (
                        <p className="max-w-md text-base leading-7 text-black/55 sm:text-lg">
                          {featured.abstract}
                        </p>
                      )}
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-5">

                      <span className="text-sm font-medium">
                        Read article
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 transition-all duration-300 group-hover:bg-black group-hover:text-white">
                        →
                      </span>

                    </div>
                  </div>

                </div>
              </article>
            </Link>
          </section>
        ) : (
          <div className="py-20 text-black/50">
            No articles published yet.
          </div>
        )}

        {/* ARTICLE GRID */}
        {rest.length > 0 && (
          <section className="border-t border-black/10 py-14 sm:py-20">

            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">
                  Latest
                </p>

                <h2 className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">
                  Recent thinking
                </h2>
              </div>

              <span className="hidden text-xs text-black/30 sm:block">
                {rest.length} articles
              </span>
            </div>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 md:grid-cols-2 lg:grid-cols-3">

              {rest.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/${article.slug}`}
                  className="group bg-[#f7f7f5] p-7 transition-colors duration-300 hover:bg-white sm:p-8"
                >
                  <article className="flex h-full min-h-[320px] flex-col">

                    <div className="flex items-center justify-between">

                      <span className="font-mono text-[10px] text-black/30">
                        {String(index + 2).padStart(2, "0")}
                      </span>

                      {article.categories?.[0] && (
                        <span className="rounded-full border border-black/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-black/45">
                          {article.categories[0].title}
                        </span>
                      )}

                    </div>

                    <div className="mt-auto">

                      {article.publishedDate && (
                        <time
                          dateTime={article.publishedDate}
                          className="mb-4 block text-xs text-black/35"
                        >
                          {new Date(
                            article.publishedDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}

                      <h3 className="text-xl font-medium leading-snug tracking-[-0.025em] transition-transform duration-300 group-hover:translate-x-1 sm:text-2xl">
                        {article.title}
                      </h3>

                      {article.abstract && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/45">
                          {article.abstract}
                        </p>
                      )}

                      <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">

                        {article.author && article.author.length > 0 ? (
                          <span className="text-xs text-black/40">
                            {article.author.map((a) => a.name).join(", ")}
                          </span>
                        ) : (
                          <span />
                        )}

                        <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                          ↗
                        </span>

                      </div>

                    </div>
                  </article>
                </Link>
              ))}

            </div>
          </section>
        )}

        {/* FOOTER */}
        <footer className="border-t border-black/10 py-10">

          <div className="flex flex-col gap-5 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between">

            <span>
              © {new Date().getFullYear()} Bruca
            </span>

            <div className="flex gap-5">
              <a
                href="https://bruca.space"
                className="transition-colors hover:text-black"
              >
                bruca.space
              </a>

              <span>AI · Language · Bias</span>
            </div>

          </div>
        </footer>

      </div>
    </main>
  );
}
