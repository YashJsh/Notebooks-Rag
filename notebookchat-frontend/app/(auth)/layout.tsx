import { Navbar } from "@/components/Navbar";
import RedirectIfAuthenticated from "@/components/auth/redirect-if-authenticated";

interface AuthLayoutProps {
    children: React.ReactNode;
  }
  
export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <RedirectIfAuthenticated>
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
        
                {/* Centered content area */}
                <main className="flex-1 flex items-center justify-center p-4">
                {children}
                </main>
            </div>
        </RedirectIfAuthenticated>
    );
  }
  