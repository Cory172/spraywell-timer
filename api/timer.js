function makeTicks(cx, cy, value, maxValue, segments = 60) {
  // value: current unit (days / hours / minutes / seconds)
  // maxValue: how many units is "full" (60 for sec/min, 24 for hours, etc.)
  // segments: how many slices around the circle (we'll use 60)
  let svg = "";
  const outerR = 80;   // was 60
  const innerR = 65;   // was 50

  // normalize value to segment count
  const activeSegments = Math.round(
    Math.max(0, Math.min(1, value / maxValue)) * segments
  );

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI - Math.PI / 2; // start at top
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);

    const color = i < activeSegments ? "#7cc516" : "#222222";

    svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(
      2
    )}" y2="${y2.toFixed(2)}" stroke="${color}" stroke-width="3" />`;
  }

  return svg;
}

export default function handler(req, res) {
  const endDate = req.query.end
    ? new Date(req.query.end)
    : new Date("2025-11-27T23:59:00");

  const now = new Date();
  let diff = endDate - now;
  if (diff < 0) diff = 0;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const d = String(days).padStart(2, "0");
  const h = String(hours).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(seconds).padStart(2, "0");

  // centers for the four circles
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

<!-- Glow definition MUST come first -->
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Black background -->
  <rect width="760" height="200" fill="#000000" />

  <!-- DAYS circle -->
  ${daysTicks}
  <circle cx="${cxDays}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxDays}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="Arial, sans-serif" font-size="42" font-weight="bold">
    ${d}
  </text>
  <text x="${cxDays}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="Arial, sans-serif" font-size="18" letter-spacing="1">
    DAYS
  </text>

  <!-- HOURS circle -->
  ${hoursTicks}
  <circle cx="${cxHours}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxHours}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="Arial, sans-serif" font-size="42" font-weight="bold">
    ${h}
  </text>
  <text x="${cxHours}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="Arial, sans-serif" font-size="18" letter-spacing="1">
    HOURS
  </text>

  <!-- MINUTES circle -->
  ${minutesTicks}
  <circle cx="${cxMinutes}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxMinutes}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="Arial, sans-serif" font-size="42" font-weight="bold">
    ${m}
  </text>
  <text x="${cxMinutes}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="Arial, sans-serif" font-size="18" letter-spacing="1">
    MINUTES
  </text>

  <!-- SECONDS circle -->
  ${secondsTicks}
  <circle cx="${cxSeconds}" cy="${cy}" r="60" fill="#000000" />
  <text x="${cxSeconds}" y="${cy - 5}" text-anchor="middle" fill="#ffffff"
    font-family="Arial, sans-serif" font-size="42" font-weight="bold">
    ${s}
  </text>
  <text x="${cxSeconds}" y="${cy + 18}" text-anchor="middle" fill="#cccccc"
    font-family="Arial, sans-serif" font-size="18" letter-spacing="1">
    SECONDS
  </text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}
