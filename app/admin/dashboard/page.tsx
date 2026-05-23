"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  category: string;
  createdAt?: string;
}

interface TransformationItem {
  _id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [transformations, setTransformations] = useState<TransformationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/portfolio').then((r) => r.json()),
      fetch('/api/transformations').then((r) => r.json()),
    ]).then(([portfolioResult, transformationsResult]) => {
      const portfolioData =
        portfolioResult.status === 'fulfilled' ? portfolioResult.value : null;
      const transformationsData =
        transformationsResult.status === 'fulfilled' ? transformationsResult.value : null;
      setPortfolio(portfolioData?.data ?? []);
      setTransformations(transformationsData?.data ?? []);
      setLoading(false);
    });
  }, []);

  const cinematicCount = portfolio.filter(
    (i) => i.category?.toLowerCase() === 'cinematic'
  ).length;

  // Recent items — last 4 portfolio + last 2 transformations merged, sorted by createdAt
  const recentPortfolio = [...portfolio]
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    .slice(0, 5);

  const statCards = [
    {
      title: 'Total Thumbnails',
      value: loading ? null : portfolio.length,
      icon: 'ri-image-line',
      color: 'from-blue-500/20 to-blue-500/0',
      border: 'border-blue-500/20',
      href: '/admin/portfolio',
      hint: 'All categories',
    },
    {
      title: 'Cinematic',
      value: loading ? null : cinematicCount,
      icon: 'ri-movie-2-line',
      color: 'from-yellow-500/20 to-yellow-500/0',
      border: 'border-yellow-500/20',
      href: '/admin/cinematic',
      hint: 'Cinematic gallery',
    },
    {
      title: 'Transformations',
      value: loading ? null : transformations.length,
      icon: 'ri-magic-line',
      color: 'from-purple-500/20 to-purple-500/0',
      border: 'border-purple-500/20',
      href: '/admin/transformations',
      hint: 'Before / After sliders',
    },
  ];

  const quickActions = [
    {
      href: '/admin/portfolio?action=new',
      icon: 'ri-upload-cloud-2-line',
      iconBg: 'bg-blue-500/20 text-blue-400',
      label: 'Upload Thumbnail',
      sub: 'Add to digital gallery',
    },
    {
      href: '/admin/transformations?action=new',
      icon: 'ri-magic-line',
      iconBg: 'bg-purple-500/20 text-purple-400',
      label: 'New Transformation',
      sub: 'Create before / after slider',
    },
    {
      href: '/admin/cinematic?action=new',
      icon: 'ri-movie-2-line',
      iconBg: 'bg-yellow-500/20 text-yellow-400',
      label: 'Add Cinematic',
      sub: 'Publish to cinematic gallery',
    },
    {
      href: '/',
      icon: 'ri-eye-line',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      label: 'View Live Site',
      sub: 'Open public portfolio',
      target: '_blank',
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-2"
      >
        <h1 className="text-3xl md:text-4xl font-black mb-1">
          Welcome Back, Meet.
        </h1>
        <p className="text-gray-400 font-light">
          Here&apos;s what&apos;s happening with your portfolio today.
        </p>
      </motion.header>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={stat.href}
              className={`block glass-card p-6 rounded-2xl relative overflow-hidden group border ${stat.border} hover:border-white/20 transition-all duration-300`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">{stat.title}</p>
                  <div className="text-4xl font-black">
                    {stat.value === null ? (
                      <span className="inline-block w-12 h-9 bg-white/10 rounded-lg animate-pulse" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-white/30 mt-2 font-mono">{stat.hint}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center text-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <i className={stat.icon} />
                </div>
              </div>
              <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ri-arrow-right-up-line text-white/40 text-sm" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="lg:col-span-2 glass-card p-6 rounded-3xl"
        >
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-yellow-500/15 flex items-center justify-center">
              <i className="ri-flashlight-line text-yellow-400 text-base" />
            </span>
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                target={action.target}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/4 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${action.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <i className={action.icon} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white">{action.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{action.sub}</p>
                  </div>
                </div>
                <i className="ri-arrow-right-s-line text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Portfolio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          className="lg:col-span-3 glass-card p-6 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <i className="ri-history-line text-blue-400 text-base" />
              </span>
              Recent Uploads
            </h2>
            <Link
              href="/admin/portfolio"
              className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
            >
              View all <i className="ri-arrow-right-s-line" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentPortfolio.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <i className="ri-image-2-line text-4xl block mb-2 opacity-40" />
              <p className="text-sm">No uploads yet</p>
              <Link
                href="/admin/portfolio?action=new"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all"
              >
                <i className="ri-add-line" /> Add your first item
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPortfolio.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/4 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <i className="ri-image-line text-lg" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-white/90">
                      {item.title || 'Untitled'}
                    </p>
                    {item.category && (
                      <span className="inline-block text-[10px] text-white/40 uppercase tracking-wider font-mono mt-0.5 bg-white/5 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/admin/portfolio"
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all flex-shrink-0"
                  >
                    <i className="ri-edit-line text-xs" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44 }}
        className="glass-card p-6 rounded-3xl"
      >
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center">
            <i className="ri-server-line text-green-400 text-base" />
          </span>
          System Status
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              label: 'JSON Database',
              status: 'Online',
              statusColor: 'text-green-400',
              bar: 'bg-green-500',
              barWidth: 'w-full',
              detail: 'data.json — local file store',
            },
            {
              label: 'Media Storage',
              status: 'Active',
              statusColor: 'text-blue-400',
              bar: 'bg-blue-500',
              barWidth: 'w-[35%]',
              detail: 'Cloudinary / local uploads',
            },
            {
              label: 'Auth (JWT)',
              status: 'Secure',
              statusColor: 'text-purple-400',
              bar: 'bg-purple-500',
              barWidth: 'w-full',
              detail: 'Cookie-based session',
            },
          ].map((s, i) => (
            <div key={i}>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-300 font-medium">{s.label}</span>
                <span className={`${s.statusColor} font-semibold text-xs flex items-center gap-1`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.bar} opacity-70 inline-block`} />
                  {s.status}
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                <div className={`${s.barWidth} h-full ${s.bar} opacity-60 rounded-full`} />
              </div>
              <p className="text-[11px] text-white/25 font-mono">{s.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
