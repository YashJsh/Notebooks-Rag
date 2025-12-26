"use client"

import { useState } from "react";
import { Database, LoaderIcon, MessageSquareText } from "lucide-react";
import { sendData } from "@/utils/request";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";

export const Upload = () => {
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: string) => {
    if (data.length <= 100) {
      toast("Input must be greater than 100 characters!!!");
      console.warn("Too short data")
      return;
    };
    setLoading(true);
    await sendData(data);
    toast("Embedding Created");
    setData("");
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-1/2 border-r border-border p-6 flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-muted/30 rounded-lg">
          {/* Contextual Text */}
          <div className="text-center items-center flex flex-col justify-center gap-1">
            <p className="font-medium text-foreground">Vectorizing Data</p>
            <p className="text-sm text-muted-foreground">Creating embeddings</p>
            <LoaderIcon className="animate-spin"/>
          </div>
          </div>
        </div>
    );
  }

        return (
        <div className="w-1/2 border-r border-border p-6 flex flex-col gap-4 h-full">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquareText className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-foreground">Upload</h2>
          </div>

          {/* Input + Button Container */}
          <div className="flex flex-col gap-2 flex-1">
            <Textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Paste your text here..."
              className="border-input rounded-md p-2 w-full
             text-base md:text-lg resize-none
             bg-background text-foreground
             placeholder:text-muted-foreground
             focus-visible:ring-ring
             overflow-y-auto
             max-h-64
             min-h-64"
            />
            <Button className="w-full py-6 text-md font-semibold uppercase tracking-tighter flex-none"
              onClick={() => {
                handleSubmit(data)
              }}
            >
              Upload
            </Button>
          </div>

          {/* PDF Upload */}
          <div className="border-2 border-dashed border-border rounded-xl h-1/2 flex flex-col items-center justify-center text-muted-foreground bg-muted/30 mt-2 hover:bg-muted/50 transition-colors cursor-pointer">
            <Database size={32} className="mb-2 opacity-50" />
            <p className="text-sm font-medium">Drop PDF here to generate embeddings</p>
          </div>
        </div>
        );
}
