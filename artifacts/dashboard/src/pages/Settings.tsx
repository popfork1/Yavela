import { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "@workspace/api-client-react";
import { CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

const THEME_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#d946ef", "#ec4899", "#f43f5e", "#ffffff",
];

export function Settings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [themeColor, setThemeColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const accentColor = themeColor || user?.avatarColor || "#6366f1";

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.username);
      setThemeColor(user.avatarColor || "#6366f1");
    }
  }, [user]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  }

  function handleMouseLeave() {
    setSpotlight((s) => ({ ...s, opacity: 0 }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateMe({ displayName, avatarColor: themeColor });
      await refreshUser();
      toast({ title: "Settings saved", description: "Your changes have been applied." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save settings", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground text-lg">Manage your account preferences.</p>
          </div>

          {/* Card with spotlight effect */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-xl border border-border/50 bg-card shadow-lg overflow-hidden"
          >
            {/* Spotlight glow */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: spotlight.opacity,
                background: `radial-gradient(280px circle at ${spotlight.x}px ${spotlight.y}px, ${accentColor}30, transparent 70%)`,
              }}
            />

            <form onSubmit={handleSubmit}>
              <CardHeader className="border-b border-border/50 relative z-10">
                <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
                <CardDescription>Update your display name and theme color.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 pt-8 relative z-10">

                {/* Theme color picker */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Theme Color</Label>
                  <p className="text-sm text-muted-foreground">
                    Controls your avatar, active nav pill, and cursor spotlight on cards.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {THEME_COLORS.map((color) => {
                      const isSelected = themeColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setThemeColor(color)}
                          className="w-9 h-9 rounded-full transition-transform hover:scale-110 flex items-center justify-center focus:outline-none"
                          style={{
                            backgroundColor: color,
                            boxShadow: isSelected ? `0 0 0 2px #0a0a0f, 0 0 0 4px ${color}` : undefined,
                            border: color === "#ffffff" ? "1px solid rgba(255,255,255,0.2)" : undefined,
                          }}
                        >
                          {isSelected && (
                            <Check
                              className="w-4 h-4 drop-shadow-md"
                              style={{ color: color === "#ffffff" ? "#000" : "#fff" }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Display name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-base font-medium">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="max-w-md bg-background/50 h-11"
                  />
                  <p className="text-sm text-muted-foreground">Shows in the top-right of the navbar.</p>
                </div>

                {/* Username (read-only) */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">Username</Label>
                  <Input
                    value={user?.username || ""}
                    disabled
                    className="max-w-md bg-secondary/50 text-muted-foreground cursor-not-allowed h-11"
                  />
                  <p className="text-sm text-muted-foreground">Your username cannot be changed.</p>
                </div>

              </CardContent>

              <CardFooter className="border-t border-border/50 py-5 mt-4 flex justify-end relative z-10">
                <Button type="submit" disabled={isLoading} variant="secondary">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </div>
        </motion.div>
      </main>

      <footer className="py-8 border-t border-border/50 text-center text-muted-foreground text-sm">
        <p>© 2026 Yavela · All rights reserved</p>
      </footer>
    </div>
  );
}
