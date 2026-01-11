import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AIAnswerResponse } from "@/api/chat.api";

export interface Message {
    role: "user" | "assistant";
    content: string;
    meta?: AIAnswerResponse;
    id: string;
}

interface ChatState {
    messages: Message[];
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set) => ({
            messages: [],
            addMessage: (message) =>
                set((state) => ({
                    messages: [...state.messages, message],
                })),
            clearMessages: () =>
                set(() => ({
                    messages: [],
                })),
            setMessages: (messages) =>
                set(() => ({
                    messages,
                })),
        }),
        {
            name: "chat-storage",
        }
    )
);