
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { Fonts } from '@/utils/Font.jsx';
import { RxHamburgerMenu } from "react-icons/rx";

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Vendor Management",
    path: "/vendors",
    icon: Users,
  },
  {
    title: "Ledger Management",
    path: "/ledger",
    icon: BookOpen,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <SidebarTrigger className="bg-white text-black">
            <Button variant="outline" size="icon">
              <RxHamburgerMenu className="w-5 h-5" />
            </Button>
          </SidebarTrigger>
        </div>
      )}
      <Sidebar className={`${isMobile ? "fixed inset-y-0 left-0 z-40 bg-black text-white" : "bg-black text-white"}`}>
        <SidebarContent className="bg-black text-white" >
          <div>
            <h1 className="text-xl font-bold text-white p-5 ml-2 mt-20">VendorHub</h1>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel></SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="mt-10">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      size="lg"
                      className={`${location.pathname === item.path ? "bg-white text-black hover:bg-white hover:text-black" : "hover:bg-gray-800"}`}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span style={{ ...Fonts.Poppins }}>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="mt-auto p-16">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-gray-800 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-1 hover:text-white" />
              <span style={{ ...Fonts.Poppins }}>Logout</span>
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
