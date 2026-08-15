"use client";

import { useState, useTransition } from "react";
import { addTaxonomyItem, updateTaxonomyItem } from "@/lib/admin/taxonomy.actions";

type Row = { id: string; label: string; slug: string; active: boolean; sort_order: number; usage_count: number };

export function TaxonomyTable({ table, rows }: { table: "categories" | "llms"; rows: Row[] }) {
  const [newLabel, setNewLabel] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    if (!newLabel.trim()) return;
    startTransition(async () => {
      await addTaxonomyItem(table, newLabel);
      setNewLabel("");
    });
  }

  function rename(id: string, label: string) {
    startTransition(async () => {
      await updateTaxonomyItem(table, id, { label });
    });
  }

  function toggleActive(id: string, active: boolean) {
    startTransition(async () => {
      await updateTaxonomyItem(table, id, { active });
    });
  }

  function reorder(id: string, sort_order: number) {
    startTransition(async () => {
      await updateTaxonomyItem(table, id, { sort_order });
    });
  }

  return (
    <div className="admin-card">
      <div className="admin-table-scroll border-0">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Slug</th>
              <th>Sort</th>
              <th>Usage</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    defaultValue={row.label}
                    onBlur={(e) => e.target.value !== row.label && rename(row.id, e.target.value)}
                    className="admin-input h-8 w-40"
                  />
                </td>
                <td className="text-paper/50">{row.slug}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={row.sort_order}
                    onBlur={(e) => reorder(row.id, Number(e.target.value))}
                    className="admin-input h-8 w-16"
                  />
                </td>
                <td className="text-paper/60">{row.usage_count}</td>
                <td>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={row.active}
                      disabled={pending}
                      onChange={(e) => toggleActive(row.id, e.target.checked)}
                    />
                    {row.active ? "Active" : "Disabled"}
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 border-t border-surface-line p-3">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder={table === "categories" ? "New category label" : "New LLM label"}
          className="admin-input h-9 max-w-xs"
        />
        <button onClick={add} disabled={pending} className="admin-btn admin-btn-primary h-9 px-4 text-xs">
          Add
        </button>
      </div>
    </div>
  );
}
