"use client";

import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { signOutAction } from "@/lib/admin/auth";

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/conversations": "Conversations",
  "/admin/content": "Content",
  "/admin/taxonomy": "Taxonomy",
  "/admin/settings": "Settings",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/admin/conversations")) return "Conversations";
  return "Admin";
}

export function Topbar({ onMenu, email }: { onMenu: () => void; email?: string }) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between border-b border-surface-line px-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="admin-btn h-8 w-8 p-0 md:hidden" aria-label="Open menu">
          <Menu size={15} />
        </button>
        <h1 className="text-sm font-semibold text-paper">{titleFor(pathname)}</h1>
      </div>
      <div className="flex items-center gap-3">
        {email && (
          <span className="hidden h-7 w-7 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-paper/80 sm:flex">
            {email.charAt(0).toUpperCase()}
          </span>
        )}
        <form action={signOutAction}>
          <button type="submit" className="admin-btn h-8 gap-1.5 px-2.5 text-xs">
            <LogOut size={13} />
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
