"use client";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";

const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (hasMounted && isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router, hasMounted]);

  if (!hasMounted || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
