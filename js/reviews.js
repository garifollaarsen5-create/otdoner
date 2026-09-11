// ===== otdoner · пікірлер (Supabase REST) =====

const Reviews = (() => {
  const cfg = window.OTDONER_CONFIG;
  const MAX_PHOTOS = 3;
  const MAX_SIDE = 1280;

  const configured = () => Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
  const endpoint = () => `${cfg.supabaseUrl.replace(/\/$/, "")}/rest/v1/${cfg.reviewsTable}`;
  const headers = (extra = {}) => ({
    apikey: cfg.supabaseAnonKey,
    Authorization: `Bearer ${cfg.supabaseAnonKey}`,
    ...extra,
  });

  async function list({ limit = 12, offset = 0 } = {}) {
    const url = `${endpoint()}?select=id,created_at,name,text,photos&order=created_at.desc&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, { headers: headers({ Prefer: "count=exact" }) });
    if (!res.ok) throw new Error(`list ${res.status}`);
    const range = res.headers.get("content-range") || "";
    const total = Number(range.split("/")[1]);
    return { rows: await res.json(), total: Number.isFinite(total) ? total : null };
  }

  async function create({ name, text, photos }) {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ name, text, photos }),
    });
    if (!res.ok) throw new Error(`create ${res.status}: ${await res.text()}`);
  }

  // Фотоны кішірейтіп, JPEG-ке айналдыру (телефон фотосы 5 МБ → ~200 КБ)
  function compress(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.round(img.naturalWidth * scale);
        const h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.74));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image")); };
      img.src = url;
    });
  }

  function dateText(iso) {
    const d = new Date(iso);
    const months = {
      kz: ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"],
      ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    }[LANG];
    return LANG === "kz"
      ? `${d.getFullYear()} ж. ${d.getDate()} ${months[d.getMonth()]}`
      : `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function card(r) {
    const photos = Array.isArray(r.photos) ? r.photos.filter((p) => typeof p === "string" && /^(data:image\/|https:\/\/)/.test(p)).slice(0, MAX_PHOTOS) : [];
    const initial = (r.name || "?").trim().charAt(0).toUpperCase();
    return `<article class="rev">
      <div class="rev__head">
        <span class="rev__avatar" aria-hidden="true">${escapeHtml(initial)}</span>
        <div>
          <p class="rev__name">${escapeHtml(r.name)}</p>
          <time class="rev__date" datetime="${escapeHtml(r.created_at)}">${dateText(r.created_at)}</time>
        </div>
      </div>
      <p class="rev__text">${escapeHtml(r.text)}</p>
      ${photos.length ? `<div class="rev__photos${photos.length === 1 ? " rev__photos--1" : ""}">
        ${photos.map((p) => `<button type="button" data-zoom="${escapeHtml(p)}" aria-label="${escapeHtml(r.name)}"><img src="${escapeHtml(p)}" alt="" loading="lazy"></button>`).join("")}
      </div>` : ""}
    </article>`;
  }

  // ---- Фото үлкейту ----
  function bindLightbox() {
    const box = document.getElementById("lightbox");
    if (!box) return;
    const img = box.querySelector("img");
    const close = () => { box.classList.remove("is-open"); img.src = ""; };
    document.addEventListener("click", (e) => {
      const z = e.target.closest("[data-zoom]");
      if (z) { img.src = z.dataset.zoom; box.classList.add("is-open"); box.querySelector("button").focus(); return; }
      if (box.classList.contains("is-open") && (e.target === box || e.target.closest("[data-lb-close]"))) close();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("is-open")) close(); });
  }

  // ---- Пікір формасы (басты бет) ----
  function bindForm(onCreated) {
    const form = document.getElementById("review-form");
    if (!form) return;
    const thumbs = document.getElementById("rev-thumbs");
    const msg = document.getElementById("rev-msg");
    const submit = form.querySelector("[type=submit]");
    let photos = [];

    const showMsg = (text, ok) => {
      msg.hidden = !text;
      msg.className = `msg ${ok ? "msg--ok" : "msg--err"}`;
      msg.textContent = text;
    };

    const renderThumbs = () => {
      thumbs.innerHTML = photos.map((p, i) => `<div class="thumb"><img src="${p}" alt="">
        <button type="button" data-rm="${i}" aria-label="${t("rev.removePhoto")}">${icon("close")}</button></div>`).join("");
      form.querySelectorAll(".photo-btn input").forEach((inp) => { inp.disabled = photos.length >= MAX_PHOTOS; });
    };

    thumbs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-rm]");
      if (!b) return;
      photos.splice(Number(b.dataset.rm), 1);
      renderThumbs();
    });

    form.querySelectorAll(".photo-btn input").forEach((input) => {
      input.addEventListener("change", async () => {
        const files = [...input.files].slice(0, MAX_PHOTOS - photos.length);
        input.value = "";
        for (const f of files) {
          if (!f.type.startsWith("image/")) continue;
          try { photos.push(await compress(f)); } catch (e) { /* оқылмаған файлды өткізіп жібереміз */ }
        }
        renderThumbs();
      });
    });

    form.addEventListener("input", (e) => {
      const f = e.target.closest(".field.is-invalid");
      if (f) f.classList.remove("is-invalid");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showMsg("", true);
      const name = form.elements.name.value.trim();
      const text = form.elements.text.value.trim();
      const badName = name.length < 2;
      const badText = text.length < 3;
      form.querySelector('[data-field="rname"]').classList.toggle("is-invalid", badName);
      form.querySelector('[data-field="rtext"]').classList.toggle("is-invalid", badText);
      if (badName) return form.elements.name.focus();
      if (badText) return form.elements.text.focus();
      if (!configured()) return showMsg(t("rev.off"), false);

      submit.disabled = true;
      const label = submit.querySelector("span");
      label.textContent = t("rev.sending");
      try {
        await create({ name: name.slice(0, 60), text: text.slice(0, 1000), photos });
        form.reset();
        photos = [];
        renderThumbs();
        showMsg(t("rev.ok"), true);
        if (onCreated) onCreated();
      } catch (err) {
        console.error(err);
        showMsg(t("rev.err"), false);
      } finally {
        submit.disabled = false;
        label.textContent = t("rev.send");
      }
    });
  }

  return { configured, list, card, bindForm, bindLightbox };
})();

// ---- Басты беттегі соңғы пікірлер ----
async function loadLatestReviews() {
  const box = document.getElementById("rev-latest");
  if (!box) return;
  if (!Reviews.configured()) { box.innerHTML = `<p class="state">${t("rev.off")}</p>`; return; }
  box.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div>';
  try {
    const { rows } = await Reviews.list({ limit: 3 });
    box._rows = rows;
    box.innerHTML = rows.length ? rows.map(Reviews.card).join("") : `<p class="state">${t("rev.empty")}</p>`;
  } catch (e) {
    console.error(e);
    box.innerHTML = `<p class="state">${t("rev.loadErr")}</p>`;
  }
}

// ---- reviews.html: барлық пікірлер ----
function reviewWord(n) {
  if (LANG === "kz") return "пікір";
  const d10 = n % 10, d100 = n % 100;
  if (d10 === 1 && d100 !== 11) return "отзыв";
  if (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) return "отзыва";
  return "отзывов";
}

const ReviewsPage = (() => {
  const PAGE = 12;
  let rows = [];
  let total = null;

  function render() {
    const box = document.getElementById("rev-all");
    const more = document.getElementById("rev-more");
    const count = document.getElementById("rev-count");
    box.innerHTML = rows.length ? rows.map(Reviews.card).join("") : `<p class="state">${t("rev.empty")}</p>`;
    more.hidden = total === null ? rows.length % PAGE !== 0 || !rows.length : rows.length >= total;
    if (count) count.textContent = total ? `${total} ${reviewWord(total)}` : "";
  }

  async function load() {
    const box = document.getElementById("rev-all");
    const more = document.getElementById("rev-more");
    if (!Reviews.configured()) { box.innerHTML = `<p class="state">${t("rev.off")}</p>`; more.hidden = true; return; }
    if (!rows.length) box.innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
    more.disabled = true;
    try {
      const res = await Reviews.list({ limit: PAGE, offset: rows.length });
      rows = rows.concat(res.rows);
      total = res.total;
      render();
    } catch (e) {
      console.error(e);
      box.innerHTML = `<p class="state">${t("rev.loadErr")}</p>`;
      more.hidden = true;
    } finally {
      more.disabled = false;
    }
  }

  return { load, render, get loaded() { return rows.length > 0; } };
})();

document.addEventListener("DOMContentLoaded", () => {
  Reviews.bindLightbox();
  if (document.getElementById("review-form")) {
    Reviews.bindForm(loadLatestReviews);
    loadLatestReviews();
  }
  if (document.getElementById("rev-all")) {
    ReviewsPage.load();
    document.getElementById("rev-more").addEventListener("click", ReviewsPage.load);
  }
});

document.addEventListener("langchange", () => {
  const latest = document.getElementById("rev-latest");
  if (latest && latest._rows) {
    latest.innerHTML = latest._rows.length ? latest._rows.map(Reviews.card).join("") : `<p class="state">${t("rev.empty")}</p>`;
  } else if (latest) {
    loadLatestReviews();
  }
  if (document.getElementById("rev-all")) {
    if (ReviewsPage.loaded) ReviewsPage.render(); else ReviewsPage.load();
  }
});
