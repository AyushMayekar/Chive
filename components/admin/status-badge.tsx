export function StatusBadge({ status }: { status: "Pending" | "Approved" | "Rejected" }) {
  const cls =
    status === "Approved"
      ? "admin-badge admin-badge-approved"
      : status === "Rejected"
        ? "admin-badge admin-badge-rejected"
        : "admin-badge admin-badge-pending";
  return <span className={cls}>{status}</span>;
}
