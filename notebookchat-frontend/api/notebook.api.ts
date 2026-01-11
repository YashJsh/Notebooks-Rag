// api/notebook.api.ts
import { api } from "@/lib/api";
import {
  Notebook,
  GetNotebooksApiResponse,
  GetNotebookApiResponse,
} from "@/types/notebook.types";
import { createNotebookType } from "@/types/notebook.types";

// Fetch all notebooks
export const fetchNotebooks = async (): Promise<Notebook[]> => {
  const response = await api.get<GetNotebooksApiResponse>("/notebooks");
  console.log(response.data);
  return response.data.data;
};

// Fetch a specific notebook
export const fetchNotebookById = async (
  id: string
)=> {
  const response = await api.get<GetNotebookApiResponse>(`/notebooks/${id}`);
    return {
    notebook: response.data.data.notebook,
    resources: response.data.data.resources,
  };;
};

// Create notebook
export const createNotebook = async (data: createNotebookType) => {
  const response = await api.post("/notebooks/create", data);
  return response.data;
};

// Delete notebook
export const deleteNotebook = async (id: string) => {
  const response = await api.delete(`/notebooks/${id}`);
  return response.data;
};
