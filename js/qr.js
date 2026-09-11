// ===== otdoner · QR код генераторы =====

function makeQr(text) {
  const qr = qrcode(0, "H"); // H — 30% қате түзету, ортадағы жалын белгісі сыяды
  qr.addData(text, "Byte");
  qr.make();
  return qr;
}

function qrSvg(qr) {
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  const s = n * 0.24;          // ортадағы белгі өлшемі
  const o = (n - s) / 2;
  return `<svg viewBox="0 0 ${n} ${n}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="QR">
    <path d="${d}" fill="#1a1411"/>
    <rect x="${o - 0.6}" y="${o - 0.6}" width="${s + 1.2}" height="${s + 1.2}" rx="${s * 0.22}" fill="#fff"/>
    <rect x="${o}" y="${o}" width="${s}" height="${s}" rx="${s * 0.2}" fill="#1a1411"/>
    <g transform="translate(${o + s * 0.18} ${o + s * 0.12}) scale(${(s * 0.64) / 40})" shape-rendering="geometricPrecision">
      <path d="${FLAME_PATH}" fill="#f2451e"/>
    </g>
  </svg>`;
}

function qrPng(qr, size = 1200) {
  const n = qr.getModuleCount();
  const quiet = 4;
  const cell = Math.floor(size / (n + quiet * 2));
  const dim = cell * (n + quiet * 2);
  const canvas = document.createElement("canvas");
  canvas.width = dim;
  canvas.height = dim;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, dim, dim);
  ctx.fillStyle = "#1a1411";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
    }
  }
  const s = n * 0.24 * cell;
  const o = (dim - s) / 2;
  const pad = 0.6 * cell;
  ctx.fillStyle = "#fff";
  roundRect(ctx, o - pad, o - pad, s + pad * 2, s + pad * 2, s * 0.22);
  ctx.fillStyle = "#1a1411";
  roundRect(ctx, o, o, s, s, s * 0.2);
  ctx.save();
  ctx.translate(o + s * 0.18, o + s * 0.12);
  ctx.scale((s * 0.64) / 40, (s * 0.64) / 40);
  ctx.fillStyle = "#f2451e";
  ctx.fill(new Path2D(FLAME_PATH));
  ctx.restore();
  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.OTDONER_CONFIG;
  const input = document.getElementById("qr-url");
  const box = document.getElementById("qr-box");
  const urlText = document.getElementById("qr-url-text");
  const fromQuery = new URLSearchParams(location.search).get("url");
  input.value = fromQuery || cfg.siteUrl || `${location.origin}/`;

  let current = null;
  const render = () => {
    const url = input.value.trim() || `${location.origin}/`;
    try {
      current = makeQr(url);
      box.innerHTML = qrSvg(current);
      urlText.textContent = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    } catch (e) {
      console.error(e);
    }
  };
  input.addEventListener("input", render);
  render();

  document.getElementById("qr-print").addEventListener("click", () => window.print());
  document.getElementById("qr-png").addEventListener("click", () => {
    if (!current) return;
    const a = document.createElement("a");
    a.download = "otdoner-qr.png";
    a.href = qrPng(current).toDataURL("image/png");
    a.click();
  });
});
