"use client"

import { useState } from "react";
import { Database, LoaderIcon, MessageSquareText } from "lucide-react";

import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useUploadResource } from "@/hooks/useUploadMutation";
import { useParams } from "next/navigation";

export const Upload = () => {
  const {id } = useParams();
  const { mutate, isPending, error } = useUploadResource();
  const [data, setData] = useState<string>("");

  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (data: string) => {
    if (data.length <= 100) {
      toast("Input must be greater than 100 characters!!!");
      console.warn("Too short data")
      return;
    };
  
    mutate({
      payload: {
        type: "text",
        data,
      },
      notebookId: id as string
    });
  };

  const sendFile = async (file : File)=>{
    mutate({
      payload: {
        type: "pdf",
        file,
      },
      notebookId: id as string,
    });
    
  }

  const sendWebsiteLink = async (link : string)=>{
    mutate({
      payload: {
        type: "website",
        url: link,
      },
      notebookId: id as string,
    });
  }

  if (isPending) {
    return (
      <div className="w-1/3 border-r border-border p-6 flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-muted/30 rounded-lg">
          {/* Contextual Text */}
          <div className="text-center items-center flex flex-col justify-center gap-1">
            <p className="font-medium text-foreground">Vectorizing Data</p>
            <p className="text-sm text-muted-foreground">Creating embeddings</p>
            <LoaderIcon className="animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 border-r border-border p-6 flex flex-col gap-4 h-full">
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
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = e.dataTransfer.files;
          console.log(files);
          sendFile(files[0]);
        }}
        className={`relative text-center border-2 border-dashed rounded-xl h-1/2 flex flex-col
    items-center justify-center transition-colors cursor-pointer mt-2
    ${isDragging ? "bg-muted/60 border-primary" : "bg-muted/30 border-border"}
  `}
      >

        {/* Hidden file input */}
        <input
          type="file"
          id="pdf-upload"
          accept="application/pdf"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            const files = e.target.files;
            if (!files) return;
            console.log(files);
            sendFile(files[0]);
          }}
        />

        {/* UI */}
        <Database size={32} className="mb-2 opacity-50 pointer-events-none" />
        <p className="text-sm font-medium pointer-events-none">
          Drop PDF here to generate embeddings
        </p>
      </div>

      <div className="border border-border rounded-xl p-4 bg-muted/30 flex flex-col gap-3 mt-2">
        <label
          htmlFor="website-url"
          className="text-sm font-medium text-muted-foreground"
        >
          Paste website link to generate embeddings
        </label>

        <input
          id="website-url"
          type="url"
          placeholder="https://example.com/article"
          className="w-full rounded-md border border-input bg-background px-3 py-2
               text-sm text-foreground placeholder:text-muted-foreground
               "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = (e.target as HTMLInputElement).value;
              console.log("Website URL:", value);
              sendWebsiteLink(value);
            }
          }}
        />
      </div>
    </div>
  );
}
