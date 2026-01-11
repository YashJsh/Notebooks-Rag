"use client"

import { chatResponse } from "@/api/chat.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useChatMutation = () => {
    return useMutation({
        mutationFn: chatResponse,
        onSuccess: () => {
            // Optional: Add success toast if needed
            // toast("Response received successfully");
        },
        onError: (error: unknown) => {
            const errorMessage = error && typeof error === 'object' && 'response' in error 
                ? ((error as any).response?.data?.message) 
                : "Failed to get response";
            toast.error(errorMessage);
        },
    });
};