import bcrypt from "bcryptjs";

export const encryptPassword = async (password : string)=>{
    try{
        const encrypt = await bcrypt.hash(password, 10);
        return encrypt;
    }catch(error){
        console.warn("Error in encrypting password");
    }
};

export const comparePassword = async (passowrd : string, hashPassword : string) =>{
    const compare = await bcrypt.compare(passowrd, hashPassword);
    if (compare){
        return true;
    }else{
        return false;
    }
}