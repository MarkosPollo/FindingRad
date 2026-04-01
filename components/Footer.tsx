import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-400 text-sm">
            &copy; {year} Finding Rad. Built in Truckee, CA.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://youtube.com/@FindingRad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-yellow transition-colors text-sm font-medium"
            >
              YouTube
            </a>
            <a
              href="https://instagram.com/findingrad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-yellow transition-colors text-sm font-medium"
            >
              Instagram
            </a>
            <Link
              href="/about"
              className="text-gray-400 hover:text-yellow transition-colors text-sm font-medium"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
