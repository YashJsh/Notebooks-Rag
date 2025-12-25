import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({ 
    chunkSize: 100, 
    chunkOverlap: 10 
})

export const splitText = async (text: string) => {
    const texts = await splitter.splitText(text);
    return texts;
}
