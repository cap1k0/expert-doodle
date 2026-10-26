import Link from "next/link";
import { getPublishedArticles } from "./lib/cms";
import { formatDate, readingMinutes } from "./lib/format";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import TrustpilotCta from "./components/TrustpilotCta";
import ArticleExplorer, {
  Cover,
  type CardArticle,
} from "./components/ArticleExplorer";

export const revalidate = 300;

export default async function BlogIndex() {
  const articles = await getPublishedArticles();

  const featured = articles[0];
  const rest: CardArticle[] = articles.slice(1).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    abstract: a.abstract,
    publishedDate: a.publishedDate,
    categories: a.categories?.map((c) => c.title) ?? [],
    cover: a.coverImage?.url,
    coverAlt: a.coverImage?.alt,
    authors: a.author?.map((x) => x.name) ?? [],
    minutes: readingMinutes(a.editedText),
  }));

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <SiteHeader />

        {/* HERO */}
        <section className="relative py-24 sm:py-32">
          <div
            aria-hidden
            className="orb pointer-events-none absolute -right-20 top-4 h-72 w-72 opacity-60 sm:right-0 sm:h-[26rem] sm:w-[26rem] sm:opacity-80"
          />

          <div className="relative max-w-3xl">
            <p className="chip mb-8 px-3.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-black/60">
              <span className="blob h-2 w-2 bg-gradient-to-br from-violet-500 via-orange-400 to-emerald-400" />
              neither · nor · both
            </p>

            <h1 className="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Thinking about
              <br />
              <span className="text-fluid">futuristic progressive world.</span>
            </h1>

            <p className="mt-9 max-w-xl text-base leading-7 text-black/55 sm:text-lg">
               experiments and ideas on how  intelligence
              is changing creativity, and human work.
            </p>
          </div>
        </section>

        {/* FEATURED */}
        {featured ? (
          <section>
            <Link
              href={`/${featured.slug}`}
              className="group glass block overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-25px_rgba(124,92,255,0.35)]"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
                  <div className="absolute inset-0">
                    <Cover
                      article={{
                        title: featured.title,
                        cover: featured.coverImage?.url,
                        coverAlt: featured.coverImage?.alt,
                      }}
                      index={0}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="flex flex-col justify-between p-8 sm:p-12">
                  <div>
                    <div className="mb-6 flex items-center gap-3 text-xs text-black/40">
                      {featured.categories?.[0] && (
                        <span className="chip px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-black/60">
                          {featured.categories[0].title}
                        </span>
                      )}
                      {featured.publishedDate && (
                        <time dateTime={featured.publishedDate}>
                          {formatDate(featured.publishedDate, "short")}
                        </time>
                      )}
                      <span>•</span>
                      <span>{readingMinutes(featured.editedText)} min read</span>
                    </div>

                    <h2 className="text-3xl font-medium leading-tight tracking-[-0.035em] sm:text-4xl">
                      {featured.title}
                    </h2>

                    {featured.abstract && (
                      <p className="mt-5 text-base leading-7 text-black/55">
                        {featured.abstract}
                      </p>
                    )}
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-5">
                    <span className="text-sm font-medium">Read article</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#15131c] text-white transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : (
          <div className="py-20 text-black/50">No articles published yet.</div>
        )}

        {/* GRID + CATEGORY FILTER */}
        {rest.length > 0 && <ArticleExplorer articles={rest} />}

        {/* TRUSTPILOT */}
        <div className="pb-6 pt-4">
          <TrustpilotCta />
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
