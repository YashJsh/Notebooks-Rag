import OpenAI from "openai";
import { enhanceQueryPrompt } from "../constants";


const client = new OpenAI();

export const EnhanceQuery = async (query : string)=>{
    const response = await client.chat.completions.create({
        model : "gpt-4o-mini",
        messages : [
        {
                role : "system",
                content : enhanceQueryPrompt
        },
        {    
            role : "user",
            content : query
        }
        ]
    });

    const enhancedQuery = response.choices[0]?.message.content;
    console.log("Enhanced Query :", enhancedQuery);
    if (!enhancedQuery){
        return;
    }
    return enhancedQuery;
}