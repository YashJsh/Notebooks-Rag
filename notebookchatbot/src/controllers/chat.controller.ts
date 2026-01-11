import type { Context } from "hono";
import { EnhanceQuery } from "../utils/enhanceQuery";
import { chat } from "../utils/chat";
import z from 'zod';
import { APIResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { client } from "../lib/prisma";
import { APIError } from "../utils/apiError";

export const chatController = asyncHandler(async (c: Context) => {
  const notebookId = c.req.param('notebookId');
  const notebook = await client.notebook.findFirst({
    where : {
      id : notebookId,
    }
  });
  if (!notebook){
    throw new APIError(404, "Notebook Not found");
  };
  const query = await c.req.json();
  const data = z.string().parse(query);
  const enhanceQuery = await EnhanceQuery(data);
  const response = await chat(enhanceQuery as string, notebook.name);
  return c.json(new APIResponse(
    {
      "role": "assistant",
      "content": response!.airesponse.answer,
      "id": response!.id,
      "meta": response!.airesponse
    },
    "Response from AI"
  ))
});