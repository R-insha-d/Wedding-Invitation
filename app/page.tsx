import { ArchCard } from "@/components/arch-card";
import { Divider } from "@/components/art/ornaments";
import { SvgDefs } from "@/components/art/svg-defs";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/sections/hero";
import {
  Closing,
  CountdownSection,
  DateBlock,
  Invitation,
  Venue,
  Verse,
} from "@/components/sections/content";

export default function Home() {
  return (
    <Experience>
      <SvgDefs />

      {/* Sage arches behind the card, like the printed invitation */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="js-sage-arch sage-arch sage-arch--left" />
        <div className="js-sage-arch sage-arch sage-arch--right" />
      </div>

      <main className="relative z-10 mx-auto w-[min(100%_-_1.5rem,44rem)] pt-10 pb-12">
        <ArchCard>
          <Hero />
          <Divider />
          <Verse />
          <Divider />
          <Invitation />
          <Divider />
          <DateBlock />
          <Divider />
          <CountdownSection />
          <Divider />
          <Venue />
          <Divider />
          <Closing />
        </ArchCard>
      </main>
    </Experience>
  );
}
