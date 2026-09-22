import Link from "next/link";
import Logo from "./components/Logo";
import { getPublishedArticles } from "./lib/cms";
export const revalidate = 300;

export default async function BlogIndex() {
  const articles = await getPublishedArticles();

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <nav className="mb-16 flex items-center justify-between">
          <a href="https://bruca.space">
            <Logo />
          </a>
          <a
            href="https://bruca.space"
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            bruca.space &rarr;
          </a>
        </nav>

        <header className="mb-14">
          <h1 className="mb-2 text-3xl font-medium leading-tight sm:text-4xl">
            Blog
          </h1>
        </header>

        {articles.length === 0 ? (
          <div>
            <p className="text-neutral-500">No articles published yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {articles.map((article) => (
              <article key={article.id} className="py-8 first:pt-0">
                <Link
                  href={`/${article.slug}`}
                  className="mb-2 block text-xl font-medium leading-snug hover:text-blue-700"
                >
                  {article.title}
                </Link>
                {article.abstract && (
                  <p className="mb-3 line-clamp-2 text-neutral-600">
                    {article.abstract}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                  {article.author?.length > 0 && (
                    <span>{article.author.map((a) => a.name).join(", ")}</span>
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
                  {article.categories?.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800"
                    >
                      {c.title}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
