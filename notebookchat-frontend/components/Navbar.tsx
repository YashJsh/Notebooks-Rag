"use client"

import React, { useState } from 'react';
import { 
  Database, 
} from 'lucide-react';
import { ModeToggle } from './toggle';

export const Navbar = () => {
  // State for the notebook title
  const [title, setTitle] = useState("Untitled Notebook");
  const [sourceCount, setSourceCount] = useState(3); 

  return (
    <nav className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sticky top-0 z-50">
      
      {/* LEFT: Branding & Title */}
      <div className="flex items-center gap-4 flex-1">
        {/* Logo Icon */}
        <div className="p-2 bg-primary text-primary-foreground rounded-lg shadow-sm cursor-pointer hover:bg-primary/90 transition">
          <Database size={20} />
        </div>

        {/* Breadcrumbs / Title */}
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            My Workspace
          </span>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
                text-foreground font-semibold text-lg 
                bg-transparent border-none 
                focus:ring-0 focus:outline-none focus-visible:ring-0
                p-0 hover:underline cursor-text w-full
            "
            aria-label="Notebook Title"
          />
        </div>
      </div>

      <div>
        <ModeToggle/>
      </div>
    </nav>
  );
};