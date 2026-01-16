"use client";

import { Database } from "lucide-react";
import { ModeToggle } from "./toggle";

export const Navbar = () => {
  return (
    <nav className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sticky top-0 z-50">
      
      {/* LEFT: Brand */}
      <div className="flex items-center gap-2">
        {/* Logo */}
        <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm">
          <Database size={20} />
        </div>

        {/* App Name */}
        <span className="text-lg font-semibold text-foreground uppercase tracking-tighter">
          NoteMind
        </span>
      </div>

      {/* RIGHT: Actions */}
      <div>
        <ModeToggle />
      </div>
    </nav>
  );
};
