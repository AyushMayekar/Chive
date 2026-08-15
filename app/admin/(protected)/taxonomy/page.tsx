import Link from "next/link";
import { listTaxonomy } from "@/lib/admin/taxonomy";
import { TaxonomyTable } from "@/components/admin/taxonomy-table";

export default async function AdminTaxonomyPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === "llms" ? "llms" : "categories";
  const rows = await listTaxonomy(activeTab);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Link
          href="/admin/taxonomy?tab=categories"
          className={`admin-btn h-8 px-3 text-xs ${activeTab === "categories" ? "border-mint text-mint" : ""}`}
        >
          Categories
        </Link>
        <Link
          href="/admin/taxonomy?tab=llms"
          className={`admin-btn h-8 px-3 text-xs ${activeTab === "llms" ? "border-mint text-mint" : ""}`}
        >
          Supported LLMs
        </Link>
      </div>
      <TaxonomyTable table={activeTab} rows={rows} />
    </div>
  );
}
