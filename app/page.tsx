import Link from "next/link";
import Image from "next/image";
import { getVideos } from "@/lib/youtube";
import VideoCard from "@/components/VideoCard";
import WaitlistForm from "@/components/WaitlistForm";
import { getLatestPosts } from "@/lib/blog";

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const { longForm } = await getVideos();
  const latestVideos = longForm.slice(0, 3);
  const latestPosts = getLatestPosts(2);

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-fraunces text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal leading-tight mb-6">
                Build in Public.
                <br />
                <span className="text-yellow">Find Your Rad.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                I&apos;m Mark — founder, Navy Reserve LCDR, and dad to two boys
                who run wild. I document the real, messy process of turning
                ideas into adventures. No polish. No pretense. Just the build.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://youtube.com/@FindingRad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-yellow"
                >
                  Watch the Channel
                </a>
                <a href="#waitlist" className="btn-outline">
                  Join the Waitlist
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="bg-yellow/20 rounded-2xl overflow-hidden aspect-square max-w-md mx-auto">
                <Image
                  src="/images/mark-photo.jpg"
                  alt="Mark — Finding Rad"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Videos */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-charcoal">
              Latest Videos
            </h2>
            <Link
              href="/videos"
              className="text-charcoal font-medium hover:text-yellow transition-colors text-sm"
            >
              All videos &rarr;
            </Link>
          </div>

          {latestVideos.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {latestVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Videos loading soon. Check back or&nbsp;
                <a
                  href="https://youtube.com/@FindingRad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-yellow"
                >
                  watch on YouTube
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About blurb */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-charcoal mb-6">
            What is Finding Rad?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Finding Rad is a YouTube channel and community for people who
            build things. Products, companies, adventures, lives. I&apos;m Mark
            — I started Hibear, won a Red Dot design award, survived Shark
            Tank, and kept going. I document all of it. The wins, the
            failures, the pivots, the grind.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            If you&apos;re building something real and want to see what that
            actually looks like, you&apos;re in the right place.
          </p>
          <Link href="/about" className="btn-outline inline-block">
            More about Mark
          </Link>
        </div>
      </section>

      {/* Blog preview */}
      {latestPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-charcoal">
                From the Blog
              </h2>
              <Link
                href="/blog"
                className="text-charcoal font-medium hover:text-yellow transition-colors text-sm"
              >
                All posts &rarr;
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="video-card p-6 block hover:border-yellow transition-colors"
                >
                  <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                  <h3 className="font-fraunces text-xl font-semibold text-charcoal mb-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Waitlist CTA */}
      <section id="waitlist" className="py-16 px-4 sm:px-6 bg-yellow">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-charcoal mb-4">
            Stay in the Build
          </h2>
          <p className="text-charcoal/80 text-lg mb-8">
            Get updates when I drop new videos, posts, and gear drops. No spam.
            Just the good stuff.
          </p>
          <WaitlistForm />
        </div>
      </section>
    </>
  );
}
