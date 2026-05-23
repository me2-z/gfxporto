"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortfolioItem } from '@/lib/content-types';

const navItems = [
  {
    href: '/admin/dashboard',
    icon: 'ri-dashboard-line',
    activeIcon: 'ri-dashboard-fill',
    label: 'Dashboard',
    description: 'Overview & stats',
  },
  {
    href: '/admin/portfolio',
    icon: 'ri-image-2-line',
    activeIcon: 'ri-image-2-fill',
    label: 'Portfolio',
    description: 'Manage gallery',
  },
  {
    href: '/admin/transformations',
    icon: 'ri-magic-line',
    activeIcon: 'ri-magic-fill',
    label: 'Transformations',
    description: 'Before / After',
  },
  {
    href: '/admin/cinematic',
    icon: 'ri-movie-2-line',
    activeIcon: 'ri-movie-2-fill',
    label: 'Cinematic',
    description: 'Cinematic gallery',
  },
];

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/portfolio': 'Portfolio',
  '/admin/transformations': 'Transformations',
  '/admin/cinematic': 'Cinematic',
};

function SidebarContent({
  onClose,
  counts,
}: {
  onClose?: () => void;
  counts: Record<string, number>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl font-black tracking-tighter">
            MEET<span className="text-gray-500">.</span>
          </span>
          <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors md:hidden"
          >
            <i className="ri-close-line text-lg" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest px-4 mb-3">
          Navigation
        </p>
        {navItems.map(({ href, icon, activeIcon, label, description }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const count = counts[label.toLowerCase()] ?? null;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                active
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-gray-400 hover:bg-white/8 hover:text-white'
              }`}
            >
              <i className={`${active ? activeIcon : icon} text-lg flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span>{label}</span>
                  {count !== null && count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        active
                          ? 'bg-black/20 text-black'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </div>
                <p
                  className={`text-[11px] font-normal mt-0.5 truncate ${
                    active ? 'text-black/60' : 'text-white/30 group-hover:text-white/50'
                  }`}
                >
                  {description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="p-4 space-y-2 border-t border-white/5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
        >
          <i className="ri-external-link-line" /> View Live Site
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm font-medium disabled:opacity-50"
        >
          {loggingOut ? (
            <>
              <i className="ri-loader-4-line animate-spin" /> Logging out…
            </>
          ) : (
            <>
              <i className="ri-logout-box-line" /> Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Load nav badge counts
  useEffect(() => {
    Promise.allSettled([
      fetch('/api/portfolio').then((r) => r.json()),
      fetch('/api/transformations').then((r) => r.json()),
    ]).then(([portfolioResult, transformationsResult]) => {
      const portfolioData =
        portfolioResult.status === 'fulfilled' ? portfolioResult.value : null;
      const transformationsData =
        transformationsResult.status === 'fulfilled' ? transformationsResult.value : null;

      const allItems: PortfolioItem[] = portfolioData?.data ?? [];
      const cinematicCount = allItems.filter(
        (item) => item.category?.toLowerCase() === 'cinematic'
      ).length;

      setCounts({
        portfolio: allItems.length,
        transformations: transformationsData?.data?.length ?? 0,
        cinematic: cinematicCount,
      });
    });
  }, [pathname]); // re-fetch on route change so counts stay fresh

  const pageTitle = pageTitles[pathname] ?? 'Admin';

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-white/20">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-white/5 bg-[#0a0a0a] sticky top-0 h-screen overflow-hidden">
        <SidebarContent counts={counts} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] flex flex-col md:hidden border-r border-white/5 overflow-hidden"
            >
              <SidebarContent
                onClose={() => setMobileMenuOpen(false)}
                counts={counts}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar (mobile) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0a0a0a] sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <i className="ri-menu-line text-xl" />
          </button>
          <Link href="/" className="text-xl font-black">
            MEET<span className="text-gray-500">.</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="View site"
          >
            <i className="ri-external-link-line" />
          </Link>
        </div>

        {/* Breadcrumb bar (desktop) */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/5 bg-[#080808] sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin/dashboard" className="text-gray-500 hover:text-white transition-colors">
              Admin
            </Link>
            {pageTitle !== 'Dashboard' && (
              <>
                <i className="ri-arrow-right-s-line text-white/20" />
                <span className="text-white font-medium">{pageTitle}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-500">System Online</span>
          </div>
        </div>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
