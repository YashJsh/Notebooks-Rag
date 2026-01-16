"use client"
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { signInType, SignUpSchemaType } from "@/types/auth.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useSignUp = ()=>{
    const router = useRouter();
    const {setAuth} = useAuthStore();
    return useMutation({
        mutationFn : async (data : SignUpSchemaType)=>{
            const res = await api.post("/auth/signup", JSON.stringify(data));
            return res.data;
        },
        onSuccess : (data)=>{
            const { email, id } = data.data;
            setAuth({email, id});
            router.push("/signin");
            toast("Signed Up Successfully");
        },
        onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Sign Up failed"
            );
        },
    });
};

export const useSignIn = ()=>{
    const router = useRouter();
    const {setAuth} = useAuthStore();
    return useMutation({
        mutationFn : async (data : signInType)=>{
            const res = await api.post("/auth/signin", JSON.stringify(data));
            return res.data;
        },
        onSuccess : (data)=>{
            const { email, id  } = data.data;
            setAuth({email, id});
            router.push("/")
            toast("Signed In Successfully");
        },
        onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Sign In failed"
            );
        },
    })
};

export const useMe = ()=>{
    return useQuery({
        queryKey : ["me"],
        queryFn : async ()=>{
            const res = await api.get("/auth/me", {
                withCredentials : true
            });
            return res.data.data;
        },
    })
}