"use client"

import { 
  AlertCircle, 
  BarChart3, 
  FileText, 
  Home, 
  Search, 
  TrendingUp, 
  Database,
  Bell,
  GraduationCap,
  Settings,
  User,
  Moon,
  Sun,
  LogOut
} from "lucide-react"
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "./animate-ui/components/radix/sidebar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./animate-ui/components/radix/dropdown-menu"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "./animate-ui/components/radix/avatar"
import Image from "next/image"

// Menu items
const items = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Tech explorer",
    url: "search",
    icon: Search,
  },
  {
    title: "Technology Details",
    url: "tech-detail",
    icon: Database,
  },
  {
    title: "Forecasting & Models",
    url: "forecasting",
    icon: TrendingUp,
  },
  {
    title: "Alerts & Monitoring",
    url: "alerts",
    icon: Bell,
  },
  {
    title: "Reports",
    url: "reports",
    icon: FileText,
  },
  {
    title: "Admin",
    url: "admin-ingestion",
    icon: Settings,
  },
  {
    title: "Onboarding",
    url: "#",
    icon: GraduationCap,
  },
]

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()

  return (
    <Sidebar>
      <SidebarHeader>
  <div className="flex items-center gap-3 px-4 py-2">
    <div className="flex items-center justify-center shrink-0">
      <Image
        src="/logo.png"
        alt="IntelForge Logo"
        width={40}
        height={40}
        className="object-contain block"
        priority
      />
    </div>

    {state === "expanded" && (
      <span className="font-extrabold text-lg leading-none text-black dark:text-white">
        IntelForge
      </span>
    )}
  </div>
</SidebarHeader>

      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src="/avatar.png" alt="User" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  {state === "expanded" && (
                    <div className="flex flex-col items-start flex-1 overflow-hidden">
                      <span className="text-sm font-medium truncate">Aditya</span>
                      <span className="text-xs text-muted-foreground truncate">aditya@intelforge.com</span>
                    </div>
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                  {theme === "light" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                  {theme === "dark" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System</span>
                  {theme === "system" && <span className="ml-auto">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}