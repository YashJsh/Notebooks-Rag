"use client"

import { chatResponse } from "@/utils/chatResponse"
import { MessageSquareText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Message{
    role : "user" | "assistant";
    content : string
}

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null); 

    const sendChat = async (query: string) => {
        setLoading(true);
        const response = await chatResponse(query);
        
        setMessages(prev=>[
            ...prev,
            { role : response.data.role, content : response.data.content}
        ]);
        setLoading(false);
    };

    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, [messages, loading]);
    

      const sendMessage = async () => {
        const text = query.trim();
        if (!text) {
          toast("Text is missing");
          return;
        }
      
        // Add user message
        setMessages(prev => [
          ...prev,
          { role: "user", content: text }
        ]);
      
        setQuery(""); // clear textarea
      
        // Send to assistant
        await sendChat(text);
      };
      
      const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
          setQuery("");
        }
      };

    return (
        <div className="w-1/2 bg-background p-3 flex flex-col h-full"> 
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
            <MessageSquareText className="text-primary" size={18} />
            <h2 className="text-sm font-bold text-foreground">Chat</h2>
        </div>
    
        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 rounded-xl border border-border bg-muted/30 shadow-sm p-4 mb-2 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
                <div className="flex flex-col justify-center text-center items-center h-full">
                    <h1 className="uppercase font-semibold text-muted-foreground tracking-tighter">Start Asking</h1>
                    <h2 className="text-sm font-semibold text-muted-foreground/80">Upload the resource and ask questions</h2>
                </div>
            ) : (
                messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] px-4 py-2 text-sm rounded-2xl shadow-sm
                            ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none' 
                                : 'bg-card text-card-foreground border border-border rounded-bl-none'
                            }
                        `}
                        >
                            <p className="leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))
            )}
    
            {/* Loading Indicator */}
            {loading && (
                <div className="w-full justify-start animate-in fade-in duration-300">
                    <div className="rounded-2xl px-4 py-2 text-sm">
                        <div className="flex gap-1 h-full items-center">
                            <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    
        {/* Input Area */}
        <div className="sticky bottom-0 z-50 bg-background pt-2">
            <div className="relative">
                <textarea
                    rows={1}
                    placeholder="Ask questions about your sources..."
                    className="
                        w-full resize-none
                        rounded-xl border border-input
                        bg-background text-foreground
                        px-3 py-3
                        text-sm leading-relaxed
                        max-h-40 overflow-y-auto
                        shadow-sm
                        placeholder:text-muted-foreground
                        focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                        scrollbar-hide scroll-smooth
                    "
                    onInput={(e) => {
                        //@ts-ignore
                        e.target.style.height = "auto";
                        //@ts-ignore
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                    }}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            
            <button
                className="
                    mt-2 w-full bg-primary text-primary-foreground 
                    font-semibold rounded-lg py-2 text-sm 
                    transition-colors hover:bg-primary/90
                    shadow-sm disabled:opacity-50
                "
                onClick={sendMessage}
                disabled={loading}
            >
                Send
            </button>
        </div>
    </div>
    )
}