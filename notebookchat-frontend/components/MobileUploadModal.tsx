"use client"

import { useState } from "react";
import { X, MessageSquareText, Database, Globe, LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUploadResource } from "@/hooks/useUploadMutation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MobileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  notebookId: string;
}

type UploadTab = 'text' | 'pdf' | 'website';

export const MobileUploadModal = ({ isOpen, onClose, notebookId }: MobileUploadModalProps) => {
  const { mutate, isPending } = useUploadResource();
  const [activeTab, setActiveTab] = useState<UploadTab>('text');
  const [textData, setTextData] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleTextSubmit = async () => {
    if (textData.length <= 100) {
      toast("Input must be greater than 100 characters!");
      return;
    }

    mutate({
      payload: {
        type: "text",
        data: textData,
      },
      notebookId,
    }, {
      onSuccess: () => {
        setTextData("");
        onClose();
        toast("Text uploaded successfully!");
      },
      onError: () => {
        toast("Failed to upload text");
      }
    });
  };

  const handleFileUpload = async (file: File) => {
    mutate({
      payload: {
        type: "pdf",
        file,
      },
      notebookId,
    }, {
      onSuccess: () => {
        onClose();
        toast("PDF uploaded successfully!");
      },
      onError: () => {
        toast("Failed to upload PDF");
      }
    });
  };

  const handleWebsiteSubmit = async () => {
    if (!websiteUrl.trim()) {
      toast("Please enter a valid website URL");
      return;
    }

    mutate({
      payload: {
        type: "website",
        url: websiteUrl,
      },
      notebookId,
    }, {
      onSuccess: () => {
        setWebsiteUrl("");
        onClose();
        toast("Website content uploaded successfully!");
      },
      onError: () => {
        toast("Failed to upload website content");
      }
    });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const resetForm = () => {
    setTextData("");
    setWebsiteUrl("");
    setActiveTab('text');
  };

  const handleClose = () => {
    if (!isPending) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="h-fit max-h-[800px] w-full max-w-lg mx-auto rounded-2xl overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquareText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Upload Content</DialogTitle>
              <DialogDescription className="text-sm">
                Add sources to your notebook
              </DialogDescription>
            </div>
          </div>
    
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b">
          {[
            { id: 'text' as UploadTab, label: 'Text', icon: MessageSquareText },
            { id: 'pdf' as UploadTab, label: 'PDF', icon: Database },
            { id: 'website' as UploadTab, label: 'Website', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPending ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="text-center space-y-2">
                <p className="font-medium text-foreground">Processing Upload</p>
                <p className="text-sm text-muted-foreground">Creating embeddings...</p>
              </div>
              <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Text Upload Tab */}
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Paste Your Text</h3>
                    <p className="text-xs text-muted-foreground">
                      Add text content to create embeddings (minimum 100 characters)
                    </p>
                  </div>
                  <Textarea
                    value={textData}
                    onChange={(e) => setTextData(e.target.value)}
                    placeholder="Paste your text here..."
                    className="min-h-[200px] resize-none text-base"
                  />
                  <Button 
                    onClick={handleTextSubmit}
                    disabled={textData.length <= 100}
                    className="w-full py-3"
                  >
                    Upload Text
                  </Button>
                </div>
              )}

              {/* PDF Upload Tab */}
              {activeTab === 'pdf' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Upload PDF</h3>
                    <p className="text-xs text-muted-foreground">
                      Drop a PDF file or click to browse
                    </p>
                  </div>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                      isDragging 
                        ? "bg-primary/5 border-primary" 
                        : "bg-muted/30 border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      Drop PDF here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF files only
                    </p>
                  </div>
                </div>
              )}

              {/* Website Upload Tab */}
              {activeTab === 'website' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Website URL</h3>
                    <p className="text-xs text-muted-foreground">
                      Extract content from a web page
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com/article"
                      className="text-base"
                    />
                    <Button 
                      onClick={handleWebsiteSubmit}
                      disabled={!websiteUrl.trim()}
                      className="w-full py-3"
                    >
                      Extract Content
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};