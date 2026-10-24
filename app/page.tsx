import { profile } from "@/content/profile";
import { Preloader } from "@/components/preloader";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Snippets } from "@/components/sections/snippets";
import { WorkOn } from "@/components/sections/work-on";
import { About } from "@/components/sections/about/about";
import { Playground } from "@/components/sections/playground/playground";
import { Guestbook } from "@/components/sections/guestbook/guestbook";

export default function HomePage() {
  return (
    <>
      <Preloader name={profile.name} />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Work />
        <Snippets />
        <WorkOn />
        <About />
        <Playground />
        <Guestbook />
      </main>
      <SiteFooter />
    </>
  );
}
