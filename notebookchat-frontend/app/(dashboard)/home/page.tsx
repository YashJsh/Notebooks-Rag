import React from 'react';
import { 
  Plus, 
  MoreVertical, 
  FileText, 
  Clock, 
} from 'lucide-react';
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Navbar } from '@/components/Navbar';

// Mock data for existing notebooks
const notebooks = [
  { id: 1, title: "Rust Fundamentals", sources: 4, lastEdited: "2 hours ago" },
  { id: 2, title: "Q3 Financial Reports", sources: 12, lastEdited: "1 day ago" },
  { id: 3, title: "Project Alpha Specs", sources: 1, lastEdited: "3 days ago" },
  { id: 4, title: "UX Research Notes", sources: 8, lastEdited: "1 week ago" },
];

export default function Dashboard() {
  return (
    <div className="h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8 md:px-6">
        {/* Section Title */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Your Notebooks</h2>
          {/* Mobile Search Trigger could go here */}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          
          {/* 1. Create New Notebook Card */}
          <button className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-6 hover:border-primary hover:bg-muted/20 transition-all duration-200 h-[220px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">New Notebook</h3>
              <p className="text-sm text-muted-foreground">Start from scratch or upload</p>
            </div>
          </button>

          {/* 2. Existing Notebook Cards */}
          {notebooks.map((notebook) => (
            <Card key={notebook.id} className="group relative flex flex-col justify-between overflow-hidden transition-all hover:shadow-md hover:border-primary/50 h-[220px]">
              
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-chart-1/20 to-chart-2/20 flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-chart-1" />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <CardTitle className="line-clamp-2 text-lg leading-tight">
                  {notebook.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0 flex-1">
                {/* Spacer or extra details */}
              </CardContent>

              <CardFooter className="p-5 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 mt-auto h-12">
                <span className="flex items-center gap-1">
                  {notebook.sources} {notebook.sources === 1 ? 'Source' : 'Sources'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {notebook.lastEdited}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}