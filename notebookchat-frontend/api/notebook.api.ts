import { api } from "@/lib/api"
import { createNotebookType } from "@/types/notebook.types";

export interface getNotebookType {
    id: string;
    name: string;
    userId: string;
    createdAt: string; // IMPORTANT: API returns ISO string, not Date
}
export interface GetNotebooksResponse {
    data: getNotebookType[];
    message: string;
}

export interface GetNotebook {
    data: {
      notebook: getNotebookType | null;
    };
}

//For fetching all the notebooks
export const getNoteBooks = async () : Promise<getNotebookType[]>=>{
    const response = await api.get<GetNotebooksResponse>("/notebooks");
    return response.data.data;
};

//For creating a notebook
export const createNotebook = async(data : createNotebookType)=>{
    const response = await api.post("/notebooks/create", JSON.stringify(data));
    return response.data;
};

// Get a specific notebook
export const getNotebook = async(id : string)=>{
    const response = await api.get<GetNotebook>(`/notebooks/${id}`);
    console.log("getNotebook",response.data);
    return response.data.data.notebook;
};

// Delete a particualar notebook
export const deleteNotebook = async (id : string)=>{
    const response = await api.delete(`/notebooks/${id}`);
    return response.data;
};
