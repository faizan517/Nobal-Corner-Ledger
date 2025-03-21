
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "./AppSidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading && location.pathname !== "/") {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate, location]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        <AppSidebar />
        <main className={`flex-1 p-4 md:p-8 overflow-auto ${isMobile ? 'w-full' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
          <footer className="mt-auto py-4 text-center text-sm text-gray-500">
            Version 1.0
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
