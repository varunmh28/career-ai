"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
  Briefcase,
  Home,
  MessageSquare,
  Sparkles,
  User,
  Search,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/outreach", label: "Outreach", icon: MessageSquare },
  { href: "/agent", label: "AI Agent", icon: Sparkles, pro: true },
  { href: "/in/alex-carter", label: "Profile", icon: User },
  { href: "/pricing", label: "Plans", icon: Crown },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand & Search */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 text-white font-black text-base shadow-sm group-hover:opacity-90 transition">
              CP
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                CareerPrime
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-900">
                AI Pro
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              className="h-8 w-60 rounded-lg border border-zinc-200 bg-zinc-50/70 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950 transition"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.pro && (
                  <span className="hidden lg:inline-flex text-[9px] font-bold px-1 rounded bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                    PRO
                  </span>
                )}
              </Link>
            );
          })}

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          {/* Auth buttons */}
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-xs">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="primary" size="sm" className="text-xs">
                  Join Free
                </Button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-2 pl-1">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-7 w-7 ring-1 ring-zinc-300 dark:ring-zinc-700",
                  },
                }}
              />
            </div>
          </Show>
        </nav>
      </div>
    </header>
  );
}
