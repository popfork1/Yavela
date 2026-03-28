import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center select-none"
    >
      <h1 className="text-7xl md:text-9xl font-display font-light text-foreground tracking-tighter text-glow">
        {format(time, "HH:mm")}
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground font-medium mt-2 md:mt-4 tracking-wide">
        {format(time, "EEEE, MMMM do")}
      </p>
    </motion.div>
  );
}
