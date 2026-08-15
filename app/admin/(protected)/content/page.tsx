import { getAllSiteSettingsAdmin } from "@/lib/admin/site-settings";
import { SiteSettingForm, type FieldSpec } from "@/components/admin/site-setting-form";

const ABOUT_FIELDS: FieldSpec[] = [1, 2, 3, 4].flatMap((n) => [
  { key: `card${n}_title`, label: `Card ${n} title`, type: "text" },
  { key: `card${n}_body`, label: `Card ${n} body`, type: "textarea" },
]);

const HOW_IT_WORKS_FIELDS: FieldSpec[] = [1, 2, 3, 4].flatMap((n) => [
  { key: `step${n}_title`, label: `Step ${n} title`, type: "text" },
  { key: `step${n}_body`, label: `Step ${n} body`, type: "textarea" },
]);

export default async function AdminContentPage() {
  const settings = await getAllSiteSettingsAdmin();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SiteSettingForm
        settingKey="hero"
        title="Hero"
        value={settings.hero}
        fields={[
          { key: "eyebrow", label: "Eyebrow text", type: "text" },
          { key: "subheadline", label: "Subheadline", type: "textarea" },
          { key: "features", label: "Feature list", type: "list" },
        ]}
      />

      <SiteSettingForm settingKey="about" title="About (4 cards)" value={settings.about} fields={ABOUT_FIELDS} />

      <SiteSettingForm
        settingKey="how_it_works"
        title="How It Works (4 steps)"
        value={settings.how_it_works}
        fields={HOW_IT_WORKS_FIELDS}
      />

      <SiteSettingForm
        settingKey="footer"
        title="Footer"
        value={settings.footer}
        fields={[
          { key: "tagline", label: "Tagline", type: "text" },
          { key: "github", label: "GitHub URL", type: "text" },
          { key: "linkedin", label: "LinkedIn URL", type: "text" },
          { key: "instagram", label: "Instagram URL", type: "text" },
          { key: "whatsapp", label: "WhatsApp URL", type: "text" },
          { key: "copyright_name", label: "Copyright name", type: "text" },
        ]}
      />

      <SiteSettingForm
        settingKey="contact"
        title="Contact"
        value={settings.contact}
        fields={[{ key: "email", label: "Contact email", type: "text" }]}
      />

      <SiteSettingForm
        settingKey="logo"
        title="Logo"
        value={settings.logo}
        fields={[{ key: "url", label: "Logo image URL", type: "text" }]}
      />
    </div>
  );
}
