"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  approveConversation,
  rejectConversation,
  revertConversationToPending,
  deleteConversation,
  setConversationFeatured,
} from "@/lib/admin/conversations.actions";

export function ConversationActions({
  id,
  status,
  featured,
}: {
  id: string;
  status: "Pending" | "Approved" | "Rejected";
  featured: boolean;
}) {
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function run(action: () => Promise<void>, after: "refresh" | "list" = "refresh") {
    startTransition(async () => {
      await action();
      if (after === "list") {
        router.push("/admin/conversations");
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="admin-card space-y-3 p-4">
      <div className="flex flex-wrap gap-2">
        {status !== "Approved" && (
          <button
            disabled={pending}
            onClick={() => run(() => approveConversation(id))}
            className="admin-btn admin-btn-primary"
          >
            Approve
          </button>
        )}
        {status !== "Rejected" && (
          <button
            disabled={pending}
            onClick={() => run(() => rejectConversation(id, reason))}
            className="admin-btn"
          >
            Reject
          </button>
        )}
        {status !== "Pending" && (
          <button
            disabled={pending}
            onClick={() => run(() => revertConversationToPending(id))}
            className="admin-btn"
          >
            Revert to Pending
          </button>
        )}
        {status === "Approved" && (
          <button
            disabled={pending}
            onClick={() => run(() => setConversationFeatured(id, !featured))}
            className="admin-btn"
          >
            {featured ? "Unfeature" : "Feature"}
          </button>
        )}
        {status === "Rejected" && (
          <button
            disabled={pending}
            onClick={() => {
              if (window.confirm("This permanently removes the conversation and cannot be undone. Continue?")) {
                run(() => deleteConversation(id), "list");
              }
            }}
            className="admin-btn admin-btn-danger"
          >
            Delete
          </button>
        )}
      </div>
      <div>
        <label className="admin-label" htmlFor="reject-reason">
          Internal rejection reason (optional, used if you click Reject)
        </label>
        <input
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="admin-input"
          placeholder="Not shown publicly"
        />
      </div>
    </div>
  );
}
