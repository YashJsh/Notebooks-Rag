import OpenAI from "openai";


const client = new OpenAI();

export const EnhanceQuery = async (query : string)=>{
    const response = await client.chat.completions.create({
        model : "gpt-4o-mini",
        messages : [
        {
                role : "system",
                content : `You are a query enhancement engine.

Your sole responsibility is to return an improved version of the user's query when improvement is necessary.

Instructions:
- Rewrite the query only if it lacks clarity, context, specificity, or structure.
- If no improvement is necessary, return the original query verbatim.
- Never add explanations, notes, or metadata.
- Never ask follow-up questions.
- Never output anything other than the final query.

The output must be a single plain-text query.
`
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