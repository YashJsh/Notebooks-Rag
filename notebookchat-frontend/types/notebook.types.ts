import { z } from "zod";

const createNoteBookSchema = z.object({
    name : z.string()
})

export type createNotebookType = z.infer<typeof createNoteBookSchema>;


// types/notebook.types.ts
export interface Notebook {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
  }
  
  export interface GetNotebooksApiResponse {
    data: Notebook[];
    message: string;
  }
  
  export interface GetNotebookApiResponse {
    data: {
      notebook: Notebook | null;
      resources: number;
    };
  }
  