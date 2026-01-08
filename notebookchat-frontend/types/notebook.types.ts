import { z } from "zod";

const createNoteBookSchema = z.object({
    name : z.string()
})

export type createNotebookType = z.infer<typeof createNoteBookSchema>;