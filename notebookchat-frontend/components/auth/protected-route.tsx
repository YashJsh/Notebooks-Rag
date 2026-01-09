"use client";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router, hasMounted]);

  if (!hasMounted || !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
