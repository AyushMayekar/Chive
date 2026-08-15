import { LoginForm } from "@/components/admin/login-form";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-6 text-center">
        <p className="font-[family-name:var(--font-display)] text-xl font-bold text-paper">Chive Admin</p>
        <p className="mt-1 text-sm text-paper/55">Sign in to manage Chive.</p>
      </div>
      <LoginForm error={error} />
    </div>
  );
}
