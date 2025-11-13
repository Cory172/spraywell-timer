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

  const text = `${d} : ${h} : ${m} : ${s}`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="160" viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="160" fill="#05060a" />
  <text x="300" y="70" text-anchor="middle" fill="#30e18b" font-family="Arial, sans-serif" font-size="40" font-weight="bold">
    ${text}
  </text>
  <text x="300" y="110" text-anchor="middle" fill="#9fa6b2" font-family="Arial, sans-serif" font-size="14">
    DAYS   HOURS   MIN   SEC
  </text>
</svg>`;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}
