import type { Context } from "hono";
import * as z from "zod";
import { client } from "../lib/prisma";
import { splitText } from "../utils/text_splitters";
import { vec } from "../utils/vec_db";
import { loadPDF } from "../utils/pdf_loader";
import path from "path";
import fs from "fs/promises"
import { websiteLoader } from "../utils/websiteloader";
import { APIError } from "../utils/apiError";
import { APIResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";


export const textUpload = asyncHandler(async (c: Context) => {
    const userId = c.get("id");
    const body = await c.req.json();
    const id = await c.req.param("id");

    const parsedBody = z.string().parse(body);
    const response = await client.document.findFirst({
        where: {
            notebookId: id,
            userId: userId,
        },
        include: {
            notebook: true
        }
    });

    const doc =
        response ??
        (await client.document.create({
            data: {
                notebookId: id,
                name: "default",
                userId,
            },
            include: {
                notebook: true
            }
        }));


    const sourceFile = await client.sourceFile.create({
        data: {
            filename: "pasted text",
            fileType: "text",
            source: "paste",
            documentId: doc!.id,
            userId: userId,
        }
    });

    const split = await splitText(parsedBody);

    const document = split.map((text) => ({
        pageContent: text,
        metadata: {
            documentId: doc.id,
            sourceFileId: sourceFile.id,
            userId,
            source: "text",
        }
    }));

    await vec(document, doc.notebook.name);

    return c.json(new APIResponse({
        documentID: doc.id
    }), 201)
})

export const pdfUpload = asyncHandler(async (c : Context)=>{
    const userId = c.get("id");
    const id = c.req.param("id");
    const body = await c.req.parseBody();
    console.log(body['file']);
    const file = body['file'];

    if (!file || !(file instanceof File)) {
        throw new APIError(400, "PDF file is required");
    }

    //find document related to document first
    const response = await client.document.findFirst({
        where: {
            notebookId: id,
            userId: userId
        },
        include: {
            notebook: true
        }
    });

    const doc =
        response ??
        (await client.document.create({
            data: {
                notebookId: id,
                name: "default",
                userId,
            },
            include: {
                notebook: true
            }
        }));


    const buffer = Buffer.from(await file.arrayBuffer());
    const temp_file = path.join(
        "/tmp",
        `${Date.now()}-${file.name}`
    );

    await fs.writeFile(temp_file, buffer);
    const docs = await loadPDF(temp_file);
    const collection_name = doc.notebook.name;
    await vec(docs, collection_name);
    await fs.unlink(temp_file);

    return c.json(new APIResponse( {
        documentID: doc.id
    }), 201)
})

export const webSiteUpload = asyncHandler(async(c : Context) => {
    const userId = c.get("id");
    const id = c.req.param("id");
    const body = await c.req.json();
    const website = z.url().parse(body);
    console.log("Website is : ", website);
    const response = await client.document.findFirst({
        where: {
            notebookId: id,
            userId: userId
        },
        include: {
            notebook: true
        }
    });
    const doc =
        response ??
        (await client.document.create({
            data: {
                notebookId: id,
                name: "default",
                userId,
            },
            include: {
                notebook: true
            }
        }));

    const content = await websiteLoader(website);
    const collection_name = doc.notebook.name;
    const vector = await vec(content, collection_name);
    if (!vector) {
        throw new APIError(500)
    };
    return c.json(new APIResponse({
        documentID: doc.id
    },
        "embeddings created successfully"
    ), 201)
})

