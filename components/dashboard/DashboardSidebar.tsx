"use client";
import { getInitials } from "@/lib/utils";

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

/**
 * Single source of truth for menu, sub menu and settings items.
 * Every state (default / hover / active / collapsed) lives here,
 * so all levels always look and behave the same.
 * The `!` modifiers make sure the shadcn defaults of
 * SidebarMenuButton / SidebarMenuSubButton never win.
 */
const navItemStyles = (active: boolean) =>
  cn(
    // base
    "relative h-9 gap-2.5 rounded-md px-2.5",
    "text-[14px] !font-medium !text-ink/80",
    "transition-colors duration-200",

    // icon colour (sidebar's SubButton forces its own colour on child svgs,
    // so it has to be set explicitly on the svg, not just inherited)
    "[&>svg]:!text-ink/80",

    // hover
    "hover:!bg-blue/10 hover:!text-blue hover:[&>svg]:!text-blue",

    // collapsed (icon) mode
    "group-data-[collapsible=icon]:justify-center",
    "group-data-[collapsible=icon]:px-0",

    // active
    active && [
      "!bg-blue/10 !text-blue !font-semibold [&>svg]:!text-blue",
      "hover:!bg-blue/10",
      "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5",
      "before:-translate-y-1/2 before:rounded-full before:bg-blue",
    ],
  );

// Icon colour is controlled by navItemStyles via [&>svg] (default / hover / active).
const navIconStyles = "h-[15px] w-[15px] shrink-0";

const isPathActive = (pathname: string, href?: string) => {
  if (!href) return false;
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
};

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
      item.children?.some((child) =>
        isPathActive(pathname, child.href),
      ),
    );

    if (activeGroup) {
      setExpandedItems((previous) => ({
        ...previous,
        [activeGroup.title]: true,
      }));
    }
  }, [pathname, navigation]);

  const initials = getInitials(user.name, user.email);

  const settingsActive = pathname.startsWith("/dashboard/settings");

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-line bg-white"
    >
      {/* Brand */}
      <SidebarHeader className="h-[64px] border-b border-line/80 p-0">
        <Link
          href="/"
          className="
            flex h-full w-full items-center gap-2.5 px-3.5
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
              item.children?.some((child) =>
                isPathActive(pathname, child.href),
              ) ?? false;

            const isActive = item.children
              ? hasActiveChild
              : isPathActive(pathname, item.href);

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
                      className={navItemStyles(isActive)}
                    >
                      <Icon className={navIconStyles} />

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
                      <SidebarMenuSub className="ml-4 mr-0 mt-1 gap-0.5 border-l border-line/80 pl-3">
                        {item.children.map((child) => {
                          const childIsActive = isPathActive(
                            pathname,
                            child.href,
                          );
                          const ChildIcon = child.icon
                            ? dashboardIcons[child.icon]
                            : null;

                          return (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                render={<Link href={child.href} />}
                                isActive={childIsActive}
                                className={navItemStyles(
                                  childIsActive,
                                )}
                              >
                                {ChildIcon && (
                                  <ChildIcon
                                    className={navIconStyles}
                                  />
                                )}

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
                    render={<Link href={item.href!} />}
                    isActive={isActive}
                    tooltip={item.title}
                    className={navItemStyles(isActive)}
                  >
                    <Icon className={navIconStyles} />

                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Bottom utility + account area */}
      <SidebarFooter className="mt-auto border-t border-line/80 p-2.5">
        {role === "admin" && (
          <SidebarMenu className="mb-2 gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard/settings" />}
                isActive={settingsActive}
                tooltip="Settings"
                className={navItemStyles(settingsActive)}
              >
                <Settings className={navIconStyles} />

                <span className="truncate group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

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
