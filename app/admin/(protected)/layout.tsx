import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin/guard";
import { AdminChrome } from "@/components/admin/admin-chrome";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { supabase } = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminChrome email={user?.email ?? undefined}>{children}</AdminChrome>;
}
