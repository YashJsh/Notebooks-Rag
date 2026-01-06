import type { Context } from "hono";
import { EnhanceQuery } from "../utils/enhanceQuery";
import { chat } from "../utils/chat";
import z from 'zod';
import { APIResponse } from "../utils/apiResponse";
import { APIError } from "../utils/apiError";

export const chatController = async (c : Context)=>{
    try {
        const query = await c.req.json();
        const data = z.string().parse(query);
        const enhanceQuery = await EnhanceQuery(data);
        const response = await chat(enhanceQuery as string);
        return c.json(new APIResponse(
          200,
          {
            "role": "assistant",
            "content": response!.airesponse.answer,
            "id": response!.id,
            "meta": response!.airesponse
          },
          "Response from AI"
        ))
     
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new APIError(400, "Validation Error", [error.message])
        }
        throw new APIError(500)
      }
};