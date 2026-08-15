import type { ReactNode } from "react";
import "./admin.css";

export const metadata = {
  title: "Chive Admin",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="admin-shell">{children}</div>;
}
