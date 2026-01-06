import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type UploadPayload =
  | { type: "pdf"; file: File }
  | { type: "text"; text: string }
  | { type: "website"; url: string };

export const useUploadResource = () => {
  return useMutation({
    mutationFn: async (payload: UploadPayload) => {
      switch (payload.type) {
        case "pdf": {
          if (payload.file.type !== "application/pdf") {
            throw new Error("Only PDF files are allowed");
          }

          const formData = new FormData();
          formData.append("file", payload.file);

          const res = await api.post("/upload/pdf", formData);
          return res.data;
        }

        case "text": {
          const res = await api.post(
            "/upload/text",
            { text: payload.text }
          );
          return res.data;
        }

        case "website": {
          const res = await api.post(
            "/upload/website",
            { url: payload.url }
          );
          return res.data;
        }

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

      toast(messageMap[variables.type]);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Upload failed"
      );
    }
  });
};
