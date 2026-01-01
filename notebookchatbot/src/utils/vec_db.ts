import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

import type { Document } from "@langchain/core/documents";

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

export async function vec(data : Document[], collection_name : string){
  try {
    const vectorStore = await QdrantVectorStore.fromDocuments(data, embeddings, {
      url: process.env.QDRANT_URL,
      collectionName: collection_name,
    });
    console.log("Indexing of documents done");
    return true;
  } catch (error) {
    console.warn("Error in creating storing and creating vector embeddings");
  }
};

 