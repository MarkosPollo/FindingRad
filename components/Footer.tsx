import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-10 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <p className="font-fraunces text-xl font-bold mb-3">Finding Rad</p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Build in public. Document the process. Find what makes life worth
              living. From Truckee, CA.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-4">
              Explore
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/videos"
                className="text-gray-400 hover:text-[#FFD23F] transition-colors text-sm"
              >
                Videos
              </Link>
              <Link
                href="/blog"
                className="text-gray-400 hover:text-[#FFD23F] transition-colors text-sm"
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-[#FFD23F] transition-colors text-sm"
              >
                About Mark
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-4">
              Follow Along
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://youtube.com/@FindingRad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FFD23F] transition-colors text-sm"
              >
                YouTube &rarr;
              </a>
              <a
                href="https://instagram.com/findingrad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#FFD23F] transition-colors text-sm"
              >
                Instagram &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {year} Finding Rad. Built in Truckee, CA.
          </p>
          <p className="text-gray-600 text-xs">
            Made with grit and good coffee.
          </p>
        </div>
      </div>
    </footer>
  );
}
