
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import AppSidebar from "./AppSidebar";
import { Fonts } from "@/utils/Font.jsx";
import { SlCalender } from "react-icons/sl";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { isAuthenticated, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

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
          <header className="py-4 text-center text-lg text-white bg-black fixed top-0 left-0 right-0 z-10" style={{ ...Fonts.Sans }}>
            <div className="flex items-center justify-center gap-2">
              <SlCalender />
              <span style={{ ...Fonts.Poppins }}>{currentDate}</span>
            </div>
          </header>
          <div className="max-w-7xl mx-auto mt-16"> {/* Added mt-16 to account for fixed header height */}
            {children}
          </div>
          <footer className="py-4 text-center text-sm text-gray-500 mt-10" style={{ ...Fonts.Sans }}>
            Powered by <span className="font-bold" style={{ ...Fonts.Poppins }}>Methologik</span> Version 1.0
          </footer>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
