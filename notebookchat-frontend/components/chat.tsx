"use client"

import { AIAnswerResponse, BackendResponse, chatResponse } from "@/api/chat.api"
import { 
    MessageSquare, 
    ArrowUp, 
    BookOpen, 
    Sparkles,
    EllipsisVertical,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AnswerCard } from "./answer-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";

interface Message {
    role: "user" | "assistant";
    content: string;
    meta?: AIAnswerResponse;
    id: string;
}

interface ChatProps {
    notebookName: string;
    totalSources: number;
}

export const Chat = ({ notebookName, totalSources }: ChatProps) => {
    const {id} = useParams();

    const [messages, setMessages] = useState<Message[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    };

    const sendChat = async (query: string) => {
        setLoading(true);
        try {
            const response: BackendResponse = await chatResponse(query);
            if (!response) {
                toast.error("No response to show");
                return;
            };
            
            setMessages(prev => [
                ...prev,
                { 
                    role: response.data.role, 
                    content: response.data.content, 
                    meta: response.data.meta, 
                    id: response.data.id 
                }
            ]);
        } catch (error) {
            toast.error("Failed to get response");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        if (totalSources === 0) return;
        const text = query.trim();
        if (!text) return;

        if (textareaRef.current) textareaRef.current.style.height = "auto";
        
        setQuery("");

        setMessages(prev => [
            ...prev,
            { role: "user", content: text, id: crypto.randomUUID() }
        ]);

        await sendChat(text);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="w-full flex flex-col h-full bg-background border-l border-border/50">
            {/* --- Header --- */}
            {/* Outer div handles border/bg, Inner div handles centering */}
            <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto w-full flex items-center justify-between px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                Chat
                            </h2>
                            <Badge variant="secondary" className="font-normal text-xs px-2 py-0 h-5">
                                {notebookName}
                            </Badge>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{totalSources} {totalSources === 1 ? 'Source' : 'Sources'}</span>
                        <EllipsisVertical size={14} />
                    </div>
                </div>
            </div>

            {/* --- Chat Area --- */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
                {/* Container for messages */}
                <div className="max-w-3xl mx-auto w-full p-4 space-y-6">
                    
                    {true ? (
                        <div className="flex flex-col justify-center items-center h-[50vh] text-center space-y-4  animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-semibold text-foreground">Ask anything about {notebookName}</h3>
                                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    I can help you analyze your notes, summarize key points, or find specific details.
                                </p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={msg.id || index}
                                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`
                                        max-w-[85%] sm:max-w-[75%] px-5 py-3 text-sm shadow-sm
                                        ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                                            : 'bg-muted/50 text-foreground border border-border/50 rounded-2xl rounded-tl-sm'
                                        }
                                    `}
                                >   
                                    {msg.role === "user" ? (
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {msg.meta && <AnswerCard data={msg.meta} />}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-start w-full animate-in fade-in duration-300">
                            <div className="bg-muted/50 border border-border/50 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Input Area --- */}
            <div className="bg-background p-4 pt-2">
                <div className="max-w-3xl mx-auto w-full">
                    <div className="relative flex items-end rounded-xl border border-input bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring transition-all">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={query}
                            placeholder={totalSources === 0 ? "Add sources to start chatting" : "Ask a question..."}
                            className="
                                w-full resize-none bg-transparent 
                                px-4 py-3 pr-12 
                                text-sm placeholder:text-muted-foreground 
                                focus:outline-none max-h-[160px] overflow-y-auto
                                scrollbar-hide
                            "
                            onInput={handleInput}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={totalSources === 0}
                        />
                        
                        <div className="absolute right-2 bottom-2">
                            <Button 
                                size="icon" 
                                className="h-8 w-8 rounded-lg transition-all" 
                                disabled={!query.trim() || loading || totalSources === 0}
                                onClick={sendMessage}
                            >
                                <ArrowUp className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground text-center mt-2">
                        AI can make mistakes. Check important info.
                    </div>
                </div>
            </div>
        </div>
    )
}