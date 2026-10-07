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
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SiteHeader />

        {/* HERO */}
        <section className="relative overflow-hidden border-b border-black/10 py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative max-w-5xl">
            <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-blue-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
              Bruca Journal
            </p>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-[6.5rem]">
              Thinking about
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                AI, language & bias.
              </span>
            </h1>

            <p className="mt-9 max-w-2xl text-base leading-7 text-black/55 sm:text-lg">
              Research, experiments, and ideas exploring how artificial
              intelligence is changing language, creativity, products, and
              human work.
            </p>
          </div>
        </section>

        {/* FEATURED */}
        {featured ? (
          <section className="pt-14 sm:pt-20">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-black/40">
                Featured
              </span>
              <span className="text-xs text-black/30">
                {articles.length} {articles.length === 1 ? "article" : "articles"}
              </span>
            </div>

            <Link href={`/${featured.slug}`} className="group block">
              <article className="overflow-hidden rounded-[2rem] border border-black/10 bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/10">
                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-[320px] overflow-hidden lg:min-h-[480px]">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <div className="relative flex h-full min-h-[320px] flex-col justify-between p-7 text-white sm:p-10 lg:min-h-[480px]">
                      {featured.categories?.[0] ? (
                        <span className="inline-flex w-fit rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] backdrop-blur">
                          {featured.categories[0].title}
                        </span>
                      ) : (
                        <span />
                      )}
                      <h2 className="max-w-xl text-3xl font-medium leading-tight tracking-[-0.035em] sm:text-4xl lg:text-5xl">
                        {featured.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                    <div>
                      <div className="mb-8 flex items-center gap-3 text-xs text-black/40">
                        {featured.publishedDate && (
                          <time dateTime={featured.publishedDate}>
                            {formatDate(featured.publishedDate, "short")}
                          </time>
                        )}
                        <span>•</span>
                        <span>{readingMinutes(featured.editedText)} min read</span>
                      </div>

                      {featured.abstract && (
                        <p className="max-w-md text-base leading-7 text-black/55 sm:text-lg">
                          {featured.abstract}
                        </p>
                      )}
                    </div>

                    <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-5">
                      <span className="text-sm font-medium">Read article</span>
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
