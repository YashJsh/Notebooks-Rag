import { useMutation, useQuery } from "@tanstack/react-query"
import { createNotebook, deleteNotebook, getNotebook, getNoteBooks } from "@/api/notebook.api"; 

const useGetNotebooks = () => {
    return useQuery({
      queryKey: ["notebooks"],
      queryFn: getNoteBooks,
    });
};

const useCreateNotebook = ()=>{
    return useMutation({
        mutationKey : ["createNotebook"],
        mutationFn : createNotebook,
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
    return useMutation({
        mutationKey : ["notebook", notebookId],
        mutationFn : ()=>{
            const response = deleteNotebook(notebookId)
            return response;
        },
    })
}

