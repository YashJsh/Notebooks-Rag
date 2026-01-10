import { uploadPDFAPI, uploadTextAPI, uploadWebsiteAPI } from "@/api/upload.api";
import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type UploadPayload =
  | { type: "pdf"; file: File }
  | { type: "text"; data: string }
  | { type: "website"; url: string };

type UploadVariables = 
{
  payload : UploadPayload,
  notebookId : string
}

export const useUploadResource = () => {
  return useMutation({
    mutationFn: async ({payload, notebookId} : UploadVariables) => {
      switch (payload.type) {
        case "pdf": {
          if (payload.file.type !== "application/pdf") {
            toast("Only PDF files are allowed");
            throw new Error("Only PDF files are allowed");
          }
          await uploadPDFAPI(payload.file, notebookId);
          break;
        };

        case "text": {
          await uploadTextAPI(payload.data, notebookId);
          break;
        };

        case "website": {
          await uploadWebsiteAPI(payload.url, notebookId);
          break;
        };

        default:
          throw new Error("Invalid upload type");
      }
    },

    onSuccess: (_, variables) => {
      const messageMap = {
        pdf: "PDF uploaded successfully",
        text: "Text uploaded successfully",
        website: "Website embedded successfully"
      };

      toast(messageMap[variables.payload.type]);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Upload failed"
      );
    }
  });
};
