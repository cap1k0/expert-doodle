import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import RichText from "../components/RichText";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ReadingProgress from "../components/ReadingProgress";
import TrustpilotCta from "../components/TrustpilotCta";
import { Cover } from "../components/ArticleExplorer";
import { getArticleBySlug, getPublishedArticles } from "../lib/cms";
import { formatDate, readingMinutes } from "../lib/format";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  const authorNames = article.author?.map((a) => a.name).join(", ");

  return {
    title: article.title,
    description: article.abstract,
    alternates: { canonical: `/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.abstract,
      publishedTime: article.publishedDate,
      authors: authorNames ? [authorNames] : undefined,
      images: article.coverImage ? [{ url: article.coverImage.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.abstract,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const [article, all] = await Promise.all([
    getArticleBySlug(slug),
    getPublishedArticles(),
  ]);

  if (!article) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.bruca.space";
  const url = `${siteUrl}/${article.slug}`;
  const minutes = readingMinutes(article.editedText);

  const myCats = new Set(article.categories?.map((c) => c.id));
  const others = all.filter((a) => a.slug !== article.slug);
  const related = [
    ...others.filter((a) => a.categories?.some((c) => myCats.has(c.id))),
    ...others.filter((a) => !a.categories?.some((c) => myCats.has(c.id))),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.abstract,
    datePublished: article.publishedDate,
    dateModified: article.updatedAt,
    author: article.author?.map((a) => ({ "@type": "Person", name: a.name })),
    image: article.coverImage?.url,
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "Bruca",
      url: "https://bruca.space",
    },
  };

  const shareText = encodeURIComponent(article.title);
  const shareUrl = encodeURIComponent(url);

  return (
    <main className="min-h-screen">
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <SiteHeader />

        <article>
          {/* HEADER */}
          <header className="mx-auto max-w-4xl py-14 sm:py-20">
            <Link
              href="/"
              className="group mb-10 inline-flex items-center gap-2 text-sm text-black/50 transition-colors hover:text-black"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              All articles
            </Link>

            <div className="mb-7 flex flex-wrap items-center gap-3">
              {article.categories?.map((category) => (
                <span
                  key={category.id}
                  className="chip px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-black/60"
                >
                  {category.title}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {article.title}
            </h1>

            {article.abstract && (
              <p className="mt-8 max-w-3xl text-lg leading-8 text-black/50 sm:text-xl">
                {article.abstract}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-black/10 pt-6 text-sm text-black/45">
              {article.author?.length > 0 && (
                <span className="flex items-center gap-2 font-medium text-black/70">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 via-orange-300 to-emerald-300 text-[11px] font-semibold text-black/80">
                    {article.author[0].name.charAt(0).toUpperCase()}
                  </span>
                  {article.author.map((a) => a.name).join(", ")}
                </span>
              )}
              {article.publishedDate && (
                <>
                  <span className="text-black/20">•</span>
                  <time dateTime={article.publishedDate}>
                    {formatDate(article.publishedDate)}
                  </time>
                </>
              )}
              <span className="text-black/20">•</span>
              <span>{minutes} min read</span>
            </div>
          </header>

          {/* COVER */}
          {article.coverImage && (
            <div className="mx-auto max-w-5xl pb-12 sm:pb-16">
              <div className="glass overflow-hidden rounded-[1.75rem]">
                <Cover
                  article={{
                    title: article.title,
                    cover: article.coverImage.url,
                    coverAlt: article.coverImage.alt,
                  }}
                  index={0}
                />
              </div>
            </div>
          )}

          {/* CONTENT */}
          <div className="mx-auto max-w-3xl pb-12">
            <div className="prose-bruca text-black/75">
              <RichText data={article.editedText} />
            </div>

            {/* SHARE */}
            <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-black/10 pt-8">
              <span className="mr-2 text-sm text-black/45">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chip px-4 py-2 text-xs font-medium transition-colors hover:bg-[#15131c] hover:text-white"
              >
                X / Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chip px-4 py-2 text-xs font-medium transition-colors hover:bg-[#15131c] hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </article>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="border-t border-black/10 py-14 sm:py-20">
            <h2 className="mb-10 text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
              Keep reading
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.id}
                  href={`/${a.slug}`}
                  className="group glass flex min-h-[220px] flex-col justify-between rounded-[1.75rem] p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-25px_rgba(124,92,255,0.35)]"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-black/35">
                    {a.categories?.[0]?.title ?? "Article"}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium leading-snug tracking-[-0.02em] transition-colors group-hover:text-violet-600">
                      {a.title}
                    </h3>
                    <span className="mt-4 block text-xs text-black/40">
                      {readingMinutes(a.editedText)} min read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TRUSTPILOT */}
        <div className="pb-6">
          <TrustpilotCta />
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
