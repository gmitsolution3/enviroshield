"use client";

import {
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart/CartProvider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import Container from "../Container";

type TopHeaderBarProps = {
  onCartClick: () => void;
  cartOpen: boolean;
  cartTriggerRef: React.RefObject<HTMLButtonElement | null>;
};

function getInitials(name?: string | null, email?: string | null) {
  const trimmedName = name?.trim();

  if (trimmedName) {
    const initials = trimmedName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();

    if (initials) return initials;
  }

  return email?.trim().charAt(0).toUpperCase() || "U";
}

export default function TopHeaderBar({
  onCartClick,
  cartOpen,
  cartTriggerRef,
}: TopHeaderBarProps) {
  const { count } = useCart();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const initials = getInitials(user?.name, user?.email);

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="hidden h-[38px] border-b border-[#e9eef1] bg-white text-[13px] text-ink min-[901px]:block">
      <Container className="flex h-full items-center justify-between">
        <span className="flex items-center gap-[7px] font-normal">
          <MapPin size={14} aria-hidden="true" />
          House No: 22/13-15, Block-B, Bauniabad R/A, Mirpur 11,
          Pallabi, Dhaka 1216
        </span>

        <div className="flex h-full items-center gap-5">
          <span className="flex items-center gap-6">
            <a
              href="mailto:enviroshield.bd@gmail.com"
              className="flex items-center gap-[7px]"
            >
              <Mail size={14} aria-hidden="true" />
              enviroshield.bd@gmail.com
            </a>

            <a
              href="tel:+8801613220101"
              className="flex items-center gap-[7px]"
            >
              <Phone size={14} aria-hidden="true" />
              +8801613220101
            </a>
          </span>

          <span
            className="h-4 w-px bg-[#e9eef1]"
            aria-hidden="true"
          />

          {!isPending &&
            (user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label={`Open account menu for ${user.name || user.email}`}
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                    />
                  }
                >
                  <Avatar
                    size="sm"
                    className="border border-[#e9eef1]"
                  >
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || "Your profile"}
                    />

                    <AvatarFallback className="bg-navy text-[10px] font-bold text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  side="bottom"
                  sideOffset={8}
                  className="w-56 rounded-xl border border-[#e9eef1] bg-white p-1.5 shadow-lg"
                >
                  <div className="px-2.5 py-2">
                    <p className="truncate text-sm font-semibold text-navy">
                      {user.name || "Your account"}
                    </p>

                    <p className="truncate text-xs text-ink/55">
                      {user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    render={<Link href="/dashboard" />}
                    className="cursor-pointer rounded-lg"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={<Link href="/dashboard/profile" />}
                    className="cursor-pointer rounded-lg"
                  >
                    <UserRound className="size-4" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer rounded-lg text-red-600 focus:text-red-600"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-7 items-center justify-center rounded-full px-2 text-[12px] font-semibold text-navy transition-colors hover:bg-mist hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                Login
              </Link>
            ))}

          <button
            ref={cartTriggerRef}
            type="button"
            onClick={onCartClick}
            aria-label={`Open cart${count ? `, ${count} ${count === 1 ? "item" : "items"}` : ", empty"}`}
            aria-haspopup="dialog"
            aria-expanded={cartOpen}
            className="relative inline-grid size-7 shrink-0 place-items-center rounded-full text-navy transition-colors hover:bg-mist hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            <ShoppingBag size={17} aria-hidden="true" />

            {count > 0 && (
              <motion.span
                key={count}
                aria-hidden="true"
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1.3, 1] }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute -right-1 -top-1 grid min-w-[16px] place-items-center rounded-full bg-blue px-1 text-[9px] font-bold leading-4 text-white"
              >
                {count > 99 ? "99+" : count}
              </motion.span>
            )}
          </button>
        </div>
      </Container>
    </div>
  );
}
