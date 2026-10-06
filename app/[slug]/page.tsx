import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import RichText from "../components/RichText";
import { getArticleBySlug, getPublishedArticles } from "../lib/cms";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getPublishedArticles();

  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  const authorNames = article.author?.map((a) => a.name).join(", ");

  return {
    title: article.title,
    description: article.abstract,
    alternates: {
      canonical: `/${article.slug}`,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.abstract,
      publishedTime: article.publishedDate,
      authors: authorNames ? [authorNames] : undefined,
      images: article.coverImage
        ? [{ url: article.coverImage.url }]
        : undefined,
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

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.bruca.space";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.abstract,
    datePublished: article.publishedDate,
    dateModified: article.updatedAt,
    author: article.author?.map((a) => ({
      "@type": "Person",
      name: a.name,
    })),
    image: article.coverImage?.url,
    mainEntityOfPage: `${siteUrl}/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Bruca",
      url: "https://bruca.space",
    },
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#111]">

      {/* SEO structured data */}
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">

        {/* NAV */}
        <nav className="flex items-center justify-between border-b border-black/10 py-6">

          <a href="https://bruca.space">
            <Logo />
          </a>

          <Link
            href="/"
            className="group flex items-center gap-2 text-sm text-black/50 transition-colors hover:text-black"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            All articles
          </Link>

        </nav>

        <article>

          {/* ARTICLE HEADER */}
          <header className="mx-auto max-w-5xl border-b border-black/10 py-16 sm:py-24">

            <div className="mb-7 flex flex-wrap items-center gap-3">

              {article.categories?.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-black/50"
                >
                  {category.title}
                </span>
              ))}

              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-black/30">
                Bruca Journal
              </span>

            </div>

            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              {article.title}
            </h1>

            {article.abstract && (
              <p className="mt-8 max-w-3xl text-lg leading-8 text-black/50 sm:text-xl">
                {article.abstract}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-black/40">

              {article.author?.length > 0 && (
                <span className="font-medium text-black/65">
                  By {article.author.map((a) => a.name).join(", ")}
                </span>
              )}

              {article.publishedDate && (
                <>
                  <span className="text-black/20">•</span>

                  <time dateTime={article.publishedDate}>
                    {new Date(
                      article.publishedDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </>
              )}

            </div>

          </header>

          {/* COVER */}
          {article.coverImage && (
            <div className="mx-auto max-w-6xl py-10 sm:py-14">

              <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm">

                <img
                  src={article.coverImage.url}
                  alt={article.coverImage.alt || article.title}
                  className="h-auto w-full object-cover"
                />

              </div>

            </div>
          )}

          {/* CONTENT */}
          <div className="mx-auto max-w-3xl pb-24 sm:pb-32">

            <div className="prose-bruca text-black/75">
              <RichText data={article.editedText} />
            </div>

          </div>

        </article>

        {/* FOOTER */}
        <footer className="border-t border-black/10 py-10">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <Link
              href="/"
              className="text-sm font-medium transition-opacity hover:opacity-50"
            >
              ← Back to Bruca Journal
            </Link>

            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/30">
              AI · Language · Bias
            </span>

          </div>

        </footer>

      </div>
    </main>
  );
}
