import { create } from "zustand";

interface NotebookStore{
    notebookCount : number;
    selectedNotebookId : string | null,
    selectNotebook: (id: string) => void;
    setNotebookCount : (notebooks : number)=> void;
}

const useNotebookStore = create<NotebookStore>((set)=>({
    notebookCount : 0,
    selectedNotebookId : null,
    selectNotebook : (id : string)=>{
        set({
            selectedNotebookId : id
        });
    },
    setNotebookCount : (notebooks : number)=>{
        set({
            notebookCount : notebooks
        })
    }
}));