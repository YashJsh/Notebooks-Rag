import { api } from "@/lib/api";
import axios from "axios"

export interface SourceReference {
    type: "pdf" | "vector";
    reference: string; // e.g. "ProjectPlan.pdf:12" | "VectorID:457"
    excerpt: string;
  }
  
export interface AIAnswerResponse {
    answer: string;
    confidence_score: number | null; // null when not applicable
    source: SourceReference[] | null; // null unless explicitly requested
    notes?: string | null; // optional, nullable
}

export interface BackendResponse{
    success : "true";
    "data" : {
        "role" : "assistant",
        "content" : "string",
        "id" : string,
        "meta" : AIAnswerResponse
    }
}

export const chatResponse = async (query : string)=>{
    try {
        const response = await api.post("/chat", JSON.stringify(query));
        return response.data;
    } catch (error) {
        console.error(error);
    }
};