"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  dashboardIcons,
  type DashboardNavItem,
  type DashboardRole,
} from "@/config/dashboard/navigation";

interface DashboardSidebarProps {
  role: DashboardRole;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  navigation: DashboardNavItem[];
}

export function DashboardSidebar({
  role,
  user,
  navigation,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const [expandedItems, setExpandedItems] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const activeGroup = navigation.find((item) =>
      item.children?.some(
        (child) =>
          pathname === child.href ||
          pathname.startsWith(`${child.href}/`),
      ),
    );

    if (activeGroup) {
      setExpandedItems((previous) => ({
        ...previous,
        [activeGroup.title]: true,
      }));
    }
  }, [pathname, navigation]);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="group border-r border-line bg-white"
    >
      {/* Brand */}
      <SidebarHeader className="h-[64px] border-b border-line/80 p-0">
        <Link
          href="/dashboard"
          className="
            group flex h-full w-full items-center gap-2.5 px-3.5
            transition-colors duration-200
            hover:bg-mist/60
            group-data-[collapsible=icon]:justify-center
            group-data-[collapsible=icon]:px-0
          "
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Enviroshield"
              width={500}
              height={500}
              className="h-8 w-8 object-contain"
              priority
            />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-[13px] font-bold tracking-[-0.02em] text-navy">
              Enviroshield
            </p>

            <p className="mt-0.5 truncate text-[10px] font-medium text-ink">
              {role === "admin" ? "Administration" : "Workspace"}
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2.5 py-4">
        <div className="mb-2 px-2 group-data-[collapsible=icon]:hidden">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink">
            Workspace
          </p>
        </div>

        <SidebarMenu className="gap-0.5">
          {navigation.map((item) => {
            const Icon = dashboardIcons[item.icon];

            const hasActiveChild =
              item.children?.some(
                (child) =>
                  pathname === child.href ||
                  pathname.startsWith(`${child.href}/`),
              ) ?? false;

            const isActive = item.children
              ? hasActiveChild
              : item.href === "/dashboard"
                ? pathname === "/dashboard"
                : Boolean(
                    item.href &&
                    (pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)),
                  );

            const isExpanded =
              expandedItems[item.title] ?? hasActiveChild;

            return (
              <SidebarMenuItem key={item.title}>
                {item.children ? (
                  <>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedItems((previous) => ({
                          ...previous,
                          [item.title]: !isExpanded,
                        }))
                      }
                      className={cn(
                        "relative h-9 rounded-md px-2.5",
                        "text-[14px] !font-medium text-ink/80",
                        "transition-all duration-200",
                        "hover:bg-blue/[0.10] hover:text-blue",
                        isActive && "!bg-blue/[0.10]",
                        isActive && "!text-blue",
                        isActive && "!font-semibold",
                        isActive && "hover:bg-blue/[0.09]",
                        isActive &&
                          "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-blue",
                        "group-data-[collapsible=icon]:justify-center",
                        "group-data-[collapsible=icon]:px-0",
                      )}
                    >
                      <Icon className="h-[15px] w-[15px] shrink-0" />

                      <span className="min-w-0 flex-1 truncate text-left group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>

                      <ChevronDown
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                          isExpanded && "rotate-180",
                          "group-data-[collapsible=icon]:hidden",
                        )}
                      />
                    </SidebarMenuButton>

                    {isExpanded && (
                      <SidebarMenuSub className="ml-4 mr-0 mt-1 border-l border-line/80 pl-3">
                        {item.children.map((child) => {
                          const childIsActive =
                            pathname === child.href ||
                            pathname.startsWith(`${child.href}/`);

                          return (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                render={<Link href={child.href} />}
                                isActive={childIsActive}
                                className={cn(
                                  "relative h-9 rounded-md px-2.5",
                                  "text-[14px] !font-medium text-ink/80",
                                  "transition-all duration-200",
                                  "hover:bg-blue/[0.10] hover:text-blue",
                                  childIsActive && "!bg-blue/[0.10]",
                                  childIsActive && "!text-blue",
                                  childIsActive && "!font-semibold",
                                  childIsActive &&
                                    "hover:bg-blue/[0.10]",
                                  childIsActive &&
                                    "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-blue",
                                  "group-data-[collapsible=icon]:justify-center",
                                  "group-data-[collapsible=icon]:px-0",
                                )}
                              >
                                {child.icon &&
                                  (() => {
                                    const ChildIcon =
                                      dashboardIcons[child.icon];

                                    return (
                                      <ChildIcon
                                        className={cn(
                                          "h-[15px] w-[15px] shrink-0 !text-ink/80",
                                          childIsActive &&
                                            "!text-blue",
                                        )}
                                      />
                                    );
                                  })()}

                                <span className="truncate">
                                  {child.title}
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : (
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "relative h-9 rounded-md px-2.5",
                      "text-[14px] !font-medium text-ink/80",
                      "transition-all duration-200",
                      "hover:bg-blue/[0.10] hover:text-blue",
                      isActive &&
                        "bg-blue/[0.10] text-blue font-semibold",
                      isActive && "hover:bg-blue/[0.10]",
                      isActive &&
                        "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-blue",
                      "group-data-[collapsible=icon]:justify-center",
                      "group-data-[collapsible=icon]:px-0",
                    )}
                  >
                    <Link
                      href={item.href!}
                      className="flex min-w-0 w-full items-center gap-2.5"
                    >
                      <Icon className="h-[15px] w-[15px] shrink-0" />

                      <span className="truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Bottom utility + account area */}
      <SidebarFooter className="mt-auto border-t border-line/80 p-2.5">
        <div className="mb-2 space-y-0.5">
          <Link href="/dashboard/settings">
            <SidebarMenuButton
              isActive={pathname.startsWith("/dashboard/settings")}
              tooltip="Settings"
              className={cn(
                "relative h-9 rounded-md px-2.5",
                "text-[14px] !font-medium text-ink/80",
                "transition-all duration-200",
                "hover:bg-blue/[0.10] hover:text-blue",

                // Active state
                pathname.startsWith("/dashboard/settings") &&
                  "!bg-blue/[0.10]",
                pathname.startsWith("/dashboard/settings") &&
                  "!text-blue",
                pathname.startsWith("/dashboard/settings") &&
                  "!font-semibold",
                pathname.startsWith("/dashboard/settings") &&
                  "hover:bg-blue/[0.09]",

                // Reference-style left active indicator
                pathname.startsWith("/dashboard/settings") &&
                  "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-blue",

                // Collapsed state
                "group-data-[collapsible=icon]:justify-center",
                "group-data-[collapsible=icon]:px-0",
              )}
            >
              <Settings className="h-[14px] w-[14px] shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Settings
              </span>
            </SidebarMenuButton>
          </Link>
        </div>

        {/* User */}
        <Link
          href="/dashboard/profile"
          className="
            flex min-w-0 items-center gap-2.5
            rounded-lg px-1.5 py-2
            transition-colors duration-200
            hover:bg-mist/70
            group-data-[collapsible=icon]:justify-center
          "
        >
          <Avatar className="h-10 w-10 shrink-0 border border-line">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name}
            />

            <AvatarFallback className="bg-navy text-[10px] font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate !text-[13px] font-semibold text-ink">
              {user.name}
            </p>

            <p className="truncate !text-[12px] text-ink/45">
              {user.email}
            </p>
          </div>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
