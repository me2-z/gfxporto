"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { PortfolioItem } from '@/lib/content-types';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(json => setItems(json.data || []));
  }, []);

  return (
    <section id="work" className="py-28 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-semibold mb-3">
            02 // Selected Work
          </p>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="text-4xl md:text-6xl font-black">Digital Gallery</h2>
            <p className="text-white/40 font-light max-w-xs text-sm leading-relaxed hidden md:block">
              Click any thumbnail to view full resolution
            </p>
          </div>
          <div className="mt-6 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </motion.div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-white/30 font-light">
            No items in portfolio yet. Manage them in the Admin Dashboard.
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
          >
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                variants={cardVariants}
                onClick={() => setSelected(item)}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-white/[0.03]
                  border border-white/[0.06] hover:border-white/20 transition-all duration-500
                  ${i === 0 ? 'sm:col-span-2 lg:col-span-2 aspect-[16/8]' : 'aspect-video'}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700
                             group-hover:scale-105 will-change-transform"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent
                                opacity-60 group-hover:opacity-100 transition-opacity duration-400" />

                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2
                                group-hover:translate-y-0 transition-transform duration-400">
                  <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-white/50
                                   font-semibold mb-1.5">{item.category}</span>
                  <h4 className="text-base md:text-lg font-bold text-white leading-tight">{item.title}</h4>
                  <div className="flex items-center gap-1 mt-2 text-white/40 text-xs font-medium
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <i className="ri-fullscreen-line" /> <span>View Full Size</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl
                       flex flex-col items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 w-11 h-11 rounded-full glass text-white
                         flex items-center justify-center hover:bg-white/10 transition-colors"
              onClick={() => setSelected(null)}
            >
              <i className="ri-close-line text-xl" />
            </button>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-center"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">{selected.category}</span>
              <h3 className="text-xl font-bold mt-1">{selected.title}</h3>
            </motion.div>

            <motion.img
              key={selected._id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
              src={selected.image}
              alt={selected.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = items.findIndex(i => i._id === selected._id);
                  setSelected(items[(idx - 1 + items.length) % items.length]);
                }}
                className="px-5 py-2.5 glass rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <i className="ri-arrow-left-line" /> Prev
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = items.findIndex(i => i._id === selected._id);
                  setSelected(items[(idx + 1) % items.length]);
                }}
                className="px-5 py-2.5 glass rounded-full text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                Next <i className="ri-arrow-right-line" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
