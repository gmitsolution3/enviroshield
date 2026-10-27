import {
  BarChart3,
  CirclePile,
  ClipboardList,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Package,
  Settings,
  ShoppingBag,
  ShoppingCart,
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
  contacts: Mail,
  ecommerce: ShoppingCart,
  products: Package,
  myOrders: ShoppingBag,
  myServices: ClipboardList,
} satisfies Record<string, LucideIcon>;

export type DashboardIcon = keyof typeof dashboardIcons;

export type DashboardRole = "user" | "admin" | string;

export type DashboardNavChild = {
  title: string;
  href: string;
  icon?: DashboardIcon;
};

export type DashboardNavItem = {
  title: string;
  href?: string;
  icon: DashboardIcon;
  children?: DashboardNavChild[];
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
      title: "My Orders",
      href: "/dashboard/my-orders",
      icon: "myOrders",
    },
    {
      title: "My Services",
      href: "/dashboard/my-services",
      icon: "myServices",
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
      title: "Blog Management",
      href: "/dashboard/blogs",
      icon: "documents",
    },
    {
      title: "Store",
      icon: "ecommerce",
      children: [
        {
          title: "Categories",
          href: "/dashboard/ecommerce/categories",
          icon: "circlepile",
        },
        {
          title: "Products",
          href: "/dashboard/ecommerce/products",
          icon: "products",
        },
        {
          title: "Inventory",
          href: "/dashboard/ecommerce/inventory",
          icon: "analytics",
        },
        {
          title: "Orders",
          href: "/dashboard/ecommerce/orders",
          icon: "documents",
        },
      ],
    },
    {
      title: "Contact Management",
      href: "/dashboard/contacts",
      icon: "contacts",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
    },
  ],
};
