/**
 * Every detail shown on the invitation lives here.
 * Edit this file to change names, timings, venue or contact details.
 */
export const wedding = {
  groom: {
    name: "Dilshad",
    parents: "Mr. Mohammad & Mrs. Zeenath",
  },
  bride: {
    name: "Jahana Sherin",
    parents: "Mr. Saidalavi & Mrs. Sakeena",
  },

  bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  verse: {
    text: "Our Lord, grant us from among our wives and offspring comfort to our eyes and make us an example for the righteous.",
    reference: "Qur’an 25:74",
  },
  request:
    "request the honour of your presence, with family, at the marriage of our beloved son",
  tagline: "Where two hearts become one",
  blessing: "Your prayers and presence will make our joy complete.",

  event: {
    /** Indian Standard Time (UTC+05:30). */
    start: "2026-12-05T16:00:00+05:30",
    end: "2026-12-05T21:00:00+05:30",
    weekday: "Saturday",
    day: "05",
    month: "December",
    year: "2026",
    numeric: "05 · 12 · 2026",
    time: "4:00 PM – 9:00 PM",
  },

  venue: {
    name: "Oruma Avenue",
    area: "Kadungallur",
    /** Opened by the QR code and the “Get directions” button. */
    mapsUrl: "https://maps.app.goo.gl/BgGqJ2u2fZ1NFj8Z8?g_st=aw",
    /** Search used for the embedded map preview. */
    embedQuery: "Oruma Avenue, Kadungallur",
  },

  compliments: ["Rinshida", "Rinshad", "Surumi", "Jouhar"],

  contact: {
    display: "81292 85246",
    phone: "+918129285246",
    /** Country code + number, digits only, for wa.me links. */
    whatsapp: "918129285246",
  },
} as const;

export const coupleLine = `${wedding.groom.name} & ${wedding.bride.name}`;

/** 2026-12-05T16:00:00+05:30 → 20261205T103000Z (calendar format). */
function toCalendarUtc(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export const calendarStartUtc = toCalendarUtc(wedding.event.start);
export const calendarEndUtc = toCalendarUtc(wedding.event.end);

export const calendarTitle = `Wedding of ${coupleLine}`;
export const calendarLocation = `${wedding.venue.name}, ${wedding.venue.area}`;
export const calendarDetails = `${wedding.groom.parents} request the honour of your presence, with family, at the marriage of ${wedding.groom.name} with ${wedding.bride.name}. Location: ${wedding.venue.mapsUrl}`;

export const googleCalendarUrl =
  "https://calendar.google.com/calendar/render?" +
  new URLSearchParams({
    action: "TEMPLATE",
    text: calendarTitle,
    dates: `${calendarStartUtc}/${calendarEndUtc}`,
    location: calendarLocation,
    details: calendarDetails,
  }).toString();

export const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
  wedding.venue.embedQuery,
)}&z=15&output=embed`;
