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

const AVATAR_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#f59e0b", // amber
  "#84cc16", // yellow
  "#22c55e", // lime
  "#10b981", // green
  "#06b6d4", // emerald
  "#14b8a6", // teal
  "#0ea5e9", // cyan
  "#0284c7", // light blue
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#a855f7", // purple
  "#d946ef", // fuchsia
  "#ec4899", // pink
  "#f43f5e", // rose
];

export function Settings() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  const [displayName, setDisplayName] = useState("");
  const [avatarColor, setAvatarColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.username);
      setAvatarColor(user.avatarColor || AVATAR_COLORS[11]); // default indigo
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateMe({ displayName, avatarColor });
      await refreshUser();
      
      toast({
        title: "Profile updated",
        description: "Your settings have been saved successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your account preferences and profile settings.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-border/50 bg-card shadow-lg overflow-hidden">
            <CardHeader className="bg-secondary/30 border-b border-border/50 pb-6">
              <CardTitle className="text-2xl font-display">Profile Settings</CardTitle>
              <CardDescription>Update your personal information and how others see you.</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-8 pt-8">
                {/* Avatar Preview */}
                <div className="flex items-center gap-6">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-xl border-4 border-background"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Avatar Color</h3>
                    <p className="text-sm text-muted-foreground mb-3">Choose a color for your profile avatar.</p>
                    <div className="flex flex-wrap gap-2 max-w-md">
                      {AVATAR_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-transform hover:scale-110 flex items-center justify-center"
                          style={{ backgroundColor: color }}
                          onClick={() => setAvatarColor(color)}
                        >
                          {avatarColor === color && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-base">Display Name</Label>
                  <Input 
                    id="displayName" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="max-w-md bg-background/50 focus:border-primary transition-colors h-11"
                  />
                  <p className="text-sm text-muted-foreground">This is your public display name. It can be your real name or a pseudonym.</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-base">Username</Label>
                  <Input 
                    value={user?.username || ""}
                    disabled
                    className="max-w-md bg-secondary/50 text-muted-foreground cursor-not-allowed h-11"
                  />
                  <p className="text-sm text-muted-foreground">Your username cannot be changed.</p>
                </div>
              </CardContent>
              
              <CardFooter className="bg-secondary/30 border-t border-border/50 py-6 mt-4 flex justify-end">
                <Button type="submit" disabled={isLoading} className="shadow-lg shadow-primary/20">
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
