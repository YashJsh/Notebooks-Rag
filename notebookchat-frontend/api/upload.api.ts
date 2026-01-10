import { api } from "@/lib/api"

const uploadTextAPI = async (data : string, id : string)=>{
    const response = await api.post(`/upload/${id}/text`, JSON.stringify(data));
    return response.data;
}

const uploadPDFAPI = async (file : File, id : string)=>{
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/upload/${id}/pdf`, formData, {
        headers : {
            "Content-Type" : "multipart/form-data"
        },
    });
    return response.data;
}

const uploadWebsiteAPI = async (data : string, id : string)=>{
    const response = await api.post(`/upload/${id}/website`, JSON.stringify(data));
    return response.data;
}

export { uploadPDFAPI, uploadTextAPI,  uploadWebsiteAPI}