"use client";

import React from 'react';
import { motion } from 'framer-motion';

const socials = [
  {
    icon: 'ri-discord-fill',
    label: 'Discord',
    handle: 'lmaomeet',
    href: '#',
    hoverColor: 'hover:bg-[#5865F2]',
  },
  {
    icon: 'ri-behance-fill',
    label: 'Behance',
    handle: 'ZanzmeraMeet',
    href: 'https://www.behance.net/ZanzmeraMeet',
    hoverColor: 'hover:bg-[#1769ff]',
  },
  {
    icon: 'ri-external-link-line',
    label: 'Fiverr',
    handle: 'meetfx',
    href: 'https://www.fiverr.com/sellers/meetfx/edit',
    hoverColor: 'hover:bg-[#1dbf73]',
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-28 bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-semibold mb-3">
            05 // Contact
          </p>
          <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black leading-none tracking-[-0.03em] mb-6">
              Let&apos;s build
              <br />
              <span className="text-gradient">something iconic.</span>
            </h2>
            <p className="text-white/40 text-lg font-light max-w-xl mx-auto mb-12 leading-relaxed">
              Become our next client and let&apos;s build a thumbnail system that makes your videos feel bigger before anyone even clicks.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {socials.map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div className="w-px h-10 bg-white/10 hidden md:block" />
                  )}
                  <a
                    href={s.href}
                    target={s.href !== '#' ? '_blank' : undefined}
                    rel="noreferrer"
                    className="group flex flex-col items-center gap-3 px-4"
                  >
                    <div className={`w-16 h-16 rounded-2xl glass border border-white/10 flex items-center
                                     justify-center text-2xl text-white transition-all duration-300
                                     group-hover:scale-110 group-hover:border-white/30 ${s.hoverColor}`}>
                      <i className={s.icon} />
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] uppercase tracking-[0.25em] text-white/30 font-semibold">
                        {s.label}
                      </div>
                      <div className="text-sm font-medium text-white/60 group-hover:text-white transition-colors mt-0.5">
                        {s.handle}
                      </div>
                    </div>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="text-center pt-16 pb-4 border-t border-white/[0.05] mt-16">
        <p className="text-white/20 text-sm font-light">
          &copy; {new Date().getFullYear()} Meet Designs. All rights reserved.
        </p>
      </div>
    </section>
  );
}
