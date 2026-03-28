import { useRef, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Code2, BookOpen, Settings, Zap, Download, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { CardDescription, CardFooter } from "../components/ui/card";
import { motion } from "framer-motion";

const tools = [
  {
    id: "executor",
    title: "Executor",
    icon: Code2,
    description: "Download the latest executor for running your workflows locally.",
    buttonText: "Download",
    buttonIcon: Download,
    link: "https://files.yavela.xyz/data/Yavela.zip",
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    id: "docs",
    title: "API Docs",
    icon: BookOpen,
    description: "Explore the API documentation and see how to integrate Yavela features programmatically.",
    buttonText: "View Docs",
    buttonIcon: ExternalLink,
    link: "https://www.yavela.xyz/docs",
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    id: "api-not-based",
    title: "Yavela API (NOT BASED)",
    icon: Settings,
    description: "Download the Exploit API to make your own Roblox Executor.",
    buttonText: "Download API",
    buttonIcon: Download,
    link: "https://files.yavela.xyz/data/api/yavAPI.7z",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    id: "api-velocity",
    title: "Yavela API (Velocity Based)",
    icon: Zap,
    description: "Download the Exploit API to make your own Roblox Executor, using Velocity's API as its base.",
    buttonText: "Download API",
    buttonIcon: Download,
    link: "https://files.yavela.xyz/data/api/velocity/yavAPI.dll",
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

type SpotlightCardProps = {
  tool: typeof tools[0];
};

function SpotlightCard({ tool }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  }

  function handleMouseLeave() {
    setSpotlight((s) => ({ ...s, opacity: 0 }));
  }

  const Icon = tool.icon;
  const BtnIcon = tool.buttonIcon;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg flex flex-col group transition-all duration-300 hover:border-border"
    >
      {/* Spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, rgba(255,255,255,0.08), transparent 70%)`,
        }}
      />

      {/* Card content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.bg} ${tool.color}`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {tool.title}
        </h3>

        {/* Description */}
        <CardDescription className="text-base text-muted-foreground/80 leading-relaxed flex-1">
          {tool.description}
        </CardDescription>

        {/* Button */}
        <CardFooter className="px-0 pt-5 mt-auto border-t border-border/10">
          <Button asChild className="w-full group/btn relative overflow-hidden" variant="secondary">
            <a href={tool.link}>
              <span className="relative z-10 flex items-center gap-2 font-medium">
                {tool.buttonText}
                <BtnIcon className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </span>
            </a>
          </Button>
        </CardFooter>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Yavela</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Access all your tools, APIs, and documentation in one place.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tools.map((tool) => (
            <motion.div key={tool.id} variants={item} className="h-full">
              <SpotlightCard tool={tool} />
            </motion.div>
          ))}
        </motion.div>
      </main>

      <footer className="py-8 border-t border-border/50 text-center text-muted-foreground text-sm">
        <p>© 2025 Yavela · All rights reserved</p>
      </footer>
    </div>
  );
}
