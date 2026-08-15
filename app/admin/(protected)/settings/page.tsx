import { getAllSiteSettingsAdmin } from "@/lib/admin/site-settings";
import { SiteSettingForm } from "@/components/admin/site-setting-form";

export default async function AdminSettingsPage() {
  const settings = await getAllSiteSettingsAdmin();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SiteSettingForm
        settingKey="publishing_guidelines"
        title="Publishing guidelines"
        value={settings.publishing_guidelines}
        fields={[{ key: "text", label: "Guidelines text", type: "textarea" }]}
      />

      <SiteSettingForm
        settingKey="review_sla_text"
        title="Review SLA text"
        value={settings.review_sla_text}
        fields={[{ key: "text", label: "SLA text", type: "text" }]}
      />

      <SiteSettingForm
        settingKey="announcement"
        title="Homepage announcement"
        value={settings.announcement}
        fields={[
          { key: "enabled", label: "Show announcement banner", type: "checkbox" },
          { key: "text", label: "Announcement text", type: "text" },
        ]}
      />

      <p className="admin-card p-4 text-xs text-paper/50">
        Contact email is managed under Content → Contact.
      </p>
    </div>
  );
}
