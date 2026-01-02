import type { Context } from "hono";
import { client } from "../lib/prisma";
import { notebookSchema } from "../schema/notebook.schema";

export const getNotebookController = async (c: Context) => {
    try {
        const id = await c.get("id");
        const getNotebooks = await client.notebook.findMany({
            where: {
                userId: id
            }
        });
        return c.json({
            success: true,
            data: getNotebooks
        }, 200);
    } catch (error) {
        return c.json({
            success: false,
            error: error
        }, 500)
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
        return c.json({
            success: true,
            data: {
                notebook: notebook.name,
                notebookId: notebook.id,
                createdBy: notebook.userId
            }
        }, 201)
    } catch (error) {
        return c.json({
            success: false,
            error: error
        }, 500)
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
            return c.json({
                success: false,
                error: "error deleting notebook"
            }, 403)
        };
        return c.json({
            success: true,
            data: "notebook deleted successfully"
        }, 200);
    } catch (error) {
        return c.json({
            success: false,
            error: error
        }, 500)
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
        return c.json({
            success: true,
            data: notebook
        });
    } catch (error) {
        return c.json({
            success: false,
            error: error
        }, 500)
    }
};