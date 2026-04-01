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
            {featured && (
              <Link
                href={`/blog/${featured.slug}`}
                className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 bg-white border border-gray-200 rounded-[32px] p-6 sm:p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all"
              >
                <div className="order-2 lg:order-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-3 mb-5 text-sm text-gray-500">
                      <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200">
                        Featured post
                      </span>
                      <span>{formatDate(featured.date)}</span>
                    </div>
                    <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-charcoal leading-tight mb-4">
                      {featured.title}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                      {featured.excerpt}
                    </p>
                  </div>
                  <p className="mt-8 text-sm font-semibold text-charcoal">Read the story &rarr;</p>
                </div>

                <div className="order-1 lg:order-2 rounded-[24px] overflow-hidden border border-gray-200 bg-yellow/20">
                  {featured.thumbnail ? (
                    <img
                      src={featured.thumbnail}
                      alt={featured.title}
                      className="w-full h-full object-cover aspect-[4/3]"
                    />
                  ) : (
                    <div className="aspect-[4/3]" />
                  )}
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block bg-white p-6 border border-gray-200 rounded-[28px] hover:border-yellow hover:shadow-sm transition-all"
                  >
                    {post.thumbnail && (
                      <div className="rounded-[18px] overflow-hidden border border-gray-100 mb-5">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full object-cover aspect-[16/10]"
                        />
                      </div>
                    )}
                    <p className="text-sm text-gray-400 mb-2">{formatDate(post.date)}</p>
                    <h2 className="font-fraunces text-2xl font-semibold text-charcoal mb-3 leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                    <p className="text-sm font-semibold text-charcoal mt-5 hover:text-yellow transition-colors">
                      Read &rarr;
                    </p>
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
