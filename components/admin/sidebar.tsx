"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessagesSquare, FileText, Tags, Settings, X } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/conversations", label: "Conversations", icon: MessagesSquare },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/taxonomy", label: "Taxonomy", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 border-r border-surface-line bg-surface transition-transform duration-150 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 md:py-5">
          <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-wide text-paper">
            Chive Admin
          </span>
          <button onClick={onClose} className="admin-btn h-8 w-8 p-0 md:hidden" aria-label="Close menu">
            <X size={15} />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-mint/10 text-mint" : "text-paper/70 hover:bg-surface-raised hover:text-paper"
                }`}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
