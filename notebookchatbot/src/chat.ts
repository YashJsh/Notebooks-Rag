import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import OpenAI from "openai";
import { llmPrompt } from "./utils/prompt";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small"
});

interface AIAnswerResponse {
    answer: string;
    confidence_score: number | null; // null when not applicable
    source: SourceReference[] | null; // null unless explicitly requested
    notes?: string | null; // optional, nullable
}

interface SourceReference {
    type: "pdf" | "vector";
    reference: string; // e.g. "ProjectPlan.pdf:12" | "VectorID:457"
    excerpt: string;
}

const client = new OpenAI();

const messages : any = [{
    role : "system",
    content : llmPrompt
}];

async function searchVectorStore(query : string){
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "user-rag",
    }); 

    const vectorSearcher = vectorStore.asRetriever({
        k : 3
    });

    const relevantChunks = await vectorSearcher.invoke(query);
    messages.push({
        role : "system",
        content : `
            Context : ${JSON.stringify(relevantChunks)}
        `
    })
};

export async function chat(query : string){
    await searchVectorStore(query);
    messages.push({
        role : "user",
        content : query
    });

    const response = await client.chat.completions.create({
        model : "gpt-4.1-mini",
        messages : messages
    });

    const airesponse = response.choices[0]?.message.content;

    messages.push({
        role : "assistant",
        content : airesponse
    });
    if (!airesponse) return;

    
    const AIResponse : AIAnswerResponse = JSON.parse(airesponse);
    
    console.log("AI Response" , airesponse);

    return {
        airesponse : AIResponse,
        id : response.id
    }
};

