import QRCode from "qrcode";

/**
 * Scannable QR code rendered as crisp SVG at build time.
 * Dark square modules on white with a 4-module quiet zone keep it
 * readable by every phone camera.
 */
export function QrCode({ value, className = "" }: { value: string; className?: string }) {
  const qr = QRCode.create(value, { errorCorrectionLevel: "Q" });
  const size = qr.modules.size;
  const quiet = 4;

  // Merge horizontal runs of dark modules into single rects to keep the path small.
  let d = "";
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (qr.modules.get(y, x)) {
        const start = x;
        while (x < size && qr.modules.get(y, x)) x++;
        d += `M${start} ${y}h${x - start}v1h-${x - start}z`;
      } else {
        x++;
      }
    }
  }

  const box = size + quiet * 2;
  return (
    <svg
      viewBox={`${-quiet} ${-quiet} ${box} ${box}`}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code with the venue location"
    >
      <rect x={-quiet} y={-quiet} width={box} height={box} fill="#ffffff" />
      <path d={d} fill="#26221d" />
    </svg>
  );
}
