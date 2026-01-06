import type { Context } from "hono";
import { client } from "../lib/prisma";
import { notebookSchema } from "../schema/notebook.schema";
import { APIResponse } from "../utils/apiResponse";
import { APIError } from "../utils/apiError";

export const getNotebookController = async (c: Context) => {
    try {
        const id = await c.get("id");
        const getNotebooks = await client.notebook.findMany({
            where: {
                userId: id
            }
        });
        return c.json(new APIResponse(200, getNotebooks))
    } catch (error) {
        throw new APIError(500);
    }
};

export const createNotebookController = async (c: Context) => {
    try {
        const id = await c.get("id");
        const body = await c.req.json();
        const parsedBody = notebookSchema.parse(body);
        const notebook = await client.notebook.create({
            data: {
                name: parsedBody.name,
                userId: id
            }
        });
        return c.json(new APIResponse(
            201,
            {
                notebook: notebook.name,
                notebookId: notebook.id,
                createdBy: notebook.userId
            }
        )
        )
    } catch (error) {
        throw new APIError(500);
    }
};

export const deleteNotebookController = async (c: Context) => {
    try {
        const userId = await c.get("id");
        const notebookId = await c.req.param('id');
        const deleteNotebook = await client.notebook.delete({
            where: {
                id: notebookId,
                userId: userId
            }
        });
        if (!deleteNotebook) {
            throw new APIError(403, "Error Deleting notebook")
        };

        return c.json(new APIResponse(201, { notebookId: deleteNotebook.id }, "notebook deleted successsfully"));
    } catch (error) {
        throw new APIError(500);
    }
};

export const getNotebook = async (c: Context) => {
    try {
        const userId = await c.get("id");
        const notebookId = await c.req.param('id');
        const notebook = await client.notebook.findUnique({
            where: {
                id: notebookId,
                userId: userId
            }
        });
        return c.json(new APIResponse(200, {
            notebook
        },
        ));
    } catch (error) {
        throw new APIError(500);
    }
};