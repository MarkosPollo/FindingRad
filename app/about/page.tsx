import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Mark | Finding Rad",
  description:
    "Mark is the founder of Hibear, a Navy Reserve Lieutenant Commander, and a builder who documents the real process.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="font-fraunces text-4xl sm:text-5xl font-bold text-charcoal mb-6">
              About Mark
            </h1>

            <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
              <p>
                I&apos;m Mark Tsigounis. I live in Truckee, California — right
                at the edge of Lake Tahoe, where the skiing is good and the air
                makes you want to build things.
              </p>

              <p>
                I started Hibear because I wanted a water bottle that could
                actually handle a real adventure. We designed something good
                enough to win a Red Dot Award and an iF Design Award. We went
                on Shark Tank. We didn&apos;t get a deal. We kept going anyway.
              </p>

              <p>
                I&apos;m also a Lieutenant Commander in the Navy Reserve. Four-plus
                hours a week minimum, one full weekend a month, annual training,
                and deployments. Real commitment. Wouldn&apos;t trade it.
              </p>

              <p>
                And I&apos;m a dad to two young boys who act like raccoons. They
                keep everything in perspective.
              </p>

              <p>
                Finding Rad exists because I believe the messy middle is where
                the real lessons live. The cash flow spreadsheets, the supplier
                problems, the moments where you almost quit. That&apos;s what
                actually teaches something. So I put a camera on it.
              </p>

              <p>
                So I put a camera on it. Every video is a chapter in the build.
                You can follow along from wherever you are in your own.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://youtube.com/@FindingRad"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-yellow"
              >
                Watch the Channel
              </a>
              <Link href="/#waitlist" className="btn-outline">
                Join the Build
              </Link>
            </div>
          </div>

          <div className="sticky top-28">
            <div className="rounded-2xl overflow-hidden bg-yellow/10 aspect-square">
              <Image
                src="/images/mark-photo.jpg"
                alt="Mark Tsigounis — Finding Rad"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-fraunces text-2xl font-bold text-charcoal">2x</p>
                <p className="text-xs text-gray-500 mt-1">Design awards</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-fraunces text-2xl font-bold text-charcoal">LCDR</p>
                <p className="text-xs text-gray-500 mt-1">Navy Reserve</p>
              </div>
              <div className="bg-yellow/20 rounded-xl p-4">
                <p className="font-fraunces text-2xl font-bold text-charcoal">100%</p>
                <p className="text-xs text-gray-500 mt-1">In the build</p>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex gap-4">
              <a
                href="https://youtube.com/@FindingRad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-charcoal transition-colors font-medium"
              >
                YouTube &rarr;
              </a>
              <a
                href="https://instagram.com/findingrad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-charcoal transition-colors font-medium"
              >
                Instagram &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
