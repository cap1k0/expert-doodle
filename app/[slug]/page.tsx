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

// Pre-renders every published article at build time. New articles
// published later are picked up on-demand via ISR without a redeploy.
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
    alternates: {
      canonical: `/${article.slug}`,
    },
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
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.bruca.space";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.abstract,
    datePublished: article.publishedDate,
    dateModified: article.updatedAt,
    author: article.author?.map((a) => ({ "@type": "Person", name: a.name })),
    image: article.coverImage?.url,
    mainEntityOfPage: `${siteUrl}/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Bruca",
      url: "https://bruca.space",
    },
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-6 py-8">
        <nav className="mb-14 flex items-center justify-between">
          <a href="https://bruca.space">
            <Logo />
          </a>
          <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← All articles
          </Link>
        </nav>

        <article>
          {article.categories?.[0] && (
            <p className="mb-3 text-sm font-medium text-blue-700">
              {article.categories[0].title}
            </p>
          )}

          <h1 className="mb-4 text-3xl font-medium leading-tight sm:text-4xl">
            {article.title}
          </h1>

          <div className="mb-10 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            {article.author?.length > 0 && (
              <span className="text-neutral-700">
                {article.author.map((a) => a.name).join(", ")}
              </span>
            )}
            {article.publishedDate && (
              <time dateTime={article.publishedDate}>
                {new Date(article.publishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          {article.coverImage && (
            <img
              src={article.coverImage.url}
              alt={article.coverImage.alt || article.title}
              className="mb-10 w-full rounded-lg border border-neutral-200"
            />
          )}

          {article.abstract && (
            <p className="mb-10 border-l-2 border-blue-600 pl-4 text-lg italic text-neutral-700">
              {article.abstract}
            </p>
          )}

          <div className="prose-bruca max-w-none text-base text-neutral-800">
            <RichText data={article.editedText} />
          </div>
        </article>
      </div>
    </main>
  );
}
