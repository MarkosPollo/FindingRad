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
    <div className="min-h-screen bg-[#fcfcf9]">
      {/* Full-bleed cinematic header */}
      <div
        className="relative w-full"
        style={{ height: "47vh", minHeight: "320px" }}
      >
        {post.thumbnail ? (
          <>
            <img
              src={post.thumbnail}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]" />
        )}

        {/* Back link */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/blog"
            className="text-sm text-white/80 hover:text-white transition-colors bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm"
          >
            &larr; Back
          </Link>
        </div>

        {/* Overlaid title block */}
        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-8 z-10">
          <div className="max-w-[720px] mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-white/70">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{readTime} min read</span>
              {post.videoId && (
                <>
                  <span>·</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs uppercase tracking-wider backdrop-blur-sm">
                    Episode
                  </span>
                </>
              )}
            </div>
            <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.05]">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content column */}
      <div className="max-w-[720px] mx-auto px-6 sm:px-8 py-12">

        {/* Key Takeaways card */}
        {post.takeaways && post.takeaways.length > 0 && (
          <div className="bg-[#FFD23F] rounded-2xl p-6 sm:p-8 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/60 mb-4">
              From this episode
            </p>
            <ul className="space-y-3">
              {post.takeaways.map((item, i) => (
                <li key={i} className="flex gap-3 text-charcoal leading-relaxed">
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-charcoal/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Guest card */}
        {post.guest && (
          <div className="bg-[#1a1a1a] text-white rounded-2xl p-6 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-lg font-bold font-fraunces">{post.guest.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{post.guest.name}</p>
              <p className="text-sm text-white/50 mb-1">{post.guest.handle}</p>
              <p className="text-sm text-white/70 leading-relaxed">{post.guest.bio}</p>
            </div>
          </div>
        )}

        {/* Embedded video */}
        {post.videoId && (
          <div className="mb-10 rounded-2xl overflow-hidden">
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

        {/* Bottom CTA */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="font-fraunces text-2xl font-bold text-charcoal mb-2">Stay in the build.</h2>
          <p className="text-gray-500 mb-6">New episodes, real stories, no fluff.</p>

          <iframe
            src="https://subscribe-forms.beehiiv.com/bb8379d5-911d-46df-a944-3ebea84a1cff"
            data-test-id="beehiiv-embed"
            width="100%"
            height="320"
            frameBorder="0"
            scrolling="no"
            style={{ borderRadius: "16px", border: "1px solid #e5e7eb" }}
          />

          {post.videoId && (
            <div className="mt-6">
              <a
                href={`https://www.youtube.com/watch?v=${post.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-charcoal font-semibold hover:text-[#FFD23F] transition-colors"
              >
                Watch on YouTube &rarr;
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
