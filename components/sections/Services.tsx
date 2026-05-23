"use client";

import React from 'react';
import { motion } from 'framer-motion';

const services = [
  {
    icon: 'ri-image-edit-line',
    title: 'YouTube Thumbnails',
    desc: "Bespoke, high-converting designs tuned for sharper curiosity, stronger storytelling, and a cleaner premium feel.",
    tag: '01',
  },
  {
    icon: 'ri-cursor-fill',
    title: 'Cinematic Packaging',
    desc: 'MrBeast-style hierarchy, bold emotion, and scroll-stopping compositions that stay readable at speed.',
    tag: '02',
  },
  {
    icon: 'ri-vip-diamond-line',
    title: 'Branding Packs',
    desc: 'Channel-wide visual systems covering thumbnails, banners, recurring formats, and recognizable packaging cues.',
    tag: '03',
  },
];

export function Services() {
  return (
    <section id="services" className="py-28 bg-[#050505] relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px]
                      bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-semibold mb-3">
            04 // Offerings
          </p>
          <h2 className="text-4xl md:text-6xl font-black">What I Do</h2>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((srv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden group
                         hover:-translate-y-2 transition-transform duration-500 cursor-default"
            >
              <span className="absolute top-6 right-6 text-[11px] font-mono text-white/15 font-bold">
                {srv.tag}
              </span>

              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.08]
                              flex items-center justify-center text-2xl text-white mb-8
                              group-hover:bg-white group-hover:text-black group-hover:scale-110
                              transition-all duration-400">
                <i className={srv.icon} />
              </div>

              <h3 className="text-xl md:text-2xl font-black mb-4">{srv.title}</h3>
              <p className="text-white/45 font-light leading-relaxed text-sm md:text-base">
                {srv.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
