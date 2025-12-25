import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

import type { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-",
});

export async function vec(data : Document[]){
    const vectorStore = await QdrantVectorStore.fromDocuments(data, embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "user-rag",
    });

    console.log("Indexing of documents done");
};

 