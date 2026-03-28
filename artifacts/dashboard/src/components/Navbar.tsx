import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <nav className="w-full border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-lg shadow-primary/20">Y</span>
            Yavela
          </Link>
        </div>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-full p-1 shadow-sm">
          <Link href="/">
            <button className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              location === "/" ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}>
              Dashboard
            </button>
          </Link>
          <Link href="/settings">
            <button className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
              location === "/settings" ? "bg-secondary text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}>
              Settings
            </button>
          </Link>
        </div>

        {/* Right Nav */}
        <div className="flex items-center">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none group hover:bg-secondary/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-border">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-inner"
                  style={{ backgroundColor: user.avatarColor || "#6366f1" }}
                >
                  {user.displayName?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.displayName || user.username}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = '/settings'}>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
}
