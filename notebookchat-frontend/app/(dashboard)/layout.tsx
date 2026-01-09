import { Navbar } from "@/components/Navbar";
import ProtectedRoute from "@/components/auth/protected-route";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="h-screen bg-background flex flex-col">
        <Navbar />
        {children}
      </div>
    </ProtectedRoute>
  );
}
