import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Finding Rad",
  description: "Stories from the build. Founder lessons, product journeys, and the real process.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="font-fraunces text-4xl sm:text-5xl font-bold text-charcoal mb-4">
            Blog
          </h1>
          <p className="text-gray-600 text-lg">
            Stories from the build. No fluff, no LinkedIn energy.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet. Check back soon.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-6 border border-gray-100 rounded-xl hover:border-yellow hover:shadow-sm transition-all"
              >
                <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                <h2 className="font-fraunces text-xl sm:text-2xl font-semibold text-charcoal mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                <p className="text-sm font-semibold text-charcoal mt-4 hover:text-yellow transition-colors">
                  Read &rarr;
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
