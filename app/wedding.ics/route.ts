import {
  calendarDetails,
  calendarEndUtc,
  calendarLocation,
  calendarStartUtc,
  calendarTitle,
  wedding,
} from "@/lib/wedding";

/** iCalendar escaping for TEXT values. */
const esc = (value: string) => value.replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");

export function GET() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${`${calendarStartUtc}-${wedding.groom.name}-${wedding.bride.name}`.replace(/\s+/g, "-").toLowerCase()}`,
    `DTSTAMP:${calendarStartUtc}`,
    `DTSTART:${calendarStartUtc}`,
    `DTEND:${calendarEndUtc}`,
    `SUMMARY:${esc(calendarTitle)}`,
    `LOCATION:${esc(calendarLocation)}`,
    `DESCRIPTION:${esc(calendarDetails)}`,
    `URL:${wedding.venue.mapsUrl}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`${calendarTitle} is tomorrow`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="wedding-invitation.ics"',
    },
  });
}
