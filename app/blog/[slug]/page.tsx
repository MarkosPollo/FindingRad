import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

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

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-charcoal transition-colors mb-8 inline-block"
        >
          &larr; All posts
        </Link>

        <article>
          <header className="mb-10">
            <p className="text-sm text-gray-400 mb-3">{post.date}</p>
            <h1 className="font-fraunces text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">{post.excerpt}</p>
          </header>

          {post.videoId && (
            <div className="mb-8 rounded-xl overflow-hidden">
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
            className="prose prose-lg max-w-none prose-headings:font-fraunces prose-headings:text-charcoal prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-charcoal prose-a:text-charcoal prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </article>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-gray-600 mb-4">Keep up with the build.</p>
          <Link href="/#waitlist" className="btn-yellow inline-block">
            Join the Waitlist
          </Link>
        </div>
      </div>
    </div>
  );
}
