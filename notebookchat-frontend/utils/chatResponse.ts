import axios from "axios"

export const chatResponse = async (query : string)=>{
    try {
        const response = await axios.post("http://localhost:3000/api/chat", JSON.stringify(query));
        return response.data;
    } catch (error) {
        console.error(error);
    }

};