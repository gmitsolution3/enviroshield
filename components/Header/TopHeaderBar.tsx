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
import { getInitials } from "@/lib/utils";
import SocialIcon from "@/components/icon/SocialIcons";

import Container from "../Container";

type TopHeaderBarProps = {
  onCartClick: () => void;
  cartOpen: boolean;
  cartTriggerRef: React.RefObject<HTMLButtonElement | null>;
};


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
    <div className="hidden h-[42px] border-b border-white/15 bg-blue text-[13px] min-[1150px]:text-[14px] 2xl:text-[15px] text-white min-[901px]:block">
      <Container className="flex h-full items-center justify-between">
        {/* Contact Information */}
        <span className="flex items-center gap-[7px] font-normal text-white/90 truncate max-w-[280px] min-[1150px]:max-w-[420px] 2xl:max-w-none">
          <MapPin size={15} className="shrink-0 text-white/80" aria-hidden="true" />
          <span className="truncate">House #13~15, Road # 22, Block # B, Bauniabad R/A, Mirpur-11, Dhaka-1216</span>
        </span>

        <div className="flex h-full items-center gap-3 min-[1150px]:gap-5">
          <span className="flex items-center gap-3 min-[1150px]:gap-6">
            <a
              href="mailto:enviroshield.bd@gmail.com"
              className="hidden lg:flex items-center gap-[7px] text-white/90 transition-colors hover:text-white"
            >
              <Mail size={15} className="text-white/80" aria-hidden="true" />
              enviroshield.bd@gmail.com
            </a>

            <a
              href="tel:+8801613220101"
              className="flex items-center gap-[7px] text-white/90 transition-colors hover:text-white whitespace-nowrap"
            >
              <Phone size={15} className="text-white/80" aria-hidden="true" />
              +880 1613-220101
            </a>
          </span>

          <span
            className="h-4 w-px bg-white/20"
            aria-hidden="true"
          />

          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://www.facebook.com/enviroshieldbd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enviroshield on Facebook"
              className="text-white/80 transition-colors hover:text-white"
            >
              <SocialIcon name="facebook" size={14} />
            </a>
            <a
              href="https://www.instagram.com/enviroshield.bd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enviroshield on Instagram"
              className="text-white/80 transition-colors hover:text-white"
            >
              <SocialIcon name="instagram" size={14} />
            </a>
            <a
              href="https://www.linkedin.com/company/enviroshieldbd/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enviroshield on LinkedIn"
              className="text-white/80 transition-colors hover:text-white"
            >
              <SocialIcon name="linkedin" size={14} />
            </a>
          </div>

          <span
            className="h-4 w-px bg-white/20"
            aria-hidden="true"
          />

          {/* Account: Skeleton, Avatar, or Login */}
          <div
            className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center"
            aria-live="polite"
          >
            {isPending ? (
              /* Avatar Skeleton */
              <div
                role="status"
                aria-label="Loading account"
                className="size-7 animate-pulse rounded-full border border-white/20 bg-white/20"
              >
                <span className="sr-only">
                  Loading account...
                </span>
              </div>
            ) : user ? (
              /* Authenticated User */
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label={`Open account menu for ${user.name || user.email}`}
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue"
                    />
                  }
                >
                  <Avatar
                    size="sm"
                    className="border border-white/30"
                  >
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name || "Your profile"}
                    />

                    <AvatarFallback className="bg-white text-[10px] font-bold text-blue">
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
                    render={
                      <Link href="/dashboard/profile" />
                    }
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
              /* Unauthenticated User */
              <Link
                href="/login"
                className="inline-flex h-7 items-center justify-center rounded-full px-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Login
              </Link>
            )}
          </div>

          {/* Shopping Cart */}
          <button
            ref={cartTriggerRef}
            type="button"
            onClick={onCartClick}
            aria-label={`Open cart${count ? `, ${count} ${count === 1 ? "item" : "items"}` : ", empty"}`}
            aria-haspopup="dialog"
            aria-expanded={cartOpen}
            className="relative inline-grid size-7 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ShoppingBag
              size={18}
              aria-hidden="true"
            />

            {count > 0 && (
              <motion.span
                key={count}
                aria-hidden="true"
                initial={{ scale: 0.5 }}
                animate={{ scale: [0.5, 1.3, 1] }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="absolute -right-1 -top-1 grid min-w-[16px] place-items-center rounded-full bg-white px-1 text-[9px] font-bold leading-4 text-blue shadow-xs"
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