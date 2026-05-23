"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const isDragging = useRef(false);

  // Core motion value: 0-100 percentage
  const rawPosition = useMotionValue(50);
  const position = useSpring(rawPosition, { stiffness: 500, damping: 35, mass: 0.3 });

  // Derived: clip-path right inset for the "after" image
  const clipRight = useTransform(position, (v) => `inset(0 ${100 - v}% 0 0)`);
  // Derived: left position for divider line and handle
  const handleLeft = useTransform(position, (v) => `${v}%`);

  // Idle oscillation when user is not interacting
  useEffect(() => {
    if (isInteracting) return;
    let frameId: number;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const idle = 50 + Math.sin(elapsed * 0.6) * 2;
      rawPosition.set(idle);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInteracting, rawPosition]);

  const updateFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    rawPosition.set(pct);
  }, [rawPosition]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsInteracting(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    setIsInteracting(false);
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-ew-resize bg-[#090909] border border-white/10 touch-none select-none shadow-2xl"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => { if (!isDragging.current) setIsInteracting(false); }}
    >
      {/* Before image (base layer, always full width) */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* After image (clipped on the left) */}
      <motion.img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: clipRight }}
        draggable={false}
      />

      {/* Glowing divider line */}
      <motion.div
        className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-10"
        style={{
          left: handleLeft,
          x: '-50%',
          boxShadow: '0 0 12px 2px rgba(255,255,255,0.6)',
        }}
      >
        {/* Drag handle */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center"
          animate={{ scale: isInteracting ? 1.15 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path d="M5 1L1 6L5 11" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 1L17 6L13 11" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>

      {/* Labels */}
      <motion.span
        className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest pointer-events-none"
        animate={{ opacity: isInteracting ? 1 : 0.6 }}
      >
        {beforeLabel}
      </motion.span>
      <motion.span
        className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest pointer-events-none"
        animate={{ opacity: isInteracting ? 1 : 0.6 }}
      >
        {afterLabel}
      </motion.span>
    </div>
  );
}
