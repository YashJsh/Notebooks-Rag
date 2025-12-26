import { Hono, type Context } from "hono";
import { vec } from "./vec_db";
import { splitText } from "./text_splitters";
import { ZodError } from "zod/v3";
import * as z from "zod";
import { chat } from "./chat";

const dataRoute = new Hono();

dataRoute.post("/data", async (c: Context) => {
  try {
    const body = await c.req.json();
    console.log(body);
    const parsedBody = z.string().parse(body);

    const split = await splitText(parsedBody);

    const document = split.map((text) => ({
      pageContent: text,
      metadata: {
        time: Date.now(),
        source: "text"
      }
    }));
    console.log("Document is :",document);

    await vec(document);

    c.status(201);
    return c.json({
      "success": true
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        { error: error.flatten() },
        400
      );
    }
    console.log(error);
    return c.json({
      error : error
    })
  }
});

dataRoute.post("/chat", async (c: Context) => {
  try {
    const query = await c.req.json();
    const data = z.string().parse(query);
    const response = await chat(data);
    return c.json({
      "success": "true",
      "data": {
        "role" : "assistant",
        "content" : response!.airesponse.answer,
        "id" : response!.id,
        "meta" : response!.airesponse
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
})

export default dataRoute;


