import {
  BarChart3,
  CirclePile,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  User,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const dashboardIcons = {
  dashboard: LayoutDashboard,
  user: User,
  settings: Settings,
  users: Users,
  documents: FileText,
  analytics: BarChart3,
  circlepile: CirclePile,
  services: Wrench,
  projects: FolderKanban,
  testimonials: MessageSquareQuote,
} satisfies Record<string, LucideIcon>;

export type DashboardIcon = keyof typeof dashboardIcons;

export type DashboardRole = "user" | "admin" | string;

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: DashboardIcon;
};

export const dashboardNavigation: Record<
  DashboardRole,
  DashboardNavItem[]
> = {
  user: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Applications",
      href: "/dashboard/applications",
      icon: "documents",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: "user",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],

  admin: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Service Management",
      href: "/dashboard/services",
      icon: "services",
    },
    {
      title: "Project Management",
      href: "/dashboard/projects",
      icon: "projects",
    },
    {
      title: "Testimonial Management",
      href: "/dashboard/testimonials",
      icon: "testimonials",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
    },
  ],
};
