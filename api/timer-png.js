import sharp from "sharp";

function makeTicks(cx, cy, value, maxValue, segments = 60) {
  let svg = "";
  const outerR = 80;
  const innerR = 65;

  const activeSegments = Math.round(
    Math.max(0, Math.min(1, value / maxValue)) * segments
  );

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);

    const color = i < activeSegments ? "#7cc516" : "#222222";

    svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(
      2
    )}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(
      2
    )}" stroke="${color}" stroke-width="3" />`;
  }

  return svg;
}

// Build the SVG string (same design as your timer.js)
function buildTimerSvg(endParam) {
  const endDate = endParam
    ? new Date(endParam)
    : new Date("2025-11-28T05:00:00Z"); // Midnight EST (UTC-5)

  const now = new Date();
  let diff = endDate - now;
  if (diff < 0) diff = 0; // freeze at 0

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const d = String(days).padStart(2, "0");
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  const cy = 100;
  const cxDays = 110;
  const cxHours = 290;
  const cxMinutes = 470;
  const cxSeconds = 650;

  const daysTicks = makeTicks(cxDays, cy, Math.min(days, 60), 60, 60);
  const hoursTicks = makeTicks(cxHours, cy, hours, 24, 60);
  const minutesTicks = makeTicks(cxMinutes, cy, minutes, 60, 60);
  const secondsTicks = makeTicks(cxSeconds, cy, seconds, 60, 60);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="760" height="200" viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="760" height="200" fill="#000000" />

  ${daysTicks}
  <circle cx="${cxDays}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxDays}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="sans-serif" font-size="42" font-weight="bold">
    ${d}
  </text>
  <text x="${cxDays}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="sans-serif" font-size="18" letter-spacing="1">
    DAYS
  </text>

  ${hoursTicks}
  <circle cx="${cxHours}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxHours}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="sans-serif" font-size="42" font-weight="bold">
    ${h}
  </text>
  <text x="${cxHours}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="sans-serif" font-size="18" letter-spacing="1">
    HOURS
  </text>

  ${minutesTicks}
  <circle cx="${cxMinutes}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxMinutes}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="sans-serif" font-size="42" font-weight="bold">
    ${m}
  </text>
  <text x="${cxMinutes}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="sans-serif" font-size="18" letter-spacing="1">
    MINUTES
  </text>

  ${secondsTicks}
  <circle cx="${cxSeconds}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxSeconds}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="sans-serif" font-size="42" font-weight="bold">
    ${s}
  </text>
  <text x="${cxSeconds}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="sans-serif" font-size="18" letter-spacing="1">
    SECONDS
  </text>
</svg>`;

  return svg;
}

export default async function handler(req, res) {
  try {
    const svg = buildTimerSvg(req.query.end);

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=60");
    res.send(pngBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Timer PNG generation error");
  }
}
