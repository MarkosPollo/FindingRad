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
  const words = html
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found | Finding Rad" };

  return {
    title: `${post.title} | Finding Rad`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const readTime = estimateReadTime(post.content || "");
  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-[#fcfcf9]">
      {/* Full-bleed cinematic header */}
      <div
        className="relative w-full"
        style={{ height: "52vh", minHeight: "380px" }}
      >
        {post.thumbnail ? (
          <>
            <img
              src={post.thumbnail}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]" />
        )}

        {/* Back link */}
        <div className="absolute top-20 left-6 z-10">
          <Link
            href="/blog"
            className="text-sm text-white/80 hover:text-white transition-colors bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm inline-flex items-center gap-1.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-80">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Posts
          </Link>
        </div>

        {/* Overlaid title block */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-10 z-10">
          <div className="max-w-[720px] mx-auto">
            <div className="flex flex-wrap items-center gap-2.5 mb-4 text-sm text-white/70">
              <span>{formatDate(post.date)}</span>
              <span className="text-white/30">·</span>
              <span>{readTime} min read</span>
              {post.videoId && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFD23F]/90 text-charcoal text-xs font-semibold uppercase tracking-wider">
                    Episode
                  </span>
                </>
              )}
            </div>
            <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-[3.25rem] font-bold text-white leading-[1.08] tracking-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-white/70 text-lg leading-relaxed max-w-[560px]">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content column */}
      <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-14">
        {/* Key Takeaways card */}
        {post.takeaways && post.takeaways.length > 0 && (
          <div className="bg-[#FFD23F] rounded-2xl p-6 sm:p-8 mb-10 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/50 mb-5">
              Key Takeaways
            </p>
            <ul className="space-y-3.5">
              {post.takeaways.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-charcoal leading-relaxed"
                >
                  <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-charcoal/40" />
                  <span className="text-[0.95rem]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Guest card */}
        {post.guest && (
          <div className="bg-[#1a1a1a] text-white rounded-2xl p-6 sm:p-7 mb-10 flex items-start gap-5">
            <div className="w-12 h-12 rounded-full bg-[#FFD23F]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xl font-bold font-fraunces text-[#FFD23F]">
                {post.guest.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-white text-lg">
                {post.guest.name}
              </p>
              <p className="text-sm text-[#FFD23F]/70 mb-1.5">
                {post.guest.handle}
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                {post.guest.bio}
              </p>
            </div>
          </div>
        )}

        {/* Embedded video */}
        {post.videoId && (
          <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
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

        {/* Body content */}
        <article>
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>

        {/* Watch on YouTube CTA — Hibear style */}
        {post.videoId && (
          <div className="mt-16 bg-[#1a1a1a] rounded-2xl p-8 sm:p-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-3">
              Watch the Full Episode
            </p>
            <h3 className="font-fraunces text-2xl font-bold text-white mb-3">
              {post.title}
            </h3>
            <p className="text-white/50 text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Hear the full conversation. Every story, every insight, every moment we couldn&apos;t fit on the page.
            </p>
            <a
              href={`https://www.youtube.com/watch?v=${post.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#FFD23F] text-charcoal font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Watch on YouTube
            </a>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-12 pt-10 border-t border-gray-200">
          <div className="text-center">
            <h2 className="font-fraunces text-2xl sm:text-3xl font-bold text-charcoal mb-2">
              Stay in the build.
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              New episodes, real stories, no fluff. Get updates when I drop new content.
            </p>
            <iframe
              src="https://subscribe-forms.beehiiv.com/bb8379d5-911d-46df-a944-3ebea84a1cff"
              data-test-id="beehiiv-embed"
              width="100%"
              height="320"
              frameBorder="0"
              scrolling="no"
              style={{
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                maxWidth: "480px",
                margin: "0 auto",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Prev/Next navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-14 pt-10 border-t border-gray-200 grid grid-cols-2 gap-6">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group text-left"
              >
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                  Previous
                </p>
                <p className="font-fraunces font-semibold text-charcoal group-hover:text-[#FFD23F] transition-colors leading-snug">
                  {prevPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group text-right"
              >
                <p className="text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                  Next
                </p>
                <p className="font-fraunces font-semibold text-charcoal group-hover:text-[#FFD23F] transition-colors leading-snug">
                  {nextPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
