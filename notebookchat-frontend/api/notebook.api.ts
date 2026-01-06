import { api } from "@/lib/api"
import { createNotebookType } from "@/types/notebook.tyeps";

//For fetching all the notebooks
export const getNoteBooks = async ()=>{
    const response = await api.get("/notebooks");
    return response.data;
};

//For creating a notebook
export const createNotebook = async(data : createNotebookType)=>{
    const response = await api.post("/notebooks/create", JSON.stringify(data));
    return response.data;
};

// Get a specific notebook
export const getNotebook = async(id : string)=>{
    const response = await api.get(`/notebooks/${id}`);
    return response.data;
};

// Delete a particualar notebook
export const deleteNotebook = async (id : string)=>{
    const response = await api.delete(`/notebooks/${id}`);
    return response.data;
};
