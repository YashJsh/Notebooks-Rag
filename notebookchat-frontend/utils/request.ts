import axios from "axios"

export const sendData = async (data : string)=>{
   try {
        const response = await axios.post("http://localhost:3000/api/upload/data", JSON.stringify(data));
        return response.data;
   } catch (error) {
        console.warn(error);
   }
};

export const uploadPdf = async (file : File) =>{
     try {
          if (file.type !== "application/pdf") {
               console.warn("Only PDF files are allowed");
               return;
          };
          const formData = new FormData();
          formData.append("file", file);
          const response = await axios.post("http://localhost:3000/api/upload/pdf", formData, {
               headers : {
                    "Content-Type" : "multipart/form-data"
               },
          });
          console.log("Upload success:", response.data);
          return true;
     } catch (error) {
          console.warn(error);
     }
};

export const sendLink = async (link : string)=>{
     try {
          const response = await axios.post("http://localhost:3000/api/upload/website", JSON.stringify(link));
          if (response.status !== 201){
               console.warn("Error in creating embeddings");
               return false;
          }
          return true;
     } catch (error) {
          console.warn(error);
     }
}