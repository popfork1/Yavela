import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { updateMe } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

const ACCENT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // lime
  "#22c55e", // green
  "#10b981", // emerald
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
  "#ffffff", // white
];

export function Settings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.username);
      setAccentColor(user.avatarColor || "#6366f1");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateMe({ displayName, avatarColor: accentColor });
      await refreshUser();
      toast({ title: "Settings saved", description: "Your changes have been applied." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save settings", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account and appearance preferences.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/50 bg-card shadow-lg overflow-hidden">
            {/* Colored accent strip at top of card */}
            <div
              className="h-1 w-full"
              style={{ backgroundColor: accentColor }}
            />

            <CardHeader className="border-b border-border/50 pb-6 pt-6">
              {/* Left colored bar beside the title */}
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: accentColor }}
                />
                <div>
                  <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                  <CardDescription>Update your name and choose your cursor accent color.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-8 pt-8">

                {/* Avatar preview */}
                <div className="flex items-center gap-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-xl border-4 border-background transition-colors duration-300"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 0 24px ${accentColor}55`,
                    }}
                  >
                    {displayName.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">Preview</p>
                    <p className="text-sm text-muted-foreground">
                      Your avatar, nav highlight, and cursor glow all update to match.
                    </p>
                  </div>
                </div>

                {/* Cursor color picker */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Cursor Color</Label>
                  <p className="text-sm text-muted-foreground -mt-1">
                    This color is used for the cursor spotlight on cards, the active nav pill, and your avatar.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {ACCENT_COLORS.map((color) => {
                      const isSelected = accentColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setAccentColor(color)}
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
                    className="max-w-md bg-background/50 h-11 focus-visible:ring-0"
                    style={{
                      borderColor: accentColor + "66",
                      outlineColor: accentColor,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = accentColor)}
                    onBlur={(e) => (e.target.style.borderColor = accentColor + "66")}
                  />
                  <p className="text-sm text-muted-foreground">This is what shows in the top-right of the navbar.</p>
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

              <CardFooter className="border-t border-border/50 py-5 mt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="shadow-lg transition-shadow"
                  style={{
                    backgroundColor: accentColor,
                    color: accentColor === "#ffffff" ? "#000" : "#fff",
                    boxShadow: `0 4px 20px ${accentColor}40`,
                  }}
                >
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
          </Card>
        </motion.div>
      </main>

      <footer className="py-8 border-t border-border/50 text-center text-muted-foreground text-sm">
        <p>© 2025 Yavela · All rights reserved</p>
      </footer>
    </div>
  );
}
