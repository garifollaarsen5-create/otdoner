// ===== otdoner · мәзір, корзина, тапсырыс =====

const CFG = window.OTDONER_CONFIG;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  cat: CATEGORIES[0].id,
  variant: {},            // chicken → "9" сияқты таңдалған мөлшер
  flavor: {},             // fuse → "peach" сияқты таңдалған дәм
  cart: readCart(),       // { "doner-beef": 2, "chicken:9": 1, "fuse:1:peach": 1 }
  view: "cart",           // cart | form | done
  order: { type: "pickup", bank: "kaspi" },
  lastWaUrl: "",
};

// ---------- Корзина деректері ----------
// Кілт: "id", "id:мөлшер" немесе "id:мөлшер:дәм"
function findItem(key) {
  const [id, variantId, flavorId] = key.split(":");
  const item = MENU.find((m) => m.id === id);
  if (!item) return null;
  const v = item.variants ? item.variants.find((x) => x.id === variantId) : null;
  const f = item.flavors ? item.flavors.find((x) => x.id === flavorId) : null;
  if ((item.variants && !v) || (item.flavors && !f)) return null;
  const name = [tr(item.name), f && tr(f), v && tr(v)].filter(Boolean).join(" ");
  return { item, key, price: v ? v.price : item.price, name, img: (f && f.img) || item.img };
}

function cartLines() {
  return Object.entries(state.cart)
    .map(([key, qty]) => ({ ...findItem(key), qty }))
    .filter((l) => l.item && l.qty > 0);
}

function cartTotal() {
  return cartLines().reduce((sum, l) => sum + l.price * l.qty, 0);
}

function saveCart() {
  // мәзірден өшірілген тағамдарды тазалаймыз
  for (const key of Object.keys(state.cart)) {
    if (!findItem(key) || state.cart[key] <= 0) delete state.cart[key];
  }
  try { localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); } catch (e) {}
  renderFab();
  updateCartBadge(state.cart);
}

function setQty(key, qty) {
  if (qty <= 0) delete state.cart[key];
  else state.cart[key] = Math.min(qty, 99);
  saveCart();
  renderMenu();
  if ($("#sheet").classList.contains("is-open")) renderSheet();
}

function keyFor(item, over = {}) {
  const parts = [item.id];
  if (item.variants) parts.push(over.v || state.variant[item.id] || item.variants[0].id);
  if (item.flavors) {
    if (!item.variants) parts.push("");
    parts.push(over.f || state.flavor[item.id] || item.flavors[0].id);
  }
  return parts.join(":");
}

// ---------- Мәзір ----------
function renderTabs() {
  const tabs = $("#tabs");
  tabs.innerHTML = CATEGORIES.map((c) => `
    <button class="tab" role="tab" id="tab-${c.id}" aria-controls="menu-grid"
      aria-selected="${c.id === state.cat}" tabindex="${c.id === state.cat ? 0 : -1}" data-cat="${c.id}">${escapeHtml(tr(c))}</button>
  `).join("");
}

function stepperHtml(key, qty, sm = false) {
  return `<div class="stepper${sm ? " stepper--sm" : ""}">
    <button type="button" data-dec="${key}" aria-label="${t("menu.less")}">${icon("minus")}</button>
    <output aria-live="polite">${qty}</output>
    <button type="button" data-inc="${key}" aria-label="${t("menu.more")}">${icon("plus")}</button>
  </div>`;
}

function mediaHtml(item, img = item.img, label = tr(item.name)) {
  if (!img) {
    return `<div class="card__media card__media--empty">${placeholderSvg()}</div>`;
  }
  const alt = escapeHtml(label);
  return `<div class="card__media${item.photo ? " card__media--photo" : ""}">
    <img src="img/menu/${img}.webp"
      srcset="img/menu/${img}-s.webp 520w, img/menu/${img}.webp ${item.photo ? 720 : 960}w"
      sizes="(min-width: 960px) 380px, (min-width: 560px) 48vw, 92vw"
      width="960" height="720" alt="${alt}" loading="lazy" decoding="async">
  </div>`;
}

function renderMenu() {
  const grid = $("#menu-grid");
  const items = MENU.filter((m) => m.cat === state.cat);
  grid.setAttribute("aria-labelledby", `tab-${state.cat}`);
  grid.classList.toggle("grid--solo", items.length === 1);
  grid.innerHTML = items.map((item) => {
    const key = keyFor(item);
    const qty = state.cart[key] || 0;
    const sel = findItem(key);
    const flavors = item.flavors ? `
      <div class="flavors" role="group" aria-label="${t("menu.flavor")}">
        ${item.flavors.map((f) => `
          <button type="button" class="flavors__btn" data-flavor="${item.id}:${f.id}"
            aria-pressed="${key === keyFor(item, { f: f.id })}">${escapeHtml(tr(f))}</button>
        `).join("")}
      </div>` : "";
    const sizes = item.variants ? `
      <div class="sizes" role="group" aria-label="${t("menu.size")}" style="grid-template-columns:repeat(${item.variants.length},1fr)">
        ${item.variants.map((v) => `
          <button type="button" class="sizes__btn" data-variant="${item.id}:${v.id}"
            aria-pressed="${key === keyFor(item, { v: v.id })}">${escapeHtml(tr(v))}<small>${formatPrice(v.price)}</small></button>
        `).join("")}
      </div>` : "";
    const action = qty > 0
      ? stepperHtml(key, qty)
      : `<button type="button" class="add" data-add="${key}" aria-label="${t("menu.addAria")}: ${escapeHtml(sel.name)}">${icon("plus")}<span>${t("menu.add")}</span></button>`;
    return `<article class="card" data-item="${item.id}">
      ${mediaHtml(item, sel.img, sel.name)}
      <div class="card__body">
        <h3 class="card__name">${escapeHtml(tr(item.name))}</h3>
        ${item.desc ? `<p class="card__desc">${escapeHtml(tr(item.desc))}</p>` : ""}
        ${flavors}
        ${sizes}
        <div class="card__foot">
          <span class="card__price">${formatPrice(sel.price)}</span>
          ${action}
        </div>
      </div>
    </article>`;
  }).join("");
}

function selectCat(id, focus = false) {
  state.cat = id;
  renderTabs();
  renderMenu();
  const tabs = $("#tabs");
  const tab = $(`#tab-${id}`);
  if (!tab) return;
  // табты көлденең ортаға әкелеміз (sticky ішінде scrollIntoView бетті секіртеді)
  const shift = tab.getBoundingClientRect().left - tabs.getBoundingClientRect().left;
  tabs.scrollTo({ left: tabs.scrollLeft + shift - (tabs.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  if (focus) tab.focus({ preventScroll: true });
  // мәзірдің ортасында тұрса — жаңа категорияның басына көтерілеміз
  const bar = $(".tabs-bar").getBoundingClientRect();
  const gridTop = $("#menu-grid").getBoundingClientRect().top;
  if (gridTop < bar.bottom) {
    window.scrollTo({ top: window.scrollY + gridTop - bar.bottom - 12, behavior: "smooth" });
  }
}

function bindMenu() {
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (b) selectCat(b.dataset.cat);
  });
  $("#tabs").addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = CATEGORIES.findIndex((c) => c.id === state.cat);
    const next = CATEGORIES[(i + (e.key === "ArrowRight" ? 1 : -1) + CATEGORIES.length) % CATEGORIES.length];
    selectCat(next.id, true);
  });

  $("#menu-grid").addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const variant = e.target.closest("[data-variant]");
    const flavor = e.target.closest("[data-flavor]");
    if (variant || flavor) {
      const [id, val] = (variant ? variant.dataset.variant : flavor.dataset.flavor).split(":");
      (variant ? state.variant : state.flavor)[id] = val;
      renderMenu();
      const again = $(`[data-${variant ? "variant" : "flavor"}="${id}:${val}"]`);
      if (again && e.detail === 0) again.focus();
      return;
    }
    const key = (add || inc || dec)?.dataset[add ? "add" : inc ? "inc" : "dec"];
    if (!key) return;
    setQty(key, (state.cart[key] || 0) + (dec ? -1 : 1));
    if (add || inc) bumpFab();
    // фокусты қайта жасалған батырмаға қайтарамыз
    const card = $(`[data-item="${key.split(":")[0]}"]`);
    const again = card && $(dec && !state.cart[key] ? "[data-add]" : "[data-inc]", card);
    if (again && e.detail === 0) again.focus();
  });
}

// ---------- Қалқымалы батырма ----------
function renderFab() {
  const lines = cartLines();
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const fab = $("#fab");
  fab.hidden = count === 0;
  document.body.classList.toggle("has-fab", count > 0);
  $("#fab-count").textContent = count;
  $("#fab-total").textContent = formatPrice(cartTotal());
}

function bumpFab() {
  const fab = $("#fab-count");
  fab.classList.remove("pop");
  void fab.offsetWidth;
  fab.classList.add("pop");
}

// ---------- Шторка ----------
let lastFocus = null;

function openSheet(view = "cart") {
  lastFocus = document.activeElement;
  state.view = view;
  $("#sheet").classList.add("is-open");
  document.body.style.overflow = "hidden";
  renderSheet();
  setTimeout(() => $("#sheet .sheet__panel").focus(), 30);
}

function closeSheet() {
  $("#sheet").classList.remove("is-open");
  document.body.style.overflow = "";
  if (state.view === "done") state.view = "cart";
  if (lastFocus) lastFocus.focus();
}

function renderSheet() {
  const lines = cartLines();
  const head = $("#sheet-head");
  const body = $("#sheet-body");
  const foot = $("#sheet-foot");
  const count = lines.reduce((a, l) => a + l.qty, 0);

  if (state.view === "form" && !lines.length) state.view = "cart";

  const backBtn = state.view === "form"
    ? `<button type="button" class="icon-btn" data-go="cart" aria-label="${t("cart.back")}">${icon("back")}</button>` : "";
  const title = state.view === "form" ? t("order.title") : t("cart.title");
  head.innerHTML = `<span class="sheet__grab"></span>${backBtn}
    <h2 class="sheet__title" id="sheet-title">${title}${count && state.view !== "done" ? `<small>${count} ${t("cart.items")}</small>` : ""}</h2>
    <button type="button" class="icon-btn" data-close aria-label="${t("cart.close")}">${icon("close")}</button>`;

  if (state.view === "done") {
    body.innerHTML = `<div class="done">
      <div class="done__icon">${icon("check")}</div>
      <h3>${t("order.done.t")}</h3>
      <p>${t("order.done.d")}</p>
      <a class="btn btn--wa btn--block" href="${escapeHtml(state.lastWaUrl)}" target="_blank" rel="noopener">${icon("wa")}<span>${t("order.done.again")}</span></a>
      <button type="button" class="btn btn--ghost btn--block" data-clear-done>${t("order.done.new")}</button>
    </div>`;
    foot.hidden = true;
    return;
  }

  if (!lines.length) {
    body.innerHTML = `<div class="empty">${placeholderSvg()}<p>${t("cart.empty")}</p>
      <button type="button" class="btn btn--fire" data-to-menu>${t("cart.toMenu")}</button></div>`;
    foot.hidden = true;
    return;
  }

  foot.hidden = false;
  const total = `<div class="total"><span>${t("cart.total")}</span><strong>${formatPrice(cartTotal())}</strong></div>`;

  if (state.view === "cart") {
    body.innerHTML = lines.map((l) => `
      <div class="line">
        <div class="line__img">${l.img ? `<img src="img/menu/${l.img}-s.webp" alt="" loading="lazy">` : ""}</div>
        <div>
          <p class="line__name">${escapeHtml(l.name)}</p>
          <div class="line__unit">${formatPrice(l.price)}</div>
          <div class="line__row">
            ${stepperHtml(l.key, l.qty, true)}
            <span class="line__sum">${formatPrice(l.price * l.qty)}</span>
          </div>
          <button type="button" class="line__del" data-del="${l.key}">${t("cart.remove")}</button>
        </div>
      </div>`).join("");
    foot.innerHTML = `${total}<button type="button" class="btn btn--fire btn--block" data-go="form">${t("cart.checkout")}</button>`;
    return;
  }

  // ---- Тапсырыс формасы ----
  const o = state.order;
  const branchOpts = BRANCHES.map((b) =>
    `<option value="${b.id}" ${o.branch === b.id ? "selected" : ""}>${escapeHtml(tr(b.name))} — ${escapeHtml(tr(b.addr))}</option>`).join("");
  body.innerHTML = `<form class="form" id="order-form" novalidate>
    <div class="field">
      <span class="field__label" id="lbl-type">${t("order.type")}</span>
      <div class="seg" role="group" aria-labelledby="lbl-type">
        <button type="button" class="seg__btn" data-type="pickup" aria-pressed="${o.type === "pickup"}">${icon("walk")}<span>${t("order.pickup")}</span></button>
        <button type="button" class="seg__btn" data-type="delivery" aria-pressed="${o.type === "delivery"}">${icon("scooter")}<span>${t("order.delivery")}</span></button>
      </div>
    </div>
    ${o.type === "pickup" ? `
    <div class="field" data-field="branch">
      <label class="field__label" for="f-branch">${t("order.branch")}</label>
      <select class="input" id="f-branch" name="branch" required>
        <option value="" ${o.branch ? "" : "selected"} disabled>${t("order.branchPh")}</option>${branchOpts}
      </select>
      <span class="field__err">${t("order.err.branch")}</span>
    </div>` : `
    <div class="field" data-field="address">
      <label class="field__label" for="f-address">${t("order.address")}</label>
      <input class="input" id="f-address" name="address" autocomplete="street-address" placeholder="${t("order.addressPh")}" value="${escapeHtml(o.address || "")}" required>
      <span class="field__err">${t("order.err.address")}</span>
    </div>`}
    <div class="field" data-field="name">
      <label class="field__label" for="f-name">${t("order.name")}</label>
      <input class="input" id="f-name" name="name" autocomplete="given-name" placeholder="${t("order.namePh")}" value="${escapeHtml(o.name || "")}" maxlength="60" required>
      <span class="field__err">${t("order.err.name")}</span>
    </div>
    <div class="field" data-field="phone">
      <label class="field__label" for="f-phone">${t("order.phone")}</label>
      <span class="field__hint">${t("order.phoneHint")}</span>
      <input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 7__ ___ __ __" value="${escapeHtml(o.phone || "")}" required>
      <span class="field__err">${t("order.err.phone")}</span>
    </div>
    <div class="field">
      <span class="field__label" id="lbl-bank">${t("order.bank")}</span>
      <div class="seg bank" role="group" aria-labelledby="lbl-bank">
        <button type="button" class="seg__btn" data-bank="kaspi" aria-pressed="${o.bank === "kaspi"}"><span class="bank__dot"></span>Kaspi</button>
        <button type="button" class="seg__btn" data-bank="halyk" aria-pressed="${o.bank === "halyk"}"><span class="bank__dot"></span>Halyk</button>
      </div>
    </div>
    <div class="row2">
      <div class="field" data-field="date">
        <label class="field__label" for="f-date">${t("order.date")}</label>
        <input class="input" id="f-date" name="date" type="date" min="${todayIso()}" value="${o.date || todayIso()}" required>
        <span class="field__err">${t("order.err.date")}</span>
      </div>
      <div class="field" data-field="time">
        <label class="field__label" for="f-time">${t("order.time")}</label>
        <input class="input" id="f-time" name="time" type="time" value="${o.time || soonTime()}" required>
        <span class="field__err">${t("order.err.time")}</span>
      </div>
    </div>
    <div class="field">
      <label class="field__label" for="f-comment">${t("order.comment")} <small>(${t("order.optional")})</small></label>
      <textarea class="input" id="f-comment" name="comment" rows="3" maxlength="500" placeholder="${t("order.commentPh")}">${escapeHtml(o.comment || "")}</textarea>
    </div>
  </form>`;
  foot.innerHTML = `${total}
    <button type="submit" form="order-form" class="btn btn--wa btn--block">${icon("wa")}<span>${t("order.send")}</span></button>
    <p class="note">${t("order.note")}</p>`;
}

// ---------- Уақыт көмекшілері (Ақтау, UTC+5) ----------
function aktauNow() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Aqtau", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  return { date: `${get("year")}-${get("month")}-${get("day")}`, h: +get("hour") % 24, m: +get("minute") };
}

function todayIso() { return aktauNow().date; }

function soonTime() {
  const { h, m } = aktauNow();
  let total = h * 60 + m + 40;
  total = Math.ceil(total / 5) * 5 % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

// ---------- Телефон ----------
// "+7 8701…", "8701…", "+7701…", "7701…" — бәрі 7XXXXXXXXXX болады
function phoneDigits(v) {
  const raw = String(v || "").trim();
  let rest;
  if (raw.startsWith("+7")) {
    rest = raw.slice(2).replace(/\D/g, "");
  } else {
    const d = raw.replace(/\D/g, "");
    rest = d.length !== 10 && (d[0] === "8" || d[0] === "7") ? d.slice(1) : d;
  }
  if (rest.startsWith("8")) rest = rest.slice(1);                 // +7 кейін жазылған 8
  if (rest.length > 10 && rest.startsWith("7")) rest = rest.slice(1); // +7 кейін қайта жазылған 7
  if (!raw) return "";
  return "7" + rest.slice(0, 10);
}

function formatPhone(v) {
  const d = phoneDigits(v);
  if (!d) return "";
  const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
  let out = p[0] ? "+7" : "+7 ";
  if (p[0]) out += " " + p[0];
  if (p[1]) out += " " + p[1];
  if (p[2]) out += " " + p[2];
  if (p[3]) out += " " + p[3];
  return out;
}

// ---------- Форманы оқу / тексеру ----------
function readForm() {
  const f = $("#order-form");
  if (!f) return;
  const o = state.order;
  const val = (n) => (f.elements[n] ? f.elements[n].value.trim() : undefined);
  if (o.type === "pickup") o.branch = val("branch") || o.branch;
  else o.address = val("address");
  o.name = val("name");
  o.phone = val("phone");
  o.date = val("date");
  o.time = val("time");
  o.comment = val("comment");
}

function validate() {
  const o = state.order;
  const errors = {
    branch: o.type === "pickup" && !o.branch,
    address: o.type === "delivery" && (!o.address || o.address.length < 3),
    name: !o.name || o.name.length < 2,
    phone: phoneDigits(o.phone || "").length !== 11,
    date: !o.date,
    time: !o.time,
  };
  let first = null;
  for (const [name, bad] of Object.entries(errors)) {
    const field = $(`[data-field="${name}"]`);
    if (!field) continue;
    field.classList.toggle("is-invalid", bad);
    const input = $(".input", field);
    if (input) input.setAttribute("aria-invalid", String(bad));
    if (bad && !first) first = input;
  }
  if (first) {
    first.focus();
    first.scrollIntoView({ block: "center", behavior: "smooth" });
    return false;
  }
  return true;
}

function buildMessage() {
  const o = state.order;
  const lines = cartLines();
  const out = [];
  out.push(`*${t("wa.head")}*`, "");
  out.push(`*${t("wa.items")}:*`);
  lines.forEach((l, i) => {
    out.push(`${i + 1}. ${l.name} — ${l.qty} ${t("wa.pcs")} × ${formatPrice(l.price)} = ${formatPrice(l.price * l.qty)}`);
  });
  out.push("", `*${t("wa.total")}: ${formatPrice(cartTotal())}*`, "");
  out.push(`*${t("wa.client")}:*`);
  out.push(`${t("wa.type")}: ${o.type === "pickup" ? t("order.pickup") : t("order.delivery")}`);
  if (o.type === "pickup") {
    const b = BRANCHES.find((x) => x.id === o.branch);
    if (b) out.push(`${t("wa.branch")}: ${tr(b.name)}, ${tr(b.addr)}`);
  } else {
    out.push(`${t("wa.address")}: ${o.address}`);
  }
  out.push(`${t("wa.name")}: ${o.name}`);
  out.push(`${t("wa.phone")}: ${formatPhone(o.phone)}`);
  out.push(`${t("wa.bank")}: ${o.bank === "kaspi" ? "Kaspi" : "Halyk"}`);
  out.push(`${t("wa.date")}: ${formatDate(o.date)}`);
  out.push(`${t("wa.time")}: ${o.time}`);
  if (o.comment) out.push(`${t("wa.comment")}: ${o.comment}`);
  return out.join("\n");
}

function bindSheet() {
  const sheet = $("#sheet");

  sheet.addEventListener("click", (e) => {
    const el = e.target;
    if (el.closest("[data-close]") || el.classList.contains("sheet__overlay")) return closeSheet();
    const go = el.closest("[data-go]");
    if (go) {
      readForm();
      state.view = go.dataset.go;
      renderSheet();
      $("#sheet-body").scrollTop = 0;
      return;
    }
    if (el.closest("[data-to-menu]")) {
      closeSheet();
      $("#menu").scrollIntoView({ behavior: "smooth" });
      return;
    }
    const inc = el.closest("[data-inc]");
    const dec = el.closest("[data-dec]");
    const del = el.closest("[data-del]");
    if (inc || dec || del) {
      const key = (inc || dec || del).dataset[inc ? "inc" : dec ? "dec" : "del"];
      setQty(key, del ? 0 : (state.cart[key] || 0) + (dec ? -1 : 1));
      return;
    }
    const type = el.closest("[data-type]");
    if (type) {
      readForm();
      state.order.type = type.dataset.type;
      renderSheet();
      const first = $(state.order.type === "pickup" ? "#f-branch" : "#f-address");
      if (first) first.focus();
      return;
    }
    const bank = el.closest("[data-bank]");
    if (bank) {
      state.order.bank = bank.dataset.bank;
      $$("[data-bank]").forEach((b) => b.setAttribute("aria-pressed", String(b === bank)));
      return;
    }
    if (el.closest("[data-clear-done]")) {
      state.cart = {};
      saveCart();
      renderMenu();
      closeSheet();
    }
  });

  sheet.addEventListener("input", (e) => {
    if (e.target.id === "f-phone" && e.inputType !== "deleteContentBackward") {
      e.target.value = formatPhone(e.target.value);
    }
    const field = e.target.closest(".field.is-invalid");
    if (field) field.classList.remove("is-invalid");
  });

  sheet.addEventListener("focusin", (e) => {
    if (e.target.id === "f-phone" && !e.target.value) e.target.value = "+7 ";
  });

  sheet.addEventListener("submit", (e) => {
    e.preventDefault();
    readForm();
    if (!validate()) return;
    const url = `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(buildMessage())}`;
    state.lastWaUrl = url;
    state.view = "done";
    renderSheet();
    // телефонда (Instagram браузері де) — сол бетте ашамыз, компьютерде — жаңа қойындыда
    const win = matchMedia("(pointer: coarse)").matches ? null : window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  });

  document.addEventListener("keydown", (e) => {
    if (!sheet.classList.contains("is-open")) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "Tab") {
      // фокус шторкадан шықпасын
      const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', sheet)
        .filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  $("#fab").addEventListener("click", () => openSheet("cart"));
  $$("[data-open-cart]").forEach((b) => b.addEventListener("click", (e) => { e.preventDefault(); openSheet("cart"); }));
}

// ---------- Филиалдар ----------
function isOpen(b) {
  if (b.allDay) return true;
  const { h, m } = aktauNow();
  const now = h * 60 + m;
  return b.close > b.open ? now >= b.open && now < b.close : now >= b.open || now < b.close;
}

function renderBranches() {
  $("#branches").innerHTML = BRANCHES.map((b) => {
    const open = isOpen(b);
    return `<article class="branch">
      <span class="status ${open ? "status--open" : "status--closed"}">${t(open ? "contacts.openNow" : "contacts.closed")}</span>
      <h3 class="branch__name">${escapeHtml(tr(b.name))}</h3>
      <p class="branch__addr">${escapeHtml(tr(b.addr))}</p>
      <p class="branch__hours">${icon("clock")}<span>${escapeHtml(tr(b.hours))}</span></p>
      <div class="branch__foot"><a class="btn btn--ghost btn--block" href="${b.link}" target="_blank" rel="noopener">${icon("map")}<span>${t("contacts.2gis")}</span></a></div>
    </article>`;
  }).join("");
}

// ---------- Ұшқындар ----------
function sparks() {
  const box = $(".sparks");
  if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const n = innerWidth < 700 ? 12 : 22;
  let html = "";
  for (let i = 0; i < n; i++) {
    const left = 4 + Math.random() * 92;
    const d = 4 + Math.random() * 5;
    const delay = Math.random() * 6;
    const x = (Math.random() - 0.5) * 160;
    const s = 2 + Math.random() * 3;
    html += `<i style="left:${left}%;--d:${d}s;--delay:${delay}s;--x:${x}px;width:${s}px;height:${s}px"></i>`;
  }
  box.innerHTML = html;
}

// ---------- Логотип тінтуірге қарай қисаяды ----------
function logoTilt() {
  const hero = $(".hero");
  const logo = $(".hero__logo");
  if (!hero || !logo || matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
  hero.addEventListener("pointermove", (e) => {
    const r = logo.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    logo.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
  });
  hero.addEventListener("pointerleave", () => { logo.style.transform = ""; });
}

// ---------- Бастау ----------
function renderAll() {
  renderTabs();
  renderMenu();
  renderFab();
  renderBranches();
  if ($("#sheet").classList.contains("is-open")) { readForm(); renderSheet(); }
}

document.addEventListener("DOMContentLoaded", () => {
  $("#wa-link").href = `https://wa.me/${CFG.whatsapp}`;
  $("#ig-link").href = CFG.instagram;
  bindMenu();
  bindSheet();
  renderAll();
  sparks();
  logoTilt();
  saveCart();
  if (new URLSearchParams(location.search).get("cart") === "1") {
    history.replaceState(null, "", location.pathname + location.hash);
    openSheet("cart");
  }
});

document.addEventListener("langchange", renderAll);

// басқа бетте корзина өзгерсе — синхрондау
window.addEventListener("storage", (e) => {
  if (e.key !== CART_KEY) return;
  state.cart = readCart();
  renderMenu();
  renderFab();
  updateCartBadge(state.cart);
});

setInterval(renderBranches, 60 * 1000);
