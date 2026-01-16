"use client";


import { useMe } from "@/hooks/useAuthMutation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/home");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
