import axios from "axios"

export const sendData = async (data : string)=>{
   try {
        const response = await axios.post("http://localhost:3000/api/data", JSON.stringify(data));
        return response.data;
   } catch (error) {
        console.warn(error);
   }
}