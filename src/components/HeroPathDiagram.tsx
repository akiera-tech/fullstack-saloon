'use client'

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const STAGES = [
  { key: 'BOOK', label: 'Book Online' },
  { key: 'CONFIRM', label: 'Confirm Slot' },
  { key: 'CHAIR', label: 'Take the Chair' },
  { key: 'DONE', label: 'Walk Out Sharp' },
];

const PATH_D = 'M20 170 C 90 170, 100 110, 170 110 S 260 40, 330 40 S 420 90, 480 90';

export default function HeroPathDiagram() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [length, setLength] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setLength(pathRef.current.getTotalLength());
    }
    const t = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((s) => (s + 1) % STAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const stagePositions = [0.03, 0.34, 0.66, 0.97];

  return (
    <div className="relative rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--elevation-md)] sm:p-8">
      <p className="eyebrow mb-6">Live Client Journey</p>
      <svg viewBox="0 0 500 200" className="h-auto w-full overflow-visible" role="img" aria-label="Diagram tracing a booking from Book Online through Confirm Slot, Take the Chair, to Walk Out Sharp">
        <path
          d={PATH_D}
          fill="none"
          stroke="var(--border)"
          strokeWidth="2"
        />
        <motion.path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px oklch(0.72 0.17 250 / 0.6))' }}
          initial={{ strokeDasharray: length, strokeDashoffset: length }}
          animate={{ strokeDashoffset: drawn ? 0 : length }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          r="4.5"
          fill="var(--accent)"
          style={{ filter: 'drop-shadow(0 0 8px oklch(0.75 0.15 45 / 0.8))' }}
          initial={{ offsetDistance: '0%' }}
          animate={drawn ? { offsetDistance: ['0%', '100%'] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          // @ts-expect-error -- offsetPath is valid CSS not in React's style typing
          css={undefined}
          suppressHydrationWarning
          style2={undefined}
        />
        {stagePositions.map((pos, i) => {
          const x = 20 + pos * 460;
          const isActive = i === activeStage;
          return (
            <g key={STAGES[i].key} transform={`translate(${x}, ${i === 0 ? 170 : i === 1 ? 110 : i === 2 ? 40 : 90})`}>
              <circle r={isActive ? 7 : 5} fill={isActive ? 'var(--primary)' : 'var(--bg)'} stroke="var(--primary)" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
      <style>{`
        svg circle[style*='offset-distance'] { offset-path: path('${PATH_D}'); }
      `}</style>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {STAGES.map((stage, i) => (
          <div key={stage.key} className="flex items-center gap-2">
            <span
              className={`h-2 w-2 flex-shrink-0 rounded-full transition-colors ${i === activeStage ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
            />
            <span className={`font-mono-head text-[0.65rem] uppercase tracking-widest transition-colors ${i === activeStage ? 'text-[var(--primary)]' : 'text-[var(--muted-fg)]'}`}>
              {stage.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
