import { Hono, type Context } from "hono";
import { ZodError } from "zod/v3";
import * as z from "zod";
import { splitText } from "../utils/text_splitters";
import { vec } from "../utils/vec_db";
import { chat } from "../chat";
import path from "path";
import fs from "fs/promises"
import { loadPDF } from "../utils/pdf_loader";
import { websiteLoader } from "../utils/websiteloader";
import { EnhanceQuery } from "../utils/enhanceQuery";
import { client } from "../lib/prisma";

const dataRoute = new Hono();

dataRoute.post("/upload/data", async (c: Context) => {
  try {
    const userId = ""
    const body = await c.req.json();
    const id = await c.req.param("id");
    console.log(body);
    const parsedBody = z.string().parse(body);

    const response = await client.document.findFirst({
      where : {
        notebookId : id
      }
    });

    let doc;

    if (!response){
      doc = await client.document.create({
        data : {
          notebookId : id,
          name : "default",
          userId : userId
        }
      });
    };

    const sourceFile = await client.sourceFile.create({
      data : {
        filename : "pasted text",
        fileType : "text",
        source : "paste",
        documentId : doc!.id,
        userId : userId,
      }
    });
    
    const split = await splitText(parsedBody);

    const document = split.map((text) => ({
      pageContent: text,
      metadata: {
        time: Date.now(),
        source: "text"
      }
    }));
    console.log("Document is :", document);
    
    const collectionName : string = response?.notebookId + doc!.name;

    await vec(document, collectionName);

    c.status(201);
    return c.json({
      "success": true
    })
    }
   catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        { error: error.flatten() },
        400
      );
    }
    console.log(error);
    return c.json({
      error: error
    })
  }
});

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
})

dataRoute.post("/upload/pdf", async (c: Context) => {
  try {
    const body = await c.req.parseBody();
    console.log(body['file']);
    const file = body['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: "PDF file is required" }, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const temp_file = path.join(    
      "/tmp",
      `${Date.now()}-${file.name}`
    );

    await fs.writeFile(temp_file, buffer);
    const docs = await loadPDF(temp_file);
    const collection_name = "";
    await vec(docs, collection_name);
    await fs.unlink(temp_file);
    return c.json({
      "success" : true
    })
  } catch (error) {
    console.warn(error);
    return c.json({
      succss : "false"
    })
  };
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


