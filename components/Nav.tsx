"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Blog post pages get transparent nav
  const isBlogPost = pathname.startsWith("/blog/") && pathname !== "/blog";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isBlogPost && !scrolled && !open;

  const linkClass = (href: string) => {
    const active = pathname === href;
    if (isTransparent) {
      return `font-medium transition-colors ${active ? "text-[#FFD23F]" : "text-white/90 hover:text-white"}`;
    }
    return `font-medium transition-colors ${active ? "text-[#FFD23F]" : "text-charcoal hover:text-[#FFD23F]"}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Finding Rad"
            width={120}
            height={40}
            className={`h-8 w-auto transition-all duration-300 ${isTransparent ? "brightness-0 invert" : ""}`}
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/videos" className={linkClass("/videos")}>
            Videos
          </Link>
          <Link href="/blog" className={linkClass("/blog")}>
            Blog
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>
          <Link
            href="/#waitlist"
            className={`text-sm font-semibold px-5 py-2.5 rounded-full transition-all ${
              isTransparent
                ? "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30"
                : "bg-[#FFD23F] text-charcoal hover:opacity-90"
            }`}
          >
            Join the Build
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 relative w-8 h-8"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`absolute left-1 w-6 h-0.5 transition-all duration-300 ${
              isTransparent ? "bg-white" : "bg-charcoal"
            } ${open ? "top-3.5 rotate-45" : "top-2"}`}
          />
          <span
            className={`absolute left-1 top-3.5 w-6 h-0.5 transition-all duration-300 ${
              isTransparent ? "bg-white" : "bg-charcoal"
            } ${open ? "opacity-0" : "opacity-100"}`}
          />
          <span
            className={`absolute left-1 w-6 h-0.5 transition-all duration-300 ${
              isTransparent ? "bg-white" : "bg-charcoal"
            } ${open ? "top-3.5 -rotate-45" : "top-5"}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          <Link
            href="/videos"
            className="font-medium text-charcoal"
            onClick={() => setOpen(false)}
          >
            Videos
          </Link>
          <Link
            href="/blog"
            className="font-medium text-charcoal"
            onClick={() => setOpen(false)}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="font-medium text-charcoal"
            onClick={() => setOpen(false)}
          >
            About
          </Link>
          <Link
            href="/#waitlist"
            className="btn-yellow inline-block text-center"
            onClick={() => setOpen(false)}
          >
            Join the Build
          </Link>
        </div>
      </div>
    </nav>
  );
}
