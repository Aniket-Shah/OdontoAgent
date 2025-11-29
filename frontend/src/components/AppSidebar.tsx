import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart3, FileText, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import companyLogo from "@/assets/company-logo.png";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Audit Log", url: "/audit", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  // Logout function
  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", 
      });

      if (res.ok) {
        window.location.href = "/login"; 
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center justify-center">
              <img src={companyLogo} alt="OdontoAgent" className="w-32 h-auto" />
            </div>
          ) : (
            <img src={companyLogo} alt="OdontoAgent" className="w-10 h-10 mx-auto object-contain" />
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground font-medium shadow-soft"
                            : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-primary"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tagline and Logout at bottom */}
        <div className="mt-auto p-4 border-t border-sidebar-border flex flex-col gap-3">
          {!collapsed && (
            <p className="text-xs text-sidebar-foreground/60 italic">
              "Assisting, not replacing, clinical judgment."
            </p>
          )}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
