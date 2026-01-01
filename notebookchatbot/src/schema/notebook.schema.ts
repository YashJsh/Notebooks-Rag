import * as z from "zod";

export const notebookSchema = z.object({
    name : z.string()
});

