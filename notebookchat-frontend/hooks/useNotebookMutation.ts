"use client"

import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createNotebook, deleteNotebook, fetchNotebooks, fetchNotebookById } from "@/api/notebook.api"; 

import { toast } from "sonner";

const useGetNotebooks = () => {
    return useQuery({
      queryKey: ["notebooks"],
      queryFn: fetchNotebooks,
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
    return useQuery({
        queryKey: ["notebook", id],
        queryFn: () => fetchNotebookById(id),
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

