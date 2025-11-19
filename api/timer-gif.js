import GIFEncoder from "gifencoder";
import { createCanvas } from "canvas";

// Draw the tick "slices" around a circle
function drawTicks(ctx, cx, cy, value, maxValue, segments = 60) {
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

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = i < activeSegments ? "#7cc516" : "#222222";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

// Draw one frame of the timer onto the canvas
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

  // Clear + background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, width, height);

  // Positions
  const cy = 100;
  const cxDays = 110;
  const cxHours = 290;
  const cxMinutes = 470;
  const cxSeconds = 650;

  // DAYS
  drawTicks(ctx, cxDays, cy, Math.min(days, 60), 60, 60);
  ctx.beginPath();
  ctx.arc(cxDays, cy, 60, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px sans-serif";
  ctx.fillText(d, cxDays, cy - 5);

  ctx.fillStyle = "#cccccc";
  ctx.font = "18px sans-serif";
  ctx.fillText("DAYS", cxDays, cy + 22);

  // HOURS
  drawTicks(ctx, cxHours, cy, hours, 24, 60);
  ctx.beginPath();
  ctx.arc(cxHours, cy, 60, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px sans-serif";
  ctx.fillText(h, cxHours, cy - 5);

  ctx.fillStyle = "#cccccc";
  ctx.font = "18px sans-serif";
  ctx.fillText("HOURS", cxHours, cy + 22);

  // MINUTES
  drawTicks(ctx, cxMinutes, cy, minutes, 60, 60);
  ctx.beginPath();
  ctx.arc(cxMinutes, cy, 60, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px sans-serif";
  ctx.fillText(m, cxMinutes, cy - 5);

  ctx.fillStyle = "#cccccc";
  ctx.font = "18px sans-serif";
  ctx.fillText("MINUTES", cxMinutes, cy + 22);

  // SECONDS
  drawTicks(ctx, cxSeconds, cy, seconds, 60, 60);
  ctx.beginPath();
  ctx.arc(cxSeconds, cy, 60, 0, 2 * Math.PI);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px sans-serif";
  ctx.fillText(s, cxSeconds, cy - 5);

  ctx.fillStyle = "#cccccc";
  ctx.font = "18px sans-serif";
  ctx.fillText("SECONDS", cxSeconds, cy + 22);
}

export default async function handler(req, res) {
  try {
    // End time: Black Friday launch at midnight EST -> 05:00:00Z
    const endParam = req.query.end;
    const endDate = endParam
      ? new Date(endParam)
      : new Date("2025-11-28T05:00:00Z");

    const width = 760;
    const height = 200;

    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Cache-Control", "no-store, max-age=0");

    encoder.createReadStream().pipe(res);

    encoder.start();
    encoder.setRepeat(0); // loop forever
    encoder.setDelay(1000); // 1000 ms per frame
    encoder.setQuality(10); // 1 is best, 20 is worst

    const nowBase = Date.now();

    // 60 frames = ~60 seconds of ticking
    const frames = 60;

    for (let i = 0; i < frames; i++) {
      const now = new Date(nowBase + i * 1000);
      drawFrame(ctx, now, endDate);
      encoder.addFrame(ctx);
    }

    encoder.finish();
  } catch (err) {
    console.error(err);
    res.status(500).send("Timer GIF generation error");
  }
}
