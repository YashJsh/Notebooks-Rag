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
    messages: Record<string, Message[]>; // key = notebookId
    addMessage: (notebookId: string, message: Message) => void;
    clearMessages: (notebookId: string) => void;
    setMessages: (notebookId: string, messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: {},

    addMessage: (notebookId, message) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [notebookId]: [...(state.messages[notebookId] || []), message],
            },
        })),

    clearMessages: (notebookId) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [notebookId]: [],
            },
        })),

    setMessages: (notebookId, messages) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [notebookId]: messages,
            },
        })),
}));
