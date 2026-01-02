import { Hono, type Context } from "hono";
import { ZodError } from "zod/v3";
import * as z from "zod";
import { vec } from "../utils/vec_db";
import { chat } from "../chat";
import { websiteLoader } from "../utils/websiteloader";
import { EnhanceQuery } from "../utils/enhanceQuery";
import { pdfUpload, textUpload } from "../controllers/upload.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const dataRoute = new Hono();

//Here id is of notebook Id
dataRoute.post("/upload/:id/text", authMiddleware, textUpload);
dataRoute.post("/upload/pdf", authMiddleware, pdfUpload);


dataRoute.post("/chat", async (c: Context) => {
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
    if (error instanceof ZodError) {
      return c.json(
        { error: error.flatten() },
        400
      );
    }
    console.log(error);
  }
});

dataRoute.post("/upload/website", async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log(body);
    const website = z.url().parse(body);
    console.log("Website is : ",website);
    const content = await websiteLoader(website);
    const collection_name = "";
    const vector = await vec(content, collection_name);
    if (!vector){
      return c.json({
        "success" : false
      }, 500);
    };
    return c.json({
      "success": true,
      "data": "Created Successfully"
    }, 201);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        { error: error.flatten() },
        500
      );
    }
    return c.json({
      succss : "false"
    })
  }
});

export default dataRoute;


