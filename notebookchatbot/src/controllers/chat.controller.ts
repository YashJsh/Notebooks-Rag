import type { Context } from "hono";
import { EnhanceQuery } from "../utils/enhanceQuery";
import { chat } from "../utils/chat";
import z from 'zod';

export const chatController = async (c : Context)=>{
    try {
        const query = await c.req.json();
        const data = z.string().parse(query);
        const enhanceQuery = await EnhanceQuery(data);
        const response = await chat(enhanceQuery as string);
        return c.json({
          "success": "true",
          "data": {
            "role": "assistant",
            "content": response!.airesponse.answer,
            "id": response!.id,
            "meta": response!.airesponse
          }
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
          return c.json(
            { error: error.flatten() },
            400
          );
        }
        console.log(error);
      }
};