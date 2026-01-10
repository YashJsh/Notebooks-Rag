"use client"

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileUploadFabProps {
  onClick: () => void;
  className?: string;
}

export const MobileUploadFab = ({ onClick, className }: MobileUploadFabProps) => {
  return (
    <div className={cn("fixed bottom-25 left-6 z-50", className)}>
      <Button
        onClick={onClick}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Open Upload</span>
      </Button>
    </div>
  );
};