"use client";

import { useGetSourcesNotebook } from "@/hooks/useNotebookMutation";
import React from "react";
import { FileText, Link as LinkIcon, File, X } from "lucide-react";
import { Button } from "./ui/button";


type SourceViewerProps = {
  id: string;
    setShowSources: (show: boolean) => void;
};

const SourceViewer: React.FC<SourceViewerProps> = ({ id, setShowSources }) => {
  const { data, isPending, isError } = useGetSourcesNotebook(id);

  const getSourceStyle = (type: string) => {
    const lowerType = type.toLowerCase();

    if (lowerType.includes("pdf")) {
      return {
        icon: <FileText className="w-6 h-6 text-primary" />,
        label: "PDF",
        bgColor: "bg-primary/10",
      };
    }

    if (
      lowerType.includes("url") ||
      lowerType.includes("link") ||
      lowerType.includes("website")
    ) {
      return {
        icon: <LinkIcon className="w-6 h-6 text-secondary-foreground" />,
        label: "WEBSITE",
        bgColor: "bg-secondary/40",
      };
    }

    return {
      icon: <File className="w-6 h-6 text-muted-foreground" />,
      label: "TEXT",
      bgColor: "bg-muted",
    };
  };

  if (isPending) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading sources…
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No sources added yet.
      </div>
    );
  }

  return (
    <div className="w-full bg-background p-4 rounded-2xl">
      <div className="flex justify-between itmes-center">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        Sources ({data.length})
        </h3>
        <Button variant={"ghost"} onClick={() => setShowSources(false)}>
            <X className="w-4 h-4 ml-1"/>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => {
          const style = getSourceStyle(item.fileType);

          return (
            <div
              key={item.id}
              className="
                flex flex-col p-4 h-36 rounded-2xl
                bg-background
                border border-border
                hover:bg-muted/40
                hover:shadow-md
                transition-all
              "
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-xl ${style.bgColor}`}>
                  {style.icon}
                </div>

                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  {style.label}
                </span>
              </div>

              {/* Content */}
              <div className="mt-auto">
                <h4
                  className="font-medium text-foreground text-sm line-clamp-2"
                  title={item.filename}
                >
                  {item.filename}
                </h4>

                <p className="text-xs text-muted-foreground truncate font-mono">
                  {item.source}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SourceViewer;
