import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api";    
import { createNotebook, deleteNotebook, getNotebook, getNoteBooks } from "@/api/notebook.api";
import { get } from "http";

const useGetNotebooks = () => {
    return useQuery({
      queryKey: ["notebooks"],
      queryFn: getNoteBooks
    });
};

const useCreateNotebook = ()=>{
    return useMutation({
        mutationKey : ["createNotebook"],
        mutationFn : createNotebook
    });
};

const useSpecificNotebook = (notebookId : string)=>{
    return useQuery({
        queryKey: ["notebook", notebookId],
        queryFn: () => getNotebook(notebookId),
        enabled: !!notebookId,
    })
};

const useDeleteNotebook = (notebookId : string)=>{
    return useQuery({
        queryKey : ["notebook", notebookId],
        queryFn : ()=>{
            deleteNotebook(notebookId)
        },
        enabled : !!notebookId
    })
}

