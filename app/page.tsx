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

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <LatestConversations />
        <BrowseConversations />
        <PublishForm />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
