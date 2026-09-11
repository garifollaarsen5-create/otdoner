// ===== otdoner · логотип, иконкалар, ортақ бөліктер =====

const FLAME_PATH = "M20 44C10 44 3 37 4 28C5 21 10 18 11 11C15 16 16 21 15 26C18 20 19 11 17 0C26 8 31 17 29 27C32 24 33 20 33 15C38 21 39 30 36 36C33 41 27 44 20 44Z";

// Орамадағы донер-ролл: капсула, гриль сызықтары, ұшында ширатпа
function rollSvg(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s}) rotate(-7 24 7)">
    <rect x="1.5" y="1.5" width="45" height="12" rx="6" fill="#1a1411" stroke="currentColor" stroke-width="2.2"/>
    <path d="M11 4.5l-2 6M17 4.5l-2 6M23 4.5l-2 6M29 4.5l-2 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="39.5" cy="7.5" r="3.4" fill="none" stroke="currentColor" stroke-width="1.6"/>
  </g>`;
}

function logoSvg(variant = "compact") {
  if (variant === "full") {
    return `<svg viewBox="0 0 240 132" role="img" aria-label="ОТ ДОНЕР — кухня на углях" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 46h40M160 46h40" stroke="#f2451e" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M4 58l8-8h216l8 8v44l-8 8H12l-8-8z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>
      <g transform="translate(100 0) scale(1)"><path d="${FLAME_PATH}" fill="#f2451e"/></g>
      ${rollSvg(89, 40, 1.3)}
      <text x="120" y="88" text-anchor="middle" font-family="Unbounded, 'Arial Black', sans-serif" font-weight="900" font-size="29" letter-spacing="-0.6" fill="currentColor">ОТ ДОНЕР</text>
      <path d="M22 99h26M22 103h20M192 99h26M198 103h20" stroke="#f2451e" stroke-width="1.8" stroke-linecap="round"/>
      <text x="120" y="104" text-anchor="middle" font-family="Onest, Arial, sans-serif" font-weight="800" font-size="10" letter-spacing="1.4" fill="#f2451e">КУХНЯ НА УГЛЯХ</text>
      <text x="120" y="128" text-anchor="middle" font-family="Onest, Arial, sans-serif" font-weight="700" font-size="11" letter-spacing="0.4" fill="currentColor" opacity=".8">since 2020</text>
    </svg>`;
  }
  return `<svg viewBox="0 0 172 62" role="img" aria-label="ОТ ДОНЕР" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 30l7-7h154l7 7v23l-7 7H9l-7-7z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
    <g transform="translate(74 0) scale(.62)"><path d="${FLAME_PATH}" fill="#f2451e"/></g>
    ${rollSvg(67, 15, .8)}
    <text x="86" y="50" text-anchor="middle" font-family="Unbounded, 'Arial Black', sans-serif" font-weight="900" font-size="20" letter-spacing="-0.4" fill="currentColor">ОТ ДОНЕР</text>
  </svg>`;
}

const ICONS = {
  bag: '<path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  camera: '<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.4"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="m4 17 5-4.5 4 3.5 2.5-2 4.5 3.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="m9.5 21 2.2-6.2L14 17v4M8 11.5l2.3-3.3 3.4.6 2 3.2 2.3.8M11.7 14.8l.9-5.9"/>',
  scooter: '<circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8.5 17h6.5l2-7h-3M17 10l1-4h2M4 13h6l2 4"/>',
  wa: '<path d="M4 20l1.2-3.9A8 8 0 1 1 8 19z"/><path d="M9.2 8.6c-.3.9 0 2.3 1.4 3.9 1.5 1.6 3 2.2 3.9 1.9l.9-1.1-1.7-1.1-.9.7c-.7-.3-1.4-1-1.8-1.7l.7-.9-1-1.8z" fill="currentColor" stroke-width="1"/>',
  ig: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor"/>',
  map: '<path d="M9 5 3.5 7v12L9 17l6 2 5.5-2V5L15 7z"/><path d="M9 5v12M15 7v12"/>',
  trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
};

function icon(name, cls = "") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

// «Неге otdoner» блогының иконкалары (44px, қолмен сызылған стиль)
const WHY_ICONS = {
  clock: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M40 24a16 16 0 1 1-4.7-11.3"/><path d="M36 5v8h-8"/><path d="M24 15v9l6 4"/></svg>`,
  leaf: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="27" r="15"/><path d="M24 12c0-4 2-6 5-7M24 12c-3-3-7-3-9-2 2 3 6 4 9 2z"/><path d="M18 27a6 6 0 0 1 6-6M31 30a4 4 0 0 1-4 4"/></svg>`,
  scooter: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="35" r="5"/><circle cx="37" cy="35" r="5"/><path d="M16 35h13l5-15h-6M34 20l2-8h5M5 27h13l4 8"/><rect x="6" y="14" width="12" height="10" rx="1.5"/></svg>`,
  sauce: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M24 3v5M20 8h8l2 7H18z"/><path d="M17 15h14l2 6v19a4 4 0 0 1-4 4H19a4 4 0 0 1-4-4V21z"/><path d="M15 28c4-3 8 3 18 0"/></svg>`,
};

// Суреті жоқ тағамға арналған көмір ролл белгісі
function placeholderSvg() {
  return `<svg viewBox="0 0 96 70" aria-hidden="true"><g transform="translate(28 0)"><path d="${FLAME_PATH}" fill="currentColor"/></g>${rollSvg(22, 38, 1.1).replace('fill="#1a1411"', 'fill="#231b17"')}</svg>`;
}

function fillLogos(root = document) {
  root.querySelectorAll("[data-logo]").forEach((el) => { el.innerHTML = logoSvg(el.dataset.logo); });
  root.querySelectorAll("[data-icon]").forEach((el) => {
    el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon));
    el.removeAttribute("data-icon");
  });
  root.querySelectorAll("[data-why]").forEach((el) => { el.innerHTML = WHY_ICONS[el.dataset.why]; });
}

// Корзинадағы тағам санын header белгісіне шығару (барлық бетте)
const CART_KEY = "otdoner_cart_v1";

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch (e) {
    return {};
  }
}

function updateCartBadge(cart = readCart()) {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  document.querySelectorAll(".cart-icon__count").forEach((el) => {
    el.textContent = count;
    el.hidden = count === 0;
  });
  return count;
}

document.addEventListener("DOMContentLoaded", () => {
  fillLogos();
  updateCartBadge();
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
});
