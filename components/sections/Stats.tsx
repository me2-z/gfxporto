"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

function StatValue({ value, suffix = '' }: { value: number | string; suffix?: string }) {
  if (typeof value === 'number') {
    return <Counter target={value} suffix={suffix} />;
  }

  return <span>{value}</span>;
}

const stats = [
  { value: 500, suffix: '+', label: 'Designs Created' },
  { value: 2, suffix: 'Y', label: 'Industry Experience' },
  { value: 'You', suffix: '', label: 'Become Our Client' },
];

export function Stats() {
  return (
    <section className="py-20 bg-[#050505] border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="text-5xl md:text-6xl font-black tracking-tight mb-2
                                bg-gradient-to-b from-white to-white/50
                                bg-clip-text text-transparent font-mono">
                  <StatValue value={s.value} suffix={s.suffix} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-semibold">
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
