'use client'

import { useEffect, useRef, useState } from "react";

interface Stage {
  key: string;
  label: string;
  x: number;
  y: number;
}

const STAGES: Stage[] = [
  { key: "request", label: "REQUEST", x: 30, y: 210 },
  { key: "verify", label: "VERIFY", x: 190, y: 130 },
  { key: "confirm", label: "CONFIRM", x: 350, y: 60 },
  { key: "chair", label: "CHAIR", x: 470, y: 30 },
];

const PATH_D = `M ${STAGES[0].x} ${STAGES[0].y} C 110 190, 110 150, ${STAGES[1].x} ${STAGES[1].y} S 300 40, ${STAGES[2].x} ${STAGES[2].y} S 440 20, ${STAGES[3].x} ${STAGES[3].y}`;

export default function BookingPathDiagram() {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [length, setLength] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDrawn(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!drawn) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % STAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [drawn]);

  return (
    <div
      ref={containerRef}
      className="elevation-lg rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6"
    >
      <p className="font-mono-op text-[0.65rem] uppercase tracking-[0.2em] text-[var(--muted-fg)]">
        Live pipeline · booking.trace
      </p>
      <svg viewBox="0 0 520 240" className="mt-4 w-full" role="img" aria-label="Diagram of a booking travelling from request through verification and confirmation to a reserved chair">
        <path
          d={PATH_D}
          fill="none"
          stroke="var(--border)"
          strokeWidth={2}
        />
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
          style={{
            strokeDasharray: length,
            strokeDashoffset: drawn ? 0 : length,
            transition: "stroke-dashoffset 1.6s cubic-bezier(0.65,0,0.35,1)",
          }}
        />
        {drawn && length > 0 && (
          <circle r={5} fill="var(--accent)">
            <animateMotion dur="3.2s" repeatCount="indefinite" path={PATH_D} />
          </circle>
        )}
        {STAGES.map((stage, i) => (
          <g key={stage.key}>
            <circle
              cx={stage.x}
              cy={stage.y}
              r={i === activeStage ? 9 : 6}
              fill={i <= activeStage ? "var(--primary)" : "var(--surface)"}
              stroke="var(--primary)"
              strokeWidth={2}
              style={{ transition: "r 0.4s ease, fill 0.4s ease" }}
            />
            <text
              x={stage.x}
              y={stage.y - 16}
              textAnchor="middle"
              className="font-mono-op"
              fontSize={10}
              fill={i === activeStage ? "var(--fg)" : "var(--muted-fg)"}
              letterSpacing="0.08em"
            >
              {stage.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-4 flex items-center justify-between font-mono-op text-[0.65rem] text-[var(--muted-fg)]">
        <span>STATUS: {drawn ? "TRACING" : "IDLE"}</span>
        <span className="text-[var(--primary)]">STAGE {activeStage + 1}/4</span>
      </div>
    </div>
  );
}
