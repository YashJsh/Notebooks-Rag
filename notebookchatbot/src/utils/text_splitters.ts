import type { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({ 
    chunkSize: 100, 
    chunkOverlap: 10 
})

export const splitText = async (text: string) => {
    const texts = await splitter.splitText(text);
    return texts;
};

export const splitDocument = async (document : Document[])=>{
    const chunks = await splitter.splitDocuments(document)
    return chunks
};