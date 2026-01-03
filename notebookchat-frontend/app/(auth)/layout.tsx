import { Navbar } from "@/components/Navbar";

interface AuthLayoutProps {
    children: React.ReactNode;
  }
  
export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
  
        {/* Centered content area */}
        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    );
  }
  