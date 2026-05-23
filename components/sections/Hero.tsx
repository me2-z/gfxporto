"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.12]);

  const stats = [
    { num: "500+", label: "Designs Created" },
    { num: "2Y", label: "Industry Experience" },
    { num: "You?", label: "Be Our Next Client" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-28 pb-16
                   flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <div className="flex-1 text-center lg:text-left">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/55 font-semibold mb-6"
          >
            <span className="h-px w-10 bg-white/25" />
            Thumbnail Designer
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black leading-[0.95]"
          >
            I Create<br />
            <span className="text-gradient-premium">Thumbnails</span><br />
            That Get Clicks
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }}
            className="mt-6 text-base md:text-lg text-white/50 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
          >
            High-converting thumbnail design for creators who want stronger CTR, cleaner
            storytelling, and visuals that feel premium the moment they hit the feed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-5"
          >
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-full px-5 py-3 min-w-[152px] text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-black leading-none">{s.num}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-[0.22em] mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.42 }}
            className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4"
          >
            <Link
              href="#work"
              className="group px-7 py-3.5 bg-white text-black font-bold rounded-full
                         flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              View My Work
              <span className="group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
            </Link>
            <a
              href="https://www.fiverr.com/sellers/meetfx/edit"
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 glass text-white font-bold rounded-full
                         flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              Hire on Fiverr
              <i className="ri-external-link-line text-sm" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.25, type: "spring", damping: 18 }}
          whileHover={{ rotate: -2, scale: 1.02, y: -4 }}
          className="relative flex-shrink-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-[360px] lg:h-[360px]"
          style={{ animation: "hero-breathe 6s ease-in-out infinite" }}
        >
          <div
            className="absolute inset-0 rounded-full bg-white/8 blur-3xl scale-75"
            style={{ animation: "pulse-glow 4s ease-in-out infinite" }}
          />
          <div className="absolute inset-6 rounded-full border border-white/10" />
          <img
            src="/meet.png"
            alt="Meet - Thumbnail Designer"
            className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10
                   flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}
