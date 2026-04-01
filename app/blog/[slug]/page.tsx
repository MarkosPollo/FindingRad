import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | Finding Rad" };

  return {
    title: `${post.title} | Finding Rad`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const readTime = estimateReadTime(post.content || "");

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 min-h-screen bg-[#fcfcf9]">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-gray-500 hover:text-charcoal transition-colors mb-8 inline-block"
        >
          &larr; Back to all posts
        </Link>

        <article>
          <header className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-end mb-10 lg:mb-14">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-5 text-sm text-gray-500">
                <span className="px-3 py-1 rounded-full bg-white border border-gray-200">
                  {formatDate(post.date)}
                </span>
                <span className="px-3 py-1 rounded-full bg-yellow/25 text-charcoal border border-yellow/40">
                  {readTime} min read
                </span>
                {post.videoId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${post.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-full bg-charcoal text-white"
                  >
                    Watch episode
                  </a>
                )}
              </div>

              <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.02] mb-5">
                {post.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                {post.excerpt}
              </p>
            </div>

            <div>
              {post.thumbnail ? (
                <div className="rounded-[28px] overflow-hidden border border-gray-200 shadow-sm bg-white">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                </div>
              ) : (
                <div className="rounded-[28px] border border-gray-200 bg-yellow/20 aspect-[4/3]" />
              )}
            </div>
          </header>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
            <div className="bg-white border border-gray-200 rounded-[32px] p-6 sm:p-8 lg:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              {post.videoId && (
                <div className="mb-10 rounded-[24px] overflow-hidden border border-gray-200">
                  <div className="relative" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${post.videoId}`}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}

              <div
                className="blog-prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
            </div>

            <aside className="space-y-5 lg:sticky lg:top-28">
              <div className="bg-charcoal text-white rounded-[28px] p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-3">Why this matters</p>
                <p className="text-lg leading-relaxed text-white/90">
                  These posts should feel like the useful part of the conversation, not a transcript dump.
                </p>
              </div>

              {post.videoId && (
                <div className="bg-white border border-gray-200 rounded-[28px] p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-3">Episode link</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${post.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-charcoal hover:text-yellow transition-colors"
                  >
                    Watch on YouTube &rarr;
                  </a>
                </div>
              )}

              <div className="bg-yellow rounded-[28px] p-6 border border-yellow/50">
                <p className="text-xs uppercase tracking-[0.18em] text-charcoal/60 mb-3">Stay in the build</p>
                <p className="text-charcoal leading-relaxed mb-5">
                  New episodes, better stories, and the real build as it happens.
                </p>
                <Link href="/#waitlist" className="btn-outline inline-block bg-white">
                  Join the waitlist
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
}
