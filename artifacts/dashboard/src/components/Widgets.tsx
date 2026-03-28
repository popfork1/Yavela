import { useState, useEffect } from "react";
import { CloudRain, CloudSun, Sun, Wind, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";

export function WidgetsArea() {
  return (
    <div className="fixed top-6 right-6 z-40 hidden lg:flex flex-col gap-4 w-72">
      <WeatherWidget />
      <NotesWidget />
    </div>
  );
}

function WeatherWidget() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel glass-panel-hover rounded-2xl p-4 flex items-center justify-between"
    >
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">San Francisco</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-display font-semibold text-foreground">68°</span>
          <span className="text-sm text-muted-foreground">Partly Cloudy</span>
        </div>
      </div>
      <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
        <CloudSun size={24} />
      </div>
    </motion.div>
  );
}

function NotesWidget() {
  const [note, setNote] = useLocalStorage("dash_quick_note", "");
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel rounded-2xl p-4 flex flex-col h-48 focus-within:ring-1 focus-within:ring-primary/50 transition-shadow"
    >
      <div className="flex items-center gap-2 mb-3 text-muted-foreground">
        <PenLine size={14} />
        <h3 className="text-xs font-semibold uppercase tracking-wider">Quick Notes</h3>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot something down..."
        className="w-full flex-1 bg-transparent resize-none focus:outline-none text-sm text-foreground/90 placeholder:text-muted-foreground/50 scrollbar-hide leading-relaxed"
      />
    </motion.div>
  );
}
