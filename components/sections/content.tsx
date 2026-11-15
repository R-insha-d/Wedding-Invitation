import { FloralCorner } from "@/components/art/floral";
import { DayCircle, MapPin, Rosette, SmallHeart, TwoHearts } from "@/components/art/ornaments";
import { QrCode } from "@/components/art/qr-code";
import { Countdown } from "@/components/countdown";
import { googleCalendarUrl, mapEmbedUrl, wedding } from "@/lib/wedding";

const sectionClass = "relative px-6 py-[clamp(3.25rem,12cqw,6rem)] text-center sm:px-12";

export function Verse() {
  return (
    <section id="verse" className={sectionClass} aria-label="Qur’anic verse">
      <Rosette data-anim="rosette" className="mx-auto mb-8 w-12 text-gold-500" />
      <blockquote
        data-anim="scrub-words"
        className="mx-auto max-w-[33rem] font-serif text-[clamp(1.3rem,4.7cqw,1.7rem)] leading-[1.6] text-ink italic text-balance"
      >
        “{wedding.verse.text}”
      </blockquote>
      <div data-anim="cite" className="mt-8 flex items-center justify-center gap-4">
        <span className="js-rule h-px w-[clamp(2.5rem,12cqw,5rem)] origin-right bg-linear-to-l from-gold-400 to-transparent" />
        <cite className="js-cite font-display text-[0.72rem] tracking-[0.36em] text-ink not-italic uppercase">
          {wedding.verse.reference}
        </cite>
        <span className="js-rule h-px w-[clamp(2.5rem,12cqw,5rem)] origin-left bg-linear-to-r from-gold-400 to-transparent" />
      </div>
    </section>
  );
}

export function Invitation() {
  return (
    <section className={sectionClass} data-anim="invitation" aria-label="Invitation">
      <p className="js-parents font-display text-[clamp(.85rem,3.4cqw,1.2rem)] tracking-[0.22em] text-ink uppercase text-balance">
        {wedding.groom.parents}
      </p>
      <p className="js-request mx-auto mt-4 max-w-[30rem] font-serif text-[clamp(1.18rem,4.3cqw,1.5rem)] leading-relaxed text-ink-soft italic text-balance">
        {wedding.request}
      </p>
      <h2 className="mt-[clamp(1.5rem,6cqw,2.5rem)] flex flex-col items-center">
        <span className="js-write write-on text-gold font-script text-[clamp(3.4rem,15cqw,5.8rem)] leading-[1.15]">
          {wedding.groom.name}
        </span>
        <span className="js-with2 flex items-center gap-4 py-1 font-serif text-[clamp(1.2rem,4.6cqw,1.7rem)] text-ink-soft italic">
          <span aria-hidden="true" className="js-with2-rule h-px w-16 origin-right bg-linear-to-l from-gold-400 to-transparent" />
          with
          <span aria-hidden="true" className="js-with2-rule h-px w-16 origin-left bg-linear-to-r from-gold-400 to-transparent" />
        </span>
        <span className="js-write write-on text-gold font-script text-[clamp(3.2rem,14cqw,5.6rem)] leading-[1.15]">
          {wedding.bride.name}
        </span>
      </h2>
      <p className="js-bride-parents mt-4 font-display text-[clamp(.78rem,3cqw,1rem)] tracking-[0.2em] text-ink">
        D/o {wedding.bride.parents.toUpperCase()}
      </p>
    </section>
  );
}

export function DateBlock() {
  const { weekday, day, month, year, time } = wedding.event;
  const lastDigit = Number(day.slice(-1));
  const reel = Array.from({ length: lastDigit + 1 }, (_, i) => lastDigit - i);

  return (
    <section className={sectionClass} data-anim="date" aria-label="Date and time">
      <p className="js-date-eyebrow eyebrow">Save the Date</p>
      <p className="js-month mt-5 pl-[0.55em] font-display text-[clamp(1.25rem,5.4cqw,2rem)] tracking-[0.55em] text-ink uppercase">
        {month}
      </p>

      <div className="mx-auto mt-6 grid max-w-[30rem] grid-cols-[1fr_auto_1fr] items-center">
        <div className="relative py-3 pr-[clamp(.75rem,4cqw,1.5rem)] text-right">
          <span className="js-date-rule absolute inset-x-0 top-0 h-px origin-right bg-gold-300" />
          <span className="js-weekday inline-block font-display text-[clamp(.78rem,3.2cqw,1.05rem)] tracking-[0.2em] text-ink uppercase">
            {weekday}
          </span>
          <span className="js-date-rule absolute inset-x-0 bottom-0 h-px origin-right bg-gold-300" />
        </div>

        <div className="relative px-[clamp(1rem,5cqw,1.8rem)]">
          <span className="js-date-bar absolute inset-y-[-12%] left-0 w-[2px] bg-gold-400" />
          <span className="js-day relative inline-flex font-serif text-[clamp(3.8rem,16cqw,6rem)] leading-none font-semibold lining-nums">
            <span className="sr-only">{day}</span>
            <span aria-hidden="true" className="text-gold">
              {day.slice(0, -1)}
            </span>
            <span aria-hidden="true" className="reel">
              <span className="js-reel reel__track">
                {reel.map((n) => (
                  <span key={n} className="text-gold">
                    {n}
                  </span>
                ))}
              </span>
            </span>
          </span>
          <DayCircle className="pointer-events-none absolute top-[-22%] left-[3%] h-[144%] w-[94%]" />
          <span className="js-date-bar absolute inset-y-[-12%] right-0 w-[2px] bg-gold-400" />
        </div>

        <div className="relative py-3 pl-[clamp(.75rem,4cqw,1.5rem)] text-left">
          <span className="js-date-rule absolute inset-x-0 top-0 h-px origin-left bg-gold-300" />
          <span className="js-year inline-block font-display text-[clamp(.78rem,3.2cqw,1.05rem)] tracking-[0.2em] text-ink">
            {year}
          </span>
          <span className="js-date-rule absolute inset-x-0 bottom-0 h-px origin-left bg-gold-300" />
        </div>
      </div>

      <p className="js-date-after mt-8 font-display text-[clamp(.95rem,3.8cqw,1.25rem)] tracking-[0.2em] text-ink">
        {time}
      </p>
      <div className="js-date-after mt-8">
        <p className="font-serif text-base text-ink-soft italic">Add it to your calendar</p>
        <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a className="btn-ghost w-[min(100%,16rem)] sm:w-auto" href={googleCalendarUrl} target="_blank" rel="noopener noreferrer">
            Google
          </a>
          <a className="btn-ghost w-[min(100%,16rem)] sm:w-auto" href="/wedding.ics">
            Apple · Outlook
          </a>
        </div>
      </div>
    </section>
  );
}

export function CountdownSection() {
  return (
    <section className={sectionClass} data-anim="countdown" aria-label="Countdown">
      <TwoHearts className="js-hearts mx-auto mb-3 w-28" />
      <h2 className="js-write write-on text-gold font-script text-[clamp(2.5rem,10.5cqw,4rem)] leading-[1.15] text-balance">
        {wedding.tagline}
      </h2>
      <div className="mx-auto mt-10 max-w-[32rem]">
        <Countdown start={wedding.event.start} end={wedding.event.end} />
      </div>
      <p className="js-blessing mx-auto mt-10 max-w-[26rem] font-serif text-[clamp(1.15rem,4.2cqw,1.4rem)] text-ink-soft italic text-balance">
        {wedding.blessing}
      </p>
    </section>
  );
}

export function Venue() {
  const { name, area, mapsUrl } = wedding.venue;
  return (
    <section id="venue" className={sectionClass} data-anim="venue" aria-label="Venue">
      <MapPin className="js-pin mx-auto mb-4 w-8" />
      <p className="js-venue-eyebrow eyebrow">Venue</p>
      <h2 className="js-venue-name mt-3 font-display text-[clamp(1.6rem,7.4cqw,2.8rem)] tracking-[0.12em] text-ink uppercase">
        {name}
      </h2>
      <p className="js-venue-area font-serif text-[clamp(1.3rem,5cqw,1.7rem)] text-ink-soft italic">{area}</p>

      <div className="mx-auto mt-[clamp(2rem,8cqw,2.5rem)] grid max-w-[26rem] items-stretch gap-6 sm:max-w-none sm:grid-cols-[1.35fr_1fr]">
        {/* Size container: every layer derives the same ogee crown from its cqw width. */}
        <div className="map-shell @container">
          <span aria-hidden="true" className="js-map-shadow map-shell__shadow ogee" />
          <div className="js-map map-frame ogee aspect-[4/4.5] sm:aspect-auto sm:h-full sm:min-h-[22rem]">
            <span aria-hidden="true" className="map-frame__mat ogee" />
            <div className="map-frame__inner ogee">
              <div className="map-frame__window ogee">
                {/* A still preview: taps open Google Maps instead of fighting the page scroll. */}
                <div inert className="js-map-iframe map-frame__map">
                  <iframe
                    title={`Map showing ${name}, ${area}`}
                    src={mapEmbedUrl}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    tabIndex={-1}
                  />
                  <span aria-hidden="true" className="map-ping" />
                </div>
                <span aria-hidden="true" className="map-frame__glow" />
              </div>
            </div>
            <span aria-hidden="true" className="map-chip">
              Open in Maps
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 3H3.5A.5.5 0 0 0 3 3.5v9a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V10M9 3h4v4M13 3 7.5 8.5" />
              </svg>
            </span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${name}, ${area} in Google Maps`}
              className="map-frame__link"
            />
          </div>
          <span aria-hidden="true" className="js-map-keystone map-keystone" />
        </div>

        {/* A QR code only helps when the invite is on a bigger screen than the guest's phone. */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="js-qr group hidden flex-col items-center justify-center gap-4 rounded-[22px] bg-ivory/80 px-6 py-7 shadow-[inset_0_0_0_1px_var(--color-gold-300)] transition-[translate] duration-500 hover:-translate-y-1 sm:flex"
        >
          <span className="js-qr-box relative block w-[min(11rem,82%)] rounded-2xl bg-white p-2 shadow-[0_0_0_1.5px_var(--color-gold-400),0_14px_28px_-16px_rgb(110_86_40/.6)]">
            <QrCode value={mapsUrl} className="js-qr-code block h-auto w-full" />
            {/* Idle scan line, the intro's "printing" beam, a confirm ring and viewfinder corners. */}
            <span aria-hidden="true" className="js-qr-scan qr-scan" />
            <span aria-hidden="true" className="js-qr-beam qr-beam" />
            <span aria-hidden="true" className="js-qr-confirm qr-confirm" />
            {(["tl", "tr", "bl", "br"] as const).map((corner) => (
              <span key={corner} aria-hidden="true" className={`js-qr-corner qr-corner qr-corner--${corner}`} />
            ))}
          </span>
          <span className="js-qr-label font-display text-[0.66rem] tracking-[0.34em] text-gold-600 uppercase">
            Scan for location
          </span>
          <span className="js-qr-hint font-serif text-base text-ink-soft italic">or tap to open Google Maps</span>
        </a>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          className="js-venue-btn btn-gold w-[min(100%,17rem)] sm:w-auto"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions
        </a>
        <a className="js-venue-btn btn-ghost w-[min(100%,17rem)] sm:w-auto" href={`tel:${wedding.contact.phone}`}>
          Call {wedding.contact.display}
        </a>
      </div>
    </section>
  );
}

export function Closing() {
  const half = Math.ceil(wedding.compliments.length / 2);
  const firstHalf = wedding.compliments.slice(0, half);
  const secondHalf = wedding.compliments.slice(half);
  return (
    <footer className="relative overflow-hidden px-6 pt-[clamp(3.5rem,12cqw,5.5rem)] pb-[clamp(9rem,30cqw,13rem)] text-center sm:px-12" data-anim="closing">
      <p className="js-write write-on text-gold font-script text-[clamp(2.4rem,9.5cqw,3.6rem)] leading-[1.15]">
        With best compliments
      </p>
      <p className="js-compliments mx-auto mt-4 font-display text-[clamp(.74rem,3cqw,.95rem)] leading-loose tracking-[0.24em] text-ink uppercase">
        <span className="block sm:inline">{firstHalf.join(" · ")}</span>
        <span className="hidden sm:inline"> · </span>
        <span className="block sm:inline">{secondHalf.join(" · ")}</span>
      </p>
      <a
        href={`tel:${wedding.contact.phone}`}
        className="js-contact mt-6 inline-block font-display text-[clamp(.74rem,3cqw,.9rem)] tracking-[0.22em] text-ink-soft transition-colors hover:text-gold-700"
      >
        CONTACT : {wedding.contact.display}
      </a>
      <SmallHeart className="js-end-heart mx-auto mt-6 w-6" />
      <div className="js-save mt-8">
        <a className="btn-ghost" href="/invitation-card.jpg" download="Dilshad-Jahana-Sherin-Invitation.jpg">
          Save the invitation card
        </a>
      </div>

      <FloralCorner seed={31} className="absolute right-[-3%] bottom-[-3%] w-[50%] -scale-y-100 sm:w-[38%]" />
      <FloralCorner seed={43} className="absolute bottom-[-3%] left-[-3%] w-[44%] rotate-180 sm:w-[34%]" />
    </footer>
  );
}
