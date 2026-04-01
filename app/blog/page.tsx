import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Finding Rad",
  description: "Stories from the build. Founder lessons, product journeys, and the real process.",
};

function formatDate(date: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 min-h-screen bg-[#fcfcf9]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">Finding Rad Journal</p>
          <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal mb-4 leading-tight">
            Better stories from the build.
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Not transcript sludge. Real posts, sharp structure, strong visuals, and a cleaner way to revisit the ideas behind each episode.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="space-y-10">
            {/* Featured post */}
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid lg:grid-cols-2 gap-0 bg-white border border-gray-200 rounded-[32px] overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all"
              >
                {/* Thumbnail — left on desktop */}
                <div className="relative order-1 lg:order-none overflow-hidden" style={{ minHeight: "300px" }}>
                  {featured.thumbnail ? (
                    <img
                      src={featured.thumbnail}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#FFD23F]/20" />
                  )}
                </div>

                {/* Text — right on desktop */}
                <div className="flex flex-col justify-between p-8 sm:p-10 order-2 lg:order-none">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-5 text-sm">
                      <span className="px-3 py-1 rounded-full bg-[#FFD23F] text-charcoal font-semibold text-xs uppercase tracking-wider">
                        Featured
                      </span>
                      <span className="text-gray-400">{formatDate(featured.date)}</span>
                    </div>
                    <h2 className="font-fraunces text-[2.5rem] font-bold text-charcoal leading-tight mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {featured.excerpt}
                    </p>
                  </div>
                  <p className="mt-8 text-sm font-semibold text-charcoal group-hover:text-[#FFD23F] transition-colors">
                    Read the story &rarr;
                  </p>
                </div>
              </Link>
            )}

            {/* Rest of posts — 2-column grid */}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block bg-white border border-gray-200 rounded-[28px] overflow-hidden hover:border-[#FFD23F] hover:shadow-sm transition-all"
                  >
                    {/* Thumbnail — 16:10 */}
                    <div className="overflow-hidden" style={{ aspectRatio: "16/10" }}>
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FFD23F]/20" />
                      )}
                    </div>

                    <div className="p-6">
                      <p className="text-sm text-gray-400 mb-2">{formatDate(post.date)}</p>
                      <h2 className="font-fraunces text-2xl font-semibold text-charcoal mb-3 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed text-[0.95rem]">{post.excerpt}</p>
                      <p className="text-sm font-semibold text-charcoal mt-5 group-hover:text-[#FFD23F] transition-colors">
                        Read &rarr;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
