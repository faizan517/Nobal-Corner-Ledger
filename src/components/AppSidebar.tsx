
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Menu,
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

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <SidebarTrigger>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SidebarTrigger>
        </div>
      )}
      <Sidebar className={isMobile ? "fixed inset-y-0 left-0 z-40" : ""}>
        <SidebarContent>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">VendorHub</h1>
          </div>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      className={location.pathname === item.path ? "bg-primary/10" : ""}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="mt-auto p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default AppSidebar;
