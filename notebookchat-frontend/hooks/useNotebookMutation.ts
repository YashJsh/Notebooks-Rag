"use client"

import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createNotebook, deleteNotebook, getNotebook, getNoteBooks } from "@/api/notebook.api"; 
import { getNotebookType } from "@/api/notebook.api";
import { toast } from "sonner";

const useGetNotebooks = () => {
    return useQuery<getNotebookType[]>({
      queryKey: ["notebooks"],
      queryFn: getNoteBooks,
    });
};

const useCreateNotebook = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["createNotebook"],
        mutationFn: createNotebook,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["notebooks"],
          });
          toast("Notebook Created Successfully");
        },
      });
};

const useSpecificNotebook = (id: string)=>{
    return useQuery<getNotebookType | null>({
        queryKey: ["notebook", id],
        queryFn: () => getNotebook(id),
        enabled: !!id,
    })
};

const useDeleteNotebook = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn : (notebookId : string)=>{
            const response = deleteNotebook(notebookId)
            return response;
        },
        onSuccess : ()=>{
            queryClient.invalidateQueries({
                queryKey: ["notebooks"],
            });
            toast("Notebook Deleted Successfully")
        },
        onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Deletion failed"
            );
        },
    })
}

export { useGetNotebooks, useCreateNotebook, useDeleteNotebook, useSpecificNotebook}

