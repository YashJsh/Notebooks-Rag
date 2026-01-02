import type { Context } from "hono";
import * as z from "zod";
import { client } from "../lib/prisma";
import { splitText } from "../utils/text_splitters";
import { vec } from "../utils/vec_db";
import { loadPDF } from "../utils/pdf_loader";
import path from "path";
import fs from "fs/promises"


export const textUpload = async (c: Context) => {
    try {
        const userId = c.get("id");
        const body = await c.req.json();
        const id = await c.req.param("id");

        const parsedBody = z.string().parse(body);
        const response = await client.document.findFirst({
            where: {
                notebookId: id,
                userId : userId,
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
                include : {
                    notebook : true
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

        return c.json({
            "success": true
        }, 201)
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return c.json(
                { error: error.flatten() },
                400
            );
        };
        console.log(error);
        return c.json({
            error: "Internal server error" 
        }, 500)
    }
}

export const pdfUpload = async (c: Context) => {
    try {
        const userId = c.get("id");
        const id = c.req.param("id");
        const body = await c.req.parseBody();
        console.log(body['file']);
        const file = body['file'];

        if (!file || !(file instanceof File)) {
            return c.json({ error: "PDF file is required" }, 400);
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
                include : {
                    notebook : true
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
        return c.json({
            "success": true
        }, 201)
    } catch (error) {
        console.warn(error);
        return c.json({
            succss: "false",
            error: "Internal server error "
        }, 500)
    };
}


