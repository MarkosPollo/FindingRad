"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Finding Rad"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/videos"
            className="text-charcoal hover:text-yellow font-medium transition-colors"
          >
            Videos
          </Link>
          <Link
            href="/blog"
            className="text-charcoal hover:text-yellow font-medium transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-charcoal hover:text-yellow font-medium transition-colors"
          >
            About
          </Link>
          <Link href="/#waitlist" className="btn-yellow text-sm">
            Join the Build
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-6 h-0.5 bg-charcoal mb-1.5"></div>
          <div className="w-6 h-0.5 bg-charcoal mb-1.5"></div>
          <div className="w-6 h-0.5 bg-charcoal"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          <Link href="/videos" className="font-medium" onClick={() => setOpen(false)}>
            Videos
          </Link>
          <Link href="/blog" className="font-medium" onClick={() => setOpen(false)}>
            Blog
          </Link>
          <Link href="/about" className="font-medium" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="/#waitlist" className="btn-yellow inline-block text-center" onClick={() => setOpen(false)}>
            Join the Build
          </Link>
        </div>
      )}
    </nav>
  );
}
