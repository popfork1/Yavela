import { Navbar } from "../components/Navbar";
import { Code2, BookOpen, Settings, Zap, Download, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { motion } from "framer-motion";

const tools = [
  {
    id: "executor",
    title: "Executor",
    icon: Code2,
    description: "Download the latest executor for running your workflows locally.",
    buttonText: "Download",
    buttonIcon: Download,
    link: "#",
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
    link: "#",
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
    link: "#",
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
    link: "#",
    color: "text-amber-400",
    bg: "bg-amber-400/10"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Welcome to Yavela</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Access all your tools, APIs, and documentation in one place. Choose a tool below to get started.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {tools.map((tool) => (
            <motion.div key={tool.id} variants={item}>
              <Card className="h-full flex flex-col border-border/50 bg-card hover:bg-card/80 hover:border-border transition-all duration-300 group overflow-hidden relative shadow-lg">
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 transition-colors duration-500 pointer-events-none" />
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tool.bg} ${tool.color}`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-display group-hover:text-primary transition-colors">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-base text-muted-foreground/80 leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/10 mt-auto">
                  <Button asChild className="w-full group/btn relative overflow-hidden" variant="secondary">
                    <a href={tool.link}>
                      <span className="relative z-10 flex items-center gap-2 font-medium">
                        {tool.buttonText}
                        <tool.buttonIcon className="w-4 h-4 transition-transform group-hover/btn:translate-y-[-2px] group-hover/btn:translate-x-[2px]" />
                      </span>
                    </a>
                  </Button>
                </CardFooter>
              </Card>
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
