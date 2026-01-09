import type { Context } from "hono";
import { client } from "../lib/prisma";
import { notebookSchema } from "../schema/notebook.schema";
import { APIResponse } from "../utils/apiResponse";
import { APIError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getNotebookController = asyncHandler(async (c: Context) => {
    const id = await c.get("id");
    const getNotebooks = await client.notebook.findMany({
        where: {
            userId: id
        }
    });
    if (!getNotebooks) {
        throw new APIError(404, "No notebook found")
    };
    console.log("getNotebooks is : ",getNotebooks);
    return c.json(new APIResponse(getNotebooks), 201)
});

export const createNotebookController = asyncHandler(async (c: Context) => {
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
        {
            notebook: notebook.name,
            notebookId: notebook.id,
            createdBy: notebook.userId
        }
    ), 201
    )
})

export const deleteNotebookController = asyncHandler(async (c: Context) => {
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

    return c.json(new APIResponse( { notebookId: deleteNotebook.id }, "notebook deleted successsfully"), 201);
});

export const getNotebook = asyncHandler(async (c : Context)=>{
    const userId = await c.get("id");
    const notebookId = await c.req.param('id');
    const notebook = await client.notebook.findUnique({
            where: {
                id: notebookId,
                userId: userId
            }
    });
    console.log("Notebook sending : ", notebook);
    return c.json(new APIResponse({
            notebook
    },
    ), 200);
});
