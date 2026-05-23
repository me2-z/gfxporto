"use client";

import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  'Adobe Photoshop',
  'Reference Thumbnail',
  'CTR Optimization',
  'A/B Testing',
  'Typography & Layout',
  'Color Theory Mastery',
];

export function About() {
  return (
    <section id="about" className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Ambient glow top-right */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.025] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-semibold mb-3">
            01 // Profile
          </p>
          <h2 className="text-4xl md:text-6xl font-black">Beyond The Canvas</h2>
          <div className="mt-6 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Visual Architect card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/[0.04] rounded-full blur-3xl" />
            <div className="relative z-10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-semibold">
                Who I Am
              </span>
              <h3 className="text-2xl md:text-3xl font-black mt-3 mb-6">Visual Architect</h3>
              <div className="space-y-4 text-white/50 font-light text-base leading-relaxed">
                <p>
                  With a deep understanding of YouTube algorithms and viewer psychology,
                  I don&apos;t just make pretty pictures - I engineer thumbnails built for high CTR.
                </p>
                <p>
                  My designs are optimised for every device, combining clean typography,
                  dramatic lighting, and visceral emotion to make your content undeniable.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Arsenal card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/[0.04] rounded-full blur-3xl" />
            <div className="relative z-10">
              <span className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-semibold">
                Tools & Skills
              </span>
              <h3 className="text-2xl md:text-3xl font-black mt-3 mb-6">Arsenal</h3>
              <ul className="space-y-3">
                {skills.map((skill, i) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                    className="flex items-center gap-3 text-white/70 font-medium"
                  >
                    <span className="w-5 h-5 rounded-full bg-white/8 border border-white/10
                                     flex items-center justify-center flex-shrink-0">
                      <i className="ri-check-line text-[10px]" />
                    </span>
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
