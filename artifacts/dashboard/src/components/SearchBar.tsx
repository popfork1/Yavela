import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on '/' press, but not if user is already typing in an input
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSearch}
      className={`
        relative w-full max-w-2xl mx-auto mt-12 transition-all duration-300 ease-out
        ${isFocused ? 'scale-105' : 'scale-100'}
      `}
    >
      <div className={`
        relative flex items-center w-full rounded-full 
        glass-panel
        transition-colors duration-300
        ${isFocused ? 'bg-white/10 border-white/20 shadow-primary/10' : 'bg-white/5 border-white/10'}
      `}>
        <div className="pl-6 pr-3 text-muted-foreground">
          <Search size={20} className={isFocused ? 'text-primary' : ''} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search Google or type a URL..."
          className="w-full py-5 pr-6 bg-transparent text-foreground placeholder:text-muted-foreground/70 focus:outline-none text-lg font-medium"
        />
        
        <div className="absolute right-6 hidden md:flex items-center gap-1 text-xs text-muted-foreground/60 font-medium font-mono select-none pointer-events-none">
          <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10">/</kbd>
          <span>to search</span>
        </div>
      </div>
    </motion.form>
  );
}
