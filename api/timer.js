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

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="700" height="180" viewBox="0 0 700 180" xmlns="http://www.w3.org/2000/svg">
  <rect width="700" height="180" fill="#ffffff" />

  <!-- Group 1: DAYS -->
  <g transform="translate(100,90)">
    <circle r="60" fill="#ffffff" stroke="#d4a037" stroke-width="10" />
    <text x="0" y="-5" text-anchor="middle" fill="#111111" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
      ${d}
    </text>
    <text x="0" y="20" text-anchor="middle" fill="#555555" font-family="Arial, sans-serif" font-size="12" letter-spacing="1">
      DAYS
    </text>
  </g>

  <!-- Group 2: HOURS -->
  <g transform="translate(260,90)">
    <circle r="60" fill="#ffffff" stroke="#d4a037" stroke-width="10" />
    <text x="0" y="-5" text-anchor="middle" fill="#111111" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
      ${h}
    </text>
    <text x="0" y="20" text-anchor="middle" fill="#555555" font-family="Arial, sans-serif" font-size="12" letter-spacing="1">
      HOURS
    </text>
  </g>

  <!-- Group 3: MINUTES -->
  <g transform="translate(420,90)">
    <circle r="60" fill="#ffffff" stroke="#d4a037" stroke-width="10" />
    <text x="0" y="-5" text-anchor="middle" fill="#111111" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
      ${m}
    </text>
    <text x="0" y="20" text-anchor="middle" fill="#555555" font-family="Arial, sans-serif" font-size="12" letter-spacing="1">
      MINUTES
    </text>
  </g>

  <!-- Group 4: SECONDS -->
  <g transform="translate(580,90)">
    <circle r="60" fill="#ffffff" stroke="#d4a037" stroke-width="10" />
    <text x="0" y="-5" text-anchor="middle" fill="#111111" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
      ${s}
    </text>
    <text x="0" y="20" text-anchor="middle" fill="#555555" font-family="Arial, sans-serif" font-size="12" letter-spacing="1">
      SECONDS
    </text>
  </g>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}
