"use client";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useMe } from "@/hooks/useAuthMutation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data : user, isPending, isError } = useMe();
  const router = useRouter();
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (hasMounted && isError) {
      router.push("/signin");
    }
  }, [isPending, router, isError, hasMounted]);

  if (!hasMounted || isError || isPending) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
