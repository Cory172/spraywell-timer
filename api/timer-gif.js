import GIFEncoder from "gifencoder";
import { Canvas } from "skia-canvas";

export const config = {
  runtime: "nodejs18.x"
};

// Draw circular ticks
function drawTicks(ctx, cx, cy, value, maxValue, segments = 60) {
  const outerR = 80;
  const innerR = 65;

  const active = Math.round(
    Math.max(0, Math.min(1, value / maxValue)) * segments
  );

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + innerR * Math.cos(angle);
    const y1 = cy + innerR * Math.sin(angle);
    const x2 = cx + outerR * Math.cos(angle);
    const y2 = cy + outerR * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = i < active ? "#7cc516" : "#222222";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawFrame(ctx, now, endDate) {
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

  const width = 760;
  const height = 200;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  const cy = 100;
  const cxDays = 110;
  const cxHours = 290;
  const cxMinutes = 470;
  const cxSeconds = 650;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  function drawCircle(label, val, x, max) {
    drawTicks(ctx, x, cy, val, max);

    ctx.beginPath();
    ctx.arc(x, cy, 60, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 42px sans-serif";
    ctx.fillText(val, x, cy - 5);

    ctx.fillStyle = "#ccc";
    ctx.font = "18px sans-serif";
    ctx.fillText(label, x, cy + 22);
  }

  drawCircle("DAYS", d, cxDays, 60);
  drawCircle("HOURS", h, cxHours, 24);
  drawCircle("MINUTES", m, cxMinutes, 60);
  drawCircle("SECONDS", s, cxSeconds, 60);
}

export default async function handler(req, res) {
  try {
    const end = req.query.end
      ? new Date(req.query.end)
      : new Date("2025-11-28T05:00:00Z");

    const width = 760;
    const height = 200;

    const encoder = new GIFEncoder(width, height);
    const stream = encoder.createReadStream();

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-store");
    stream.pipe(res);

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1000);
    encoder.setQuality(10);

    const canvas = new Canvas(width, height);
    const ctx = canvas.getContext("2d");

    const base = Date.now();

    for (let i = 0; i < 60; i++) {
      const now = new Date(base + i * 1000);
      drawFrame(ctx, now, end);
      encoder.addFrame(ctx);
    }

    encoder.finish();
  } catch (err) {
    console.error(err);
    res.status(500).send("GIF generation error");
  }
}
