import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { HowItWorks } from "@/components/how-it-works";
import { LatestConversations } from "@/components/latest-conversations";
import { BrowseConversations } from "@/components/browse-conversations";
import { PublishForm } from "@/components/publish-form";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import {
  getApprovedConversations,
  getActiveCategories,
  getActiveLlms,
  getSiteSettings,
} from "@/lib/public-data";

export default async function HomePage() {
  const [conversations, categories, llms, settings] = await Promise.all([
    getApprovedConversations(),
    getActiveCategories(),
    getActiveLlms(),
    getSiteSettings(),
  ]);

  const logoUrl = (settings.logo.url as string) || undefined;
  const slaText = (settings.review_sla_text.text as string) || undefined;
  const contactEmail = (settings.contact.email as string) || undefined;

  return (
    <>
      <Navbar logoUrl={logoUrl} />
      <main>
        <Hero settings={settings.hero} />
        <About settings={settings.about} />
        <HowItWorks settings={settings.how_it_works} />
        <LatestConversations conversations={conversations} />
        <BrowseConversations conversations={conversations} categories={categories} llms={llms} />
        <PublishForm categories={categories} llms={llms} slaText={slaText} />
        <Contact email={contactEmail} />
      </main>
      <Footer settings={settings.footer} logoUrl={logoUrl} />
      <ScrollToTop />
    </>
  );
}
