import type { Context } from "hono";
import { EnhanceQuery } from "../utils/enhanceQuery";
import { chat, searchVectorStore } from "../utils/chat";
import z from 'zod';
import { APIResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
// import { client } from "../lib/prisma";
import { APIError } from "../utils/apiError";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type ModelMessage } from "ai";
import { llmPrompt } from "../constants";

export const chatMemory = new Map<string, ModelMessage[]>()

export const chatController = async (c: Context) => {
  try {
    console.log("Chat controller initiated");
    
    const body = await c.req.json();
    const { messages } = body;
    
    console.log("Messages received:", messages);
    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: 'Invalid messages payload' }, 400);
    }

    const chatId = c.req.param("notebookId");
    if (!chatMemory.has(chatId)) {
      chatMemory.set(chatId, [
        { role: "system", content: llmPrompt }
      ])
    }

    const memory = chatMemory.get(chatId)!

    const lastUser = messages[messages.length - 1];
    const userText = lastUser.parts
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("")

    const relevantChunks = await searchVectorStore(userText, chatId);

    const ragMessage: ModelMessage = {
      role: "system",
      content: `Context:\n${JSON.stringify(relevantChunks)}`,
    };

    const promptMessages :  ModelMessage[]= [
      ...memory,
      ragMessage,
      { role: "user", content: userText }
    ]

    console.log("Starting streaming response...");
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: promptMessages,
      
    onFinish: ({ text }) => {
      // Persist memory in RAM
      memory.push({ role: "user", content: userText })
      memory.push({ role: "assistant", content: text })
    },
      onError: (error) => {
        console.error('StreamText error:', error);
      }
    });
    console.log("Streaming response initiated");
    return result.toUIMessageStreamResponse({
      
      onError: (error) => {
        console.error('UI Message Stream error:', error);
        return 'Streaming error occurred';
      },
    });
  } catch (error : any) {
    console.error("Chat controller error:", error);
    return c.json({ 
      error: 'Internal server error',
      details: error.message 
    }, 500);
  }
};


//iterable stream
//readable stream
// export const chatController = async (c : Context)=>{
//     const query = await c.req.json();
//     const response = await client.chat.completions.create({
//       model : "gpt-4.1-mini",
//       messages : [
//           {
//               role : "user",
//               content : query
//           }
//       ],
//       stream : true
//     });
//     const textencoder = new TextEncoder();
    
//     const stream = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of response){
//             const token = chunk.choices[0]?.delta.content;
//             if (token){
//               controller.enqueue(textencoder.encode(token));
//             }
//           }
//         } catch (err) {
//           console.error("Streaming error:", err);
//           controller.error(err);
//         } finally {
//           controller.close();
//         }
//       },
//     });
    
//     return new Response(stream, {
//       headers : {
//         "Content-Type": "text/plain; charset=utf-8",
//         "Cache-Control": "no-cache",
//         "Connection": "keep-alive",
//       }
//     });
// };

// export const chatController = asyncHandler(async (c: Context) => {
//   const notebookId = c.req.param('notebookId');
//   const notebook = await client.notebook.findFirst({
//     where : {
//       id : notebookId,
//     }
//   });
//   if (!notebook){
//     throw new APIError(404, "Notebook Not found");
//   };
//   const query = await c.req.json();
//   const data = z.string().parse(query);
//   const enhanceQuery = await EnhanceQuery(data);
//   const response = await chat(enhanceQuery as string, notebook.name);
//   return c.json(new APIResponse(
//     {
//       "role": "assistant",
//       "content": response!.airesponse.answer,
//       "id": response!.id,
//       "meta": response!.airesponse
//     },
//     "Response from AI"
//   ))
// });