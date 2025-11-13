export default function handler(req, res) {
  const endDate = req.query.end
    ? new Date(req.query.end)
    : new Date("2025-11-27T23:59:00");

  const now = new Date();
  let diff = endDate - now;
  if (diff < 0) diff = 0;

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const output = `${String(days).padStart(2, '0')}d : ${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`;

  res.setHeader("Content-Type", "text/plain");
  res.send(output);
}
