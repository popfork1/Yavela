import { Link, useLocation } from "wouter";
import { useAuth } from "../hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const accentColor = user?.avatarColor || "#6366f1";

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
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}yavela-logo.png`}
            alt="Yavela"
            className="w-8 h-8 object-contain mix-blend-screen"
          />
          Yavela
        </Link>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-1 bg-card border border-border rounded-full p-1 shadow-sm">
          {NAV_ITEMS.map((nav) => {
            const isActive = location === nav.href;
            return (
              <Link key={nav.href} href={nav.href}>
                <div className="relative px-4 py-1.5 cursor-pointer select-none">
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 0 12px 2px ${accentColor}55`,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className="relative z-10 text-sm font-semibold transition-colors"
                    style={{ color: isActive ? "#fff" : undefined }}
                  >
                    {nav.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right — user avatar + dropdown */}
        <div className="flex items-center">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none group hover:bg-secondary/50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-border">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-inner"
                  style={{ backgroundColor: accentColor }}
                >
                  {(user.displayName || user.username).charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">
                  {user.displayName || user.username}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setLocation("/settings")}>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
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
