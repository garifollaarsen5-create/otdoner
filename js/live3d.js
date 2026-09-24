// =========================================================
// ОТ ДОНЕР · 3D / «тірі сайт» қабаты (жергілікті нұсқа)
//  1) бүкіл беттегі 3D ұшқындар (скроллға қарай тереңдік)
//  2) «Мәзір» жанындағы айналатын донер шампуры
//  3) карточкалардың 3D қисаюы, тағамның қалқуы, 3D кіру анимациясы
//  4) «Қосу» басқанда тағам корзинаға ұшады + ұшқын шашырайды
// =========================================================
// Hero видеосы: жүктелгенде ақырын шығады, экраннан кетсе тоқтайды (батарея үнемдеу)
(() => {
  const v = document.querySelector(".hero__video video");
  if (!v) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.removeAttribute("autoplay"); v.pause(); return; }
  const on = () => v.classList.add("is-on");
  if (v.readyState >= 3) on(); else v.addEventListener("canplay", on, { once: true });
  new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(v);
})();

// Кәдімгі скрипт (file:// арқылы да ашылады), Three.js CDN-нен динамикалық жүктеледі
(async () => {
let THREE;
try { THREE = await import("three"); }
catch (e) { document.getElementById("embers3d")?.remove(); return; }

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const mobile = innerWidth < 700;
const $ = (s, r = document) => r.querySelector(s);

/* ---------------------------------------------------------
   1) 3D ҰШҚЫНДАР
   --------------------------------------------------------- */
function embers() {
  const canvas = $("#embers3d");
  if (!canvas || reduce) return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false }); }
  catch (e) { canvas.remove(); return; }
  const pr = Math.min(devicePixelRatio, 1.5);
  renderer.setPixelRatio(pr);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, .1, 60);
  camera.position.z = 10;

  const N = mobile ? 110 : 260;
  const pos = new Float32Array(N * 3), size = new Float32Array(N), seed = new Float32Array(N), speed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - .5) * 26;
    pos[i * 3 + 1] = (Math.random() - .5) * 18;
    pos[i * 3 + 2] = -10 + Math.random() * 14;
    size[i] = .6 + Math.random() * 1.8;
    seed[i] = Math.random() * 100;
    speed[i] = .35 + Math.random() * .9;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uT: { value: 0 }, uPR: { value: pr }, uCamY: { value: 0 } },
    vertexShader: `
      attribute float aSize; attribute float aSeed;
      uniform float uT; uniform float uPR; uniform float uCamY;
      varying float vA; varying float vHot;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float flick = .55 + .45 * sin(uT * (3.0 + fract(aSeed) * 5.0) + aSeed);
        float low = clamp((uCamY - position.y) / 9.0 * .5 + .5, 0.0, 1.0);   // экранның төменгі жағы — ыстығырақ
        vA = flick * mix(.35, 1.0, low);
        vHot = fract(aSeed * 7.13);
        gl_PointSize = aSize * uPR * (120.0 / -mv.z);
      }`,
    fragmentShader: `
      varying float vA; varying float vHot;
      void main(){
        float d = length(gl_PointCoord - .5);
        float a = smoothstep(.5, .0, d);
        vec3 core = vec3(1.0, .86, .55), edge = mix(vec3(1.0, .35, .08), vec3(1.0, .55, .15), vHot);
        gl_FragColor = vec4(mix(edge, core, smoothstep(.25, .0, d)), a * a * vA);
      }`,
  });
  scene.add(new THREE.Points(geo, mat));

  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize); resize();

  let mx = 0, lastY = scrollY, vel = 0, last = performance.now(), t = 0;
  addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") mx = e.clientX / innerWidth - .5; }, { passive: true });

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
    // скролл жылдамдығы ұшқындарды үрлейді
    const dy = scrollY - lastY; lastY = scrollY;
    vel = vel * .9 + Math.min(40, Math.abs(dy)) * .1;
    const camY = -scrollY * .006;
    camera.position.y = camY;
    camera.position.x += (mx * 1.2 - camera.position.x) * .04;
    camera.lookAt(camera.position.x * .5, camY, 0);
    const boost = 1 + vel * .12;
    for (let i = 0; i < N; i++) {
      const k = i * 3;
      pos[k + 1] += speed[i] * dt * boost;
      pos[k] += Math.sin(t * .8 + seed[i]) * .25 * dt;
      if (pos[k + 1] > camY + 9) { pos[k + 1] = camY - 9; pos[k] = (Math.random() - .5) * 26; }
      else if (pos[k + 1] < camY - 9.5) pos[k + 1] += 18;
    }
    geo.attributes.position.needsUpdate = true;
    mat.uniforms.uT.value = t;
    mat.uniforms.uCamY.value = camY;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------
   2) АЙНАЛАТЫН ДОНЕР ШАМПУРЫ
   --------------------------------------------------------- */
function meatTexture() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 1024;
  const g = c.getContext("2d");
  const tones = ["#6b3a22", "#7d4629", "#8f5634", "#5a2f1b", "#9c6440", "#734126", "#b07a52"];
  g.fillStyle = tones[0]; g.fillRect(0, 0, 512, 1024);
  // ет қабаттары — түзу емес, толқынды
  for (let y = -10; y < 1034;) {
    const h = 4 + Math.random() * 9, ph = Math.random() * 6, amp = 2 + Math.random() * 5, fr = .02 + Math.random() * .04;
    g.fillStyle = tones[(Math.random() * tones.length) | 0];
    g.beginPath(); g.moveTo(0, y + Math.sin(ph) * amp);
    for (let x = 0; x <= 512; x += 16) g.lineTo(x, y + Math.sin(x * fr + ph) * amp);
    for (let x = 512; x >= 0; x -= 16) g.lineTo(x, y + h + Math.sin(x * fr * 1.3 + ph + 1) * amp);
    g.closePath(); g.fill();
    y += h * .8;
  }
  // қуырылған қытырлақ жерлер
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 512, y = Math.random() * 1024, r = 2 + Math.random() * 9;
    g.fillStyle = Math.random() < .6 ? `rgba(40,16,6,${.25 + Math.random() * .45})` : `rgba(230,150,70,${.15 + Math.random() * .3})`;
    g.beginPath(); g.ellipse(x, y, r * 1.8, r * .6, 0, 0, 7); g.fill();
  }
  // қабаттар арасындағы майлы жылтыр сызықтар
  g.strokeStyle = "rgba(255,190,110,.18)"; g.lineWidth = 2;
  for (let y = 0; y < 1024; y += 14 + Math.random() * 20) {
    g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * .05 + y) * 3);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.anisotropy = 4;
  return t;
}
function heaterTexture() {
  const c = document.createElement("canvas"); c.width = 256; c.height = 512;
  const g = c.getContext("2d");
  g.save(); g.translate(128, 256); g.scale(1, 2);
  const halo = g.createRadialGradient(0, 0, 10, 0, 0, 125);
  halo.addColorStop(0, "rgba(255,150,60,.95)"); halo.addColorStop(.45, "rgba(255,90,20,.55)"); halo.addColorStop(1, "rgba(255,60,0,0)");
  g.fillStyle = halo; g.beginPath(); g.arc(0, 0, 125, 0, 7); g.fill(); g.restore();
  for (let i = 0; i < 70; i++) {
    const x = 128 + (Math.random() - .5) * 150, y = 256 + (Math.random() - .5) * 380;
    const gr = g.createRadialGradient(x, y, 0, x, y, 6 + Math.random() * 8);
    gr.addColorStop(0, "rgba(255,230,160,.9)"); gr.addColorStop(1, "rgba(255,120,30,0)");
    g.fillStyle = gr; g.fillRect(x - 14, y - 14, 28, 28);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function spit() {
  const head = $("#menu .section__head");
  if (!head || reduce) return;
  const canvas = document.createElement("canvas");
  canvas.className = "spit3d"; canvas.setAttribute("aria-hidden", "true");
  head.appendChild(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
  catch (e) { canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 50);
  camera.position.set(0, .25, 7.6);
  camera.lookAt(0, 0, 0);

  const rig = new THREE.Group(); scene.add(rig);
  // ет: шпиндель пішіні, беті бұдырлы
  const prof = [[.02, -1.32], [.5, -1.32], [.64, -1.1], [.74, -.6], [.76, -.1], [.7, .4], [.6, .9], [.47, 1.2], [.3, 1.32], [.02, 1.34]]
    .map(([x, y]) => new THREE.Vector2(x, y));
  const meatGeo = new THREE.LatheGeometry(new THREE.SplineCurve(prof).getPoints(40), 96);
  {
    const p = meatGeo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const r = Math.hypot(v.x, v.z);
      if (r < .05) continue;
      const a = Math.atan2(v.z, v.x);
      const bump = 1 + .035 * Math.sin(a * 9 + v.y * 6) + .025 * Math.sin(a * 23 - v.y * 17) + .02 * Math.sin(v.y * 40);
      p.setXYZ(i, v.x * bump, v.y, v.z * bump);
    }
    meatGeo.computeVertexNormals();
  }
  const tex = meatTexture();
  const meat = new THREE.Mesh(meatGeo, new THREE.MeshStandardMaterial({
    map: tex, bumpMap: tex, bumpScale: .9, roughness: .62, metalness: 0, emissive: 0x2a0c02, emissiveIntensity: .35,
  }));
  rig.add(meat);
  const steel = new THREE.MeshStandardMaterial({ color: 0x9a948f, metalness: .6, roughness: .35 });
  const skewer = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, 3.5, 16), steel); rig.add(skewer);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.34, .34, .06, 32), steel); cap.position.y = 1.38; rig.add(cap);
  const tray = new THREE.Mesh(new THREE.CylinderGeometry(.85, .7, .1, 40), steel); tray.position.y = -1.42; scene.add(tray);

  // артындағы қызарған қыздырғыш
  const heaterMat = new THREE.MeshBasicMaterial({ map: heaterTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const heater = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 4.2), heaterMat);
  heater.position.set(0, 0, -1.15); scene.add(heater);

  scene.add(new THREE.AmbientLight(0xffe2c8, .5));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.6); key.position.set(2, 3, 5); scene.add(key);
  const fire = new THREE.PointLight(0xff6a22, 14, 6, 1.6); fire.position.set(0, 0, -.9); scene.add(fire);
  const fill = new THREE.PointLight(0xff8a3a, 9, 6, 1.6); fill.position.set(-1.6, -.8, 1); scene.add(fill);

  // шампурдан тамған май ұшқындары
  const DR = 14, drops = [];
  const dropMat = new THREE.MeshBasicMaterial({ color: 0xffb347 });
  for (let i = 0; i < DR; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(.025, 6, 4), dropMat);
    m.userData = { v: 0, life: Math.random() * 2 };
    scene.add(m); drops.push(m);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  addEventListener("resize", resize); resize();

  // тартып айналдыруға болады
  let spin = .9, drag = null;
  canvas.addEventListener("pointerdown", (e) => { drag = e.clientX; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener("pointermove", (e) => { if (drag == null) return; spin += (e.clientX - drag) * .02; drag = e.clientX; });
  canvas.addEventListener("pointerup", () => { drag = null; });

  let visible = false, last = performance.now(), t = 0;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; last = performance.now(); }).observe(canvas);
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
    spin += (.9 - spin) * .02;
    rig.rotation.y += spin * dt;
    rig.rotation.z = Math.sin(t * .7) * .03;
    fire.intensity = 13 + Math.sin(t * 13) * 2 + Math.sin(t * 7.3) * 2;
    heaterMat.color.setScalar(.85 + Math.sin(t * 9) * .08 + Math.sin(t * 4.1) * .07);
    drops.forEach((d) => {
      const u = d.userData;
      u.life -= dt;
      if (u.life <= 0) {
        const a = Math.random() * Math.PI * 2, y = -1 + Math.random() * 1.8;
        d.position.set(Math.cos(a) * .7, y, Math.sin(a) * .7 + .2);
        u.v = 0; u.life = .6 + Math.random() * 1.6;
      }
      u.v -= 6 * dt; d.position.y += u.v * dt;
      d.visible = d.position.y > -1.4;
    });
    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------
   3) КАРТОЧКАЛАР: 3D қисаю, қалқу, кіру анимациясы
   --------------------------------------------------------- */
function cards() {
  const grid = $("#menu-grid");
  if (!grid) return;

  if (fine && !reduce) {
    let active = null;
    const clear = () => {
      if (!active) return;
      active.classList.remove("is-tilt");
      const img = $(".card__media img", active);
      if (img) { img.style.removeProperty("--px"); img.style.removeProperty("--py"); img.style.removeProperty("--pr"); }
      active = null;
    };
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest?.(".card, .promo, .why__item");
      if (active && active !== el) clear();
      if (!el || el.classList.contains("is-enter")) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.setProperty("--ry", (x * 14).toFixed(2) + "deg");
      el.style.setProperty("--rx", (-y * 11).toFixed(2) + "deg");
      el.style.setProperty("--gx", ((x + .5) * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", ((y + .5) * 100).toFixed(1) + "%");
      const img = $(".card__media img", el);
      if (img) {
        img.style.setProperty("--px", (x * 22).toFixed(1) + "px");
        img.style.setProperty("--py", (y * 14 - 8).toFixed(1) + "px");
        img.style.setProperty("--pr", (x * 4).toFixed(2) + "deg");
      }
      el.classList.add("is-tilt");
      active = el;
    }, { passive: true });
    document.addEventListener("pointerleave", clear);
  }

  // Мәзір тек категория ауысқанда 3D-ша «аударылып» шығады
  // (себетке қосқанда да renderMenu шақырылады — онда анимация жоқ)
  let sig = "", pending = false, inView = false;
  const decorate = () => {
    [...grid.children].forEach((c, i) => c.style.setProperty("--fd", (-(i * 0.73) % 4.6).toFixed(2) + "s"));
  };
  const play = () => {
    pending = false;
    [...grid.children].forEach((c, i) => {
      c.style.setProperty("--i", i);
      c.classList.add("is-enter");
      c.addEventListener("animationend", (e) => { if (e.target === c) c.classList.remove("is-enter"); }, { once: false });
    });
  };
  const check = () => {
    decorate();
    const now = [...grid.children].map((c) => c.dataset.item).join(",");
    if (now === sig) return;
    sig = now;
    if (reduce) return;
    if (inView) play(); else pending = true;
  };
  new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (inView && pending) play(); }, { threshold: .15 }).observe(grid);
  new MutationObserver(check).observe(grid, { childList: true });
  check();
}

/* ---------------------------------------------------------
   4) КОРЗИНАҒА ҰШУ + ҰШҚЫН
   --------------------------------------------------------- */
function flyToCart() {
  const grid = $("#menu-grid");
  if (!grid || reduce || !Element.prototype.animate) return;
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add], [data-inc]");
    if (!btn) return;
    const card = btn.closest(".card");
    const src = card && $(".card__media img", card);
    const b = btn.getBoundingClientRect();

    // ұшқын шашырауы
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("i");
      s.className = "burst-spark";
      document.body.appendChild(s);
      const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 50;
      const x0 = b.left + b.width / 2, y0 = b.top + b.height / 2;
      s.animate([
        { transform: `translate(${x0}px,${y0}px) scale(1)`, opacity: 1 },
        { transform: `translate(${x0 + Math.cos(a) * d}px,${y0 + Math.sin(a) * d - 20}px) scale(.2)`, opacity: 0 },
      ], { duration: 500 + Math.random() * 300, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => s.remove();
    }

    if (!src) return;
    const r = src.getBoundingClientRect();
    const fly = document.createElement("img");
    fly.className = "fly-food";
    fly.src = src.currentSrc || src.src;
    fly.alt = "";
    document.body.appendChild(fly);
    const w = 120, h = 90;
    const x0 = r.left + r.width / 2 - w / 2, y0 = r.top + r.height / 2 - h / 2;
    const x1 = innerWidth / 2 - w / 2, y1 = innerHeight - 50 - h / 2;   // корзина батырмасы төменгі ортада
    const mx = (x0 + x1) / 2 + (x0 < x1 ? -60 : 60), my = Math.min(y0, y1) - 160;
    fly.animate([
      { transform: `translate(${x0}px,${y0}px) perspective(600px) rotateY(0deg) scale(${Math.min(2.2, r.width / w)})`, opacity: 1 },
      { transform: `translate(${mx}px,${my}px) perspective(600px) rotateY(200deg) scale(1.1)`, opacity: 1, offset: .45 },
      { transform: `translate(${x1}px,${y1}px) perspective(600px) rotateY(360deg) scale(.25)`, opacity: .4 },
    ], { duration: 900, easing: "cubic-bezier(.45,0,.35,1)" }).onfinish = () => fly.remove();
  }, true);
}


/* ---------------------------------------------------------
   5) МӘЗІРДЕГІ ТАҒАМДАР 3D (Higgsfield · SAM 3D / Tripo)
   Модельдер img/3d/<сурет>.js ішінде (base64 GLB) — file:// арқылы да ашылады.
   --------------------------------------------------------- */
const MODELS = new Set([
  "baguette-beef", "baguette-chicken", "baguette-mix", "bastyrma", "chicken",
  "doner-beef", "doner-chicken", "doner-mix", "nanet", "green-doner", "twister",
  "shawarma-beef", "shawarma-chicken", "shawarma-mix", "hotdog-big", "hotdog-classic",
  "fries", "nuggets",
  "pizza-4seasons", "pizza-beef", "pizza-chicken", "pizza-margherita", "pizza-pepperoni", "pizza-sweet-chili",
  "drink-ayran", "drink-cola", "drink-fanta", "drink-sprite", "drink-fuse-mango", "drink-fuse-peach",
  "drink-fuse-pineapple", "drink-piko-grape", "drink-piko-orange",
]);
const imgKey = (img) => {
  const m = (img && img.getAttribute("src") || "").match(/menu\/([\w-]+?)(-s)?\.webp/);
  return m ? m[1] : null;
};
function loadModelScript(key) {
  window.OTD3D = window.OTD3D || {};
  if (window.OTD3D[key]) return Promise.resolve(window.OTD3D[key]);
  return new Promise((res, rej) => {
    const sc = document.createElement("script");
    sc.src = "img/3d/" + key + ".js";
    sc.onload = () => window.OTD3D[key] ? res(window.OTD3D[key]) : rej(new Error("empty"));
    sc.onerror = rej;
    document.head.appendChild(sc);
  });
}

function menu3d() {
  const grid = $("#menu-grid");
  if (!grid) return;
  let libs = null;
  const getLibs = () => libs || (libs = Promise.all([
    import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/meshopt_decoder.module.js"),
    import("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/environments/RoomEnvironment.js"),
  ]));

  let active = null;   // { item, media, dispose }
  let wantItem = null; // корзинаға қосқанда мәзір қайта сызылады — 3D-ны қайта ашамыз

  function addButtons() {
    grid.querySelectorAll(".card").forEach((card) => {
      const media = $(".card__media", card), img = media && $("img", media);
      const key = imgKey(img);
      if (!key || !MODELS.has(key) || $(".m3d-btn", media)) return;
      const b = document.createElement("button");
      b.type = "button"; b.className = "m3d-btn"; b.dataset.key = key;
      b.setAttribute("aria-label", "3D");
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3 7v10l9 5 9-5V7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 7l9 5 9-5M12 12v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span>3D</span>';
      media.appendChild(b);
    });
    if (wantItem && !active) {
      const card = grid.querySelector('.card[data-item="' + wantItem + '"]');
      const b = card && $(".m3d-btn", card);
      if (b) open(card, b);
    }
  }

  function close() {
    if (!active) return;
    active.dispose();
    active.media.classList.remove("is-3d", "is-loading");
    active = null;
  }

  async function open(card, btn) {
    close();
    const media = $(".card__media", card), key = btn.dataset.key;
    const item = card.dataset.item;
    wantItem = item;
    media.classList.add("is-3d", "is-loading");
    let disposed = false;
    const state = { item, media, dispose: () => { disposed = true; } };
    active = state;
    try {
      const [[{ GLTFLoader }, { MeshoptDecoder }, { RoomEnvironment }], url] = await Promise.all([getLibs(), loadModelScript(key)]);
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.className = "m3d-canvas";
      media.appendChild(canvas);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      const scene = new THREE.Scene();
      const pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
      scene.environmentIntensity = .75;
      const key1 = new THREE.DirectionalLight(0xfff0dc, 1.4); key1.position.set(2, 3, 4); scene.add(key1);
      const ember = new THREE.PointLight(0xff6a22, 6, 6, 1.5); ember.position.set(0, -1.4, .6); scene.add(ember);
      const camera = new THREE.PerspectiveCamera(32, 1, .05, 50);
      camera.position.set(0, .75, 4.2); camera.lookAt(0, -.05, 0);

      const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync(url);
      if (disposed) { renderer.dispose(); canvas.remove(); return; }
      const obj = gltf.scene;
      const box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new THREE.Vector3()), sz = box.getSize(new THREE.Vector3());
      const k = 2.1 / Math.max(sz.x, sz.y, sz.z);
      obj.position.sub(c).multiplyScalar(k); obj.scale.setScalar(k);
      // жалпақ тағамға (пицца, бастырма) жоғарыдан қараймыз
      const flat = sz.y / Math.max(sz.x, sz.z);
      if (flat < .35) { camera.position.set(0, 2.4, 3.3); camera.lookAt(0, -.2, 0); }
      const spin = new THREE.Group(); spin.add(obj);
      const tilt = new THREE.Group(); tilt.add(spin); scene.add(tilt);
      // астындағы шоқ жарығы
      const cv = document.createElement("canvas"); cv.width = cv.height = 128;
      const g2 = cv.getContext("2d"), gr = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, "rgba(255,140,50,.85)"); gr.addColorStop(1, "rgba(255,80,20,0)");
      g2.fillStyle = gr; g2.fillRect(0, 0, 128, 128);
      const glowTex = new THREE.CanvasTexture(cv); glowTex.colorSpace = THREE.SRGBColorSpace;
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      glow.rotation.x = -Math.PI / 2; glow.position.y = -sz.y * k / 2 - .05; scene.add(glow);

      const resize = () => { const w = media.clientWidth, h = media.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
      resize();
      const ro = new ResizeObserver(resize); ro.observe(media);

      // тартып айналдыру (көлденең) — тік скролл телефонда бұзылмайды
      let vel = .9, dragging = false, lastX = 0, rx = 0, targetRx = 0;
      const down = (e) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); };
      const move = (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastX; lastX = e.clientX;
        spin.rotation.y += dx * .012; vel = dx * .6;
        const r = canvas.getBoundingClientRect(); targetRx = ((e.clientY - r.top) / r.height - .5) * .5;
      };
      const up = () => { dragging = false; targetRx = 0; };
      canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);

      let t = 0, last = performance.now(), raf = 0, intro = 0;
      const frame = (now) => {
        raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
        intro = Math.min(1, intro + dt * 1.6);
        const e = 1 - Math.pow(1 - intro, 3);
        if (!dragging) { vel += (.9 - vel) * .03; spin.rotation.y += vel * dt; }
        rx += (targetRx - rx) * .1;
        tilt.rotation.x = rx; tilt.position.y = Math.sin(t * 1.6) * .06;
        tilt.scale.setScalar(.6 + .4 * e);
        ember.intensity = 5 + Math.sin(t * 9) * .8 + Math.sin(t * 4.3) * .8;
        glow.material.opacity = .75 + Math.sin(t * 3) * .15;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);
      media.classList.remove("is-loading");
      state.dispose = () => {
        cancelAnimationFrame(raf); ro.disconnect();
        renderer.dispose(); pm.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss();
        canvas.remove();
      };
      if (disposed) state.dispose();
    } catch (err) {
      console.warn("3D", err);
      if (active === state) close();
    }
  }

  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".m3d-btn");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const card = b.closest(".card");
    if (active && active.item === card.dataset.item && card.contains(active.media)) { wantItem = null; close(); return; }
    open(card, b);
  });
  // мәзір қайта сызылса (корзина, категория) — ескі 3D-ны тазалаймыз
  new MutationObserver(() => {
    if (active && !grid.contains(active.media)) { const w = wantItem; close(); wantItem = w; }
    if (wantItem && !grid.querySelector('.card[data-item="' + wantItem + '"]')) wantItem = null;
    addButtons();
  }).observe(grid, { childList: true });
  addButtons();
}

embers();
cards();
flyToCart();
menu3d();
})();
