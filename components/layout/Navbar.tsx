"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/#about',           label: 'About'           },
  { href: '/#work',            label: 'Work'            },
  { href: '/cinematic',        label: 'Cinematic'       },
  { href: '/transformations',  label: 'Transformations' },
  { href: '/#services',        label: 'Services'        },
];

export function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/70 backdrop-blur-xl border-b border-white/[0.06] py-4'
            : 'bg-transparent py-7'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity"
          >
            MEET<span className="text-white/30">.</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  pathname === href || (href.startsWith('/#') && pathname === '/')
                    ? 'text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full
                         hover:bg-white/90 hover:scale-105 transition-all duration-200"
            >
              Hire Me
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-[5px] p-2 z-[60] relative"
          >
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/96 backdrop-blur-2xl
                       flex flex-col items-center justify-center gap-7 md:hidden"
          >
            {navLinks.map(({ href, label }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl font-black text-white/80 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
              className="mt-4"
            >
              <Link
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="px-8 py-4 bg-white text-black text-lg font-bold rounded-full
                           hover:bg-white/90 transition-colors"
              >
                Hire Me
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
