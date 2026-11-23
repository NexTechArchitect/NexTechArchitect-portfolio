"use client";

import { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Code2,
  Cpu,
  Layers,
  Shield,
  Terminal,
} from "lucide-react";
import {
  coreProjects,
  fullStackProjects,
  type ProjectItem,
} from "@/data/projects";
import { formatContractAddress, getFlagshipProjects } from "@/lib/portfolio";

interface ProjectGatewaySectionProps {
  openOverlay: (type: "fullstack" | "core") => void;
  openModal: (item: ProjectItem, type: "skill" | "project") => void;
}

const FLAGSHIP_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "nexus-rwa": Building2,
  "onchain-automation": Cpu,
  "sentinel-insurance": Shield,
  fs1: Activity,
};

function RefractiveBentoCard({
  project,
  spanClass,
  index,
  onOpenCaseStudy,
}: {
  project: ProjectItem;
  spanClass: string;
  index: number;
  onOpenCaseStudy: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 20 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = { stiffness: 260, damping: 28 };
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [3.5, -3.5]), springConfig);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-3.5, 3.5]), springConfig);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const rx = (e.clientX - rect.left) / rect.width;
      const ry = (e.clientY - rect.top) / rect.height;
      mx.set(rx - 0.5);
      my.set(ry - 0.5);
      setSheenPos({ x: rx * 100, y: ry * 100 });
    },
    [mx, my]
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  const Icon = FLAGSHIP_ICONS[project.id] || Cpu;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className={spanClass}
    >
      <motion.article
        ref={cardRef}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className="relative h-full rounded-3xl bg-white border border-slate-200/90 hover:border-[#0052FF]/40 shadow-[0_2px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_24px_56px_rgba(15,23,42,0.10)] transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 sm:p-8"
      >
        {/* Optical Glass Cursor-Reactive Specular Refraction */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(480px circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(0,82,255,0.08), rgba(8,145,178,0.04) 40%, transparent 72%)`,
          }}
        />

        <div className="relative z-10">
          {/* Quiet Unboxed Kicker */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono-tabular text-slate-500 mb-5">
            <span className="truncate">
              <span className="text-[#0052FF] font-semibold">
                {project.network}
              </span>
              <span aria-hidden="true" className="mx-2 text-slate-300">
                ·
              </span>
              <span>{project.standard}</span>
            </span>
            <span className="text-slate-400 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Icon + Title + Metric */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-center text-[#0052FF] shrink-0">
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1220] tracking-tight leading-tight">
                {project.title}
              </h3>
              <p className="text-xs font-mono-tabular text-[#0891B2] font-semibold mt-1">
                {project.metric} · {project.metricDetail}
              </p>
            </div>
          </div>

          {/* Complete Description */}
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Compact Verified Contract Preview on Wide Cards */}
          {project.contracts && project.contracts.length > 0 && (
            <div className="mb-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {project.contracts.map((contract) => (
                <div
                  key={contract.address}
                  className="px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200/70"
                >
                  <p className="text-[11px] font-semibold text-[#0B1220] truncate">
                    {contract.label}
                  </p>
                  <p className="text-[11px] font-mono-tabular text-slate-500">
                    {formatContractAddress(contract.address)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direct Triggers Row */}
        <div className="relative z-10 pt-5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenCaseStudy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1220] hover:bg-[#0052FF] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF] focus-visible:ring-offset-2"
          >
            <span>Case Study</span>
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#0052FF] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Live dApp</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#0B1220] transition-colors whitespace-nowrap shrink-0"
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

function ArchiveGatewayCard({
  icon: Icon,
  kicker,
  title,
  description,
  count,
  ctaLabel,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  kicker: string;
  title: string;
  description: string;
  count: number;
  ctaLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-[#0052FF]/45 shadow-[0_2px_14px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_48px_rgba(15,23,42,0.09)] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052FF]"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 group-hover:border-[#0052FF]/35 flex items-center justify-center text-[#0052FF] shrink-0 transition-colors">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-mono-tabular text-slate-500 mb-1">
            {kicker} · {count} Projects
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B1220] group-hover:text-[#0052FF] transition-colors tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] group-hover:bg-[#0052FF] border border-slate-200 group-hover:border-[#0052FF] text-xs font-semibold text-[#0B1220] group-hover:text-white transition-all whitespace-nowrap shrink-0 self-start sm:self-center">
        <span>{ctaLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
  );
}

export default function ProjectGatewaySection({
  openOverlay,
  openModal,
}: ProjectGatewaySectionProps) {
  const flagships = getFlagshipProjects();
  const bentoSpans = [
    "lg:col-span-7",
    "lg:col-span-5",
    "lg:col-span-5",
    "lg:col-span-7",
  ];

  return (
    <section
      id="protocols"
      className="relative bg-[#F8FAFC] architectural-grid border-t border-slate-200/80 py-20 sm:py-28 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-mono-tabular font-semibold text-[#0052FF] mb-3">
              02. Flagship Deployments
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0B1220] leading-[1.08] mb-4 text-balance">
              Engineered{" "}
              <span className="text-optical-gradient">DeFi Protocols.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Four flagship protocol architectures ready for direct inspection,
              followed by complete galleries of all seven full-stack dApps and
              eight core EVM contract primitives.
            </p>
          </div>

          <p className="text-xs font-mono-tabular text-slate-500 shrink-0">
            15 Audited Case Studies · Live dApps & Source Code
          </p>
        </div>

        {/* Flagship Protocols Bento Grid */}
        <div
          data-testid="flagship-bento-grid"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10"
        >
          {flagships.map((project, index) => (
            <RefractiveBentoCard
              key={project.id}
              project={project}
              spanClass={bentoSpans[index] || "lg:col-span-6"}
              index={index}
              onOpenCaseStudy={() => openModal(project, "project")}
            />
          ))}
        </div>

        {/* Full Archive Gallery Gateways */}
        <div className="pt-4">
          <p className="text-xs font-mono-tabular font-semibold text-slate-500 mb-4">
            Complete Engineering Archives
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ArchiveGatewayCard
              icon={Layers}
              kicker="Production Systems"
              title="Full-Stack dApps"
              description="End-to-end DeFi protocols pairing verified Solidity suites with Next.js, Wagmi, and Viem frontends."
              count={fullStackProjects.length}
              ctaLabel="Open Gallery"
              onClick={() => openOverlay("fullstack")}
            />
            <ArchiveGatewayCard
              icon={Terminal}
              kicker="Foundry Primitives"
              title="Core Contracts"
              description="Pure EVM engineering covering CDP stablecoins, ERC-4337 accounts, UUPS proxies, Merkle airdrops, and VRF state machines."
              count={coreProjects.length}
              ctaLabel="Explore Contracts"
              onClick={() => openOverlay("core")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
