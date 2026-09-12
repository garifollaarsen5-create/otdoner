// ===== otdoner · қазақша / орысша =====

const I18N = {
  kz: {
    "meta.title": "ОТ ДОНЕР — отта піскен фаст-фуд, Ақтау",
    "nav.menu": "Мәзір",
    "nav.reviews": "Пікірлер",
    "nav.contacts": "Байланыс",
    "nav.home": "Басты бет",
    "cart.open": "Корзинаны ашу",
    "lang.label": "Тіл",

    "hero.title1": "Отта піскен",
    "hero.title2": "дәм",
    "hero.sub": "Ыстық шоқта піскен ет, балғын көкөніс, фирмалық соус. Ақтаудағы топ фаст-фуд: донер, шаурма, пицца, чикен.",
    "hero.cta": "Тапсырыс беру",
    "hero.clock": "ЖК Дукат филиалы тәулік бойы, жыл бойы ашық",

    "why.title": "Неге otdoner?",
    "why.1.t": "Үздіксіз 24/7",
    "why.1.d": "ЖК Дукат филиалы түнде де, мерекеде де жұмыс істейді.",
    "why.2.t": "Балғын дәм",
    "why.2.d": "Ет ашық шоқта піседі, көкөністер әрдайым балғын.",
    "why.3.t": "Жылдам жеткізу",
    "why.3.d": "Ақтау бойынша тапсырысты ыстықтай жеткіземіз.",
    "why.4.t": "Фирмалық соустар",
    "why.4.d": "Әр донер мен шаурмада өзіміздің соус.",

    "menu.title": "Мәзір",
    "menu.add": "Қосу",
    "menu.addAria": "Корзинаға қосу",
    "menu.less": "Азайту",
    "menu.more": "Көбейту",
    "menu.noPhoto": "Фото жақында",
    "menu.size": "Мөлшері",
    "menu.flavor": "Дәмі",
    "menu.stopped": "Уақытша жоқ",

    "cart.title": "Корзина",
    "cart.empty": "Корзина бос. Мәзірден ұнаған тағамды таңдаңыз.",
    "cart.toMenu": "Мәзірге өту",
    "cart.total": "Барлығы",
    "cart.checkout": "Тапсырысты рәсімдеу",
    "cart.clear": "Тазалау",
    "cart.remove": "Өшіру",
    "cart.close": "Жабу",
    "cart.back": "Корзинаға қайту",
    "cart.items": "тағам",
    "cart.stopRemoved": "Кейбір тағам уақытша бітіп қалды — корзинадан алынды.",

    "order.title": "Тапсырыс",
    "order.type": "Алу түрі",
    "order.pickup": "Өзім аламын",
    "order.delivery": "Жеткізу",
    "order.branch": "Қай филиалдан аласыз",
    "order.branchPh": "Филиалды таңдаңыз",
    "order.address": "Жеткізу мекенжайы",
    "order.addressPh": "Шағын аудан, үй, пәтер",
    "order.name": "Атыңыз",
    "order.namePh": "Мысалы: Айбек",
    "order.phone": "Удаленка жіберілетін нөмір",
    "order.phoneHint": "Аударым жасалатын телефон нөмірі",
    "order.bank": "Қай банкпен жібересіз",
    "order.date": "Күні",
    "order.time": "Уақыты",
    "order.comment": "Түсініктеме",
    "order.optional": "міндетті емес",
    "order.commentPh": "Мысалы: пиязсыз, соусты бөлек салыңыз",
    "order.send": "WhatsApp-қа жіберу",
    "order.note": "Тапсырыс WhatsApp-та дайын хабарлама болып ашылады — тек «Жіберу» түймесін басыңыз.",
    "order.err.branch": "Филиалды таңдаңыз",
    "order.err.address": "Жеткізу мекенжайын жазыңыз",
    "order.err.name": "Атыңызды жазыңыз",
    "order.err.phone": "Нөмірді толық жазыңыз: +7 7XX XXX XX XX",
    "order.err.date": "Күнін таңдаңыз",
    "order.err.time": "Уақытын таңдаңыз",
    "order.done.t": "WhatsApp ашылды",
    "order.done.d": "Хабарламаны жіберуді ұмытпаңыз. Менеджер тапсырысты растап, жауап жазады.",
    "order.done.again": "WhatsApp-ты қайта ашу",
    "order.done.new": "Корзинаны тазалау",

    "wa.head": "Жаңа тапсырыс — ОТ ДОНЕР",
    "wa.items": "Тағамдар",
    "wa.total": "Жалпы сома",
    "wa.client": "Клиент",
    "wa.type": "Алу түрі",
    "wa.branch": "Филиал",
    "wa.address": "Мекенжай",
    "wa.name": "Аты",
    "wa.phone": "Удаленка нөмірі",
    "wa.bank": "Банк",
    "wa.date": "Күні",
    "wa.time": "Уақыты",
    "wa.comment": "Түсініктеме",
    "wa.pcs": "дана",

    "rev.title": "Пікір қалдыру",
    "rev.lead": "Дәмі ұнады ма? Бірнеше сөз жазып, тағамның фотосын қосыңыз — пікіріңізді барлығы көреді.",
    "rev.name": "Атыңыз",
    "rev.namePh": "Мысалы: Аружан",
    "rev.text": "Пікіріңіз",
    "rev.textPh": "Не ұнады, нені жақсартуға болады?",
    "rev.photo": "Фото",
    "rev.camera": "Камера",
    "rev.gallery": "Галерея",
    "rev.photoHint": "3 фотоға дейін",
    "rev.removePhoto": "Фотоны өшіру",
    "rev.send": "Пікірді жіберу",
    "rev.sending": "Жіберілуде…",
    "rev.ok": "Рахмет! Пікіріңіз жарияланды.",
    "rev.err": "Пікір жіберілмеді. Интернетті тексеріп, қайталап көріңіз.",
    "rev.errName": "Атыңызды жазыңыз",
    "rev.errText": "Пікір кемінде 3 әріптен тұруы керек",
    "rev.latest": "Соңғы пікірлер",
    "rev.all": "Барлық пікірлер",
    "rev.empty": "Әзірге пікір жоқ. Бірінші болып жазыңыз!",
    "rev.off": "Пікірлер уақытша қолжетімсіз.",
    "rev.loadErr": "Пікірлер жүктелмеді. Бетті жаңартып көріңіз.",
    "rev.more": "Тағы көрсету",
    "rev.pageTitle": "Клиенттер пікірі",
    "rev.pageLead": "otdoner туралы қонақтарымыз не дейді. Өз пікіріңізді басты бетте қалдыра аласыз.",
    "rev.leave": "Пікір қалдыру",
    "rev.count": "пікір",

    "contacts.title": "Байланыс",
    "contacts.lead": "Ақтауда төрт филиал. Тапсырысты WhatsApp-қа жазыңыз немесе жақын филиалға келіңіз.",
    "contacts.2gis": "2GIS-те ашу",
    "contacts.openNow": "Қазір ашық",
    "contacts.closed": "Қазір жабық",
    "contacts.whatsapp": "WhatsApp-қа жазу",
    "contacts.instagram": "Instagram",

    "footer.since": "since 2020 · Ақтау",

    "qr.title": "Сайтқа апаратын QR код",
    "qr.lead": "Басып шығарып, кафеге іліңіз. Қонақ сканерлеп, бірден мәзірді ашады.",
    "qr.url": "Сайт мекенжайы",
    "qr.poster1": "Сканерле де,",
    "qr.poster2": "тапсырыс бер",
    "qr.posterSub": "Мәзір · Жеткізу · Пікірлер",
    "qr.print": "Басып шығару",
    "qr.download": "PNG жүктеу",
  },

  ru: {
    "meta.title": "ОТ ДОНЕР — кухня на углях, Актау",
    "nav.menu": "Меню",
    "nav.reviews": "Отзывы",
    "nav.contacts": "Контакты",
    "nav.home": "Главная",
    "cart.open": "Открыть корзину",
    "lang.label": "Язык",

    "hero.title1": "Вкус",
    "hero.title2": "живого огня",
    "hero.sub": "Мясо с живого огня, свежие овощи и фирменный соус. Топовый фаст-фуд Актау: донер, шаурма, пицца, чикен.",
    "hero.cta": "Заказать",
    "hero.clock": "Филиал в ЖК Дукат открыт круглосуточно, круглый год",

    "why.title": "Почему otdoner?",
    "why.1.t": "Без перерыва 24/7",
    "why.1.d": "Филиал в ЖК Дукат работает и ночью, и в праздники.",
    "why.2.t": "Свежий вкус",
    "why.2.d": "Мясо готовим на живом жаре, овощи всегда свежие.",
    "why.3.t": "Быстрая доставка",
    "why.3.d": "Привозим заказ по Актау, пока он горячий.",
    "why.4.t": "Фирменные соусы",
    "why.4.d": "Собственный соус в каждом донере и шаурме.",

    "menu.title": "Меню",
    "menu.add": "Добавить",
    "menu.addAria": "Добавить в корзину",
    "menu.less": "Меньше",
    "menu.more": "Больше",
    "menu.noPhoto": "Фото скоро",
    "menu.size": "Размер",
    "menu.flavor": "Вкус",
    "menu.stopped": "Временно нет",

    "cart.title": "Корзина",
    "cart.empty": "Корзина пуста. Выберите что-нибудь в меню.",
    "cart.toMenu": "Перейти в меню",
    "cart.total": "Итого",
    "cart.checkout": "Оформить заказ",
    "cart.clear": "Очистить",
    "cart.remove": "Удалить",
    "cart.close": "Закрыть",
    "cart.back": "Назад в корзину",
    "cart.items": "поз.",
    "cart.stopRemoved": "Некоторые позиции временно закончились — убраны из корзины.",

    "order.title": "Заказ",
    "order.type": "Способ получения",
    "order.pickup": "Самовывоз",
    "order.delivery": "Доставка",
    "order.branch": "Из какого филиала заберёте",
    "order.branchPh": "Выберите филиал",
    "order.address": "Адрес доставки",
    "order.addressPh": "Микрорайон, дом, квартира",
    "order.name": "Ваше имя",
    "order.namePh": "Например: Айбек",
    "order.phone": "Номер для удалёнки",
    "order.phoneHint": "Номер телефона, с которого будет перевод",
    "order.bank": "Каким банком переведёте",
    "order.date": "Дата",
    "order.time": "Время",
    "order.comment": "Комментарий",
    "order.optional": "необязательно",
    "order.commentPh": "Например: без лука, соус отдельно",
    "order.send": "Отправить в WhatsApp",
    "order.note": "Заказ откроется в WhatsApp готовым сообщением — останется нажать «Отправить».",
    "order.err.branch": "Выберите филиал",
    "order.err.address": "Укажите адрес доставки",
    "order.err.name": "Укажите имя",
    "order.err.phone": "Введите номер полностью: +7 7XX XXX XX XX",
    "order.err.date": "Выберите дату",
    "order.err.time": "Выберите время",
    "order.done.t": "WhatsApp открыт",
    "order.done.d": "Не забудьте отправить сообщение. Менеджер подтвердит заказ и ответит вам.",
    "order.done.again": "Открыть WhatsApp снова",
    "order.done.new": "Очистить корзину",

    "wa.head": "Новый заказ — ОТ ДОНЕР",
    "wa.items": "Позиции",
    "wa.total": "Итого",
    "wa.client": "Клиент",
    "wa.type": "Получение",
    "wa.branch": "Филиал",
    "wa.address": "Адрес",
    "wa.name": "Имя",
    "wa.phone": "Номер для удалёнки",
    "wa.bank": "Банк",
    "wa.date": "Дата",
    "wa.time": "Время",
    "wa.comment": "Комментарий",
    "wa.pcs": "шт",

    "rev.title": "Оставить отзыв",
    "rev.lead": "Понравилось? Напишите пару слов и добавьте фото блюда — отзыв увидят все.",
    "rev.name": "Ваше имя",
    "rev.namePh": "Например: Аружан",
    "rev.text": "Ваш отзыв",
    "rev.textPh": "Что понравилось, что можно улучшить?",
    "rev.photo": "Фото",
    "rev.camera": "Камера",
    "rev.gallery": "Галерея",
    "rev.photoHint": "до 3 фото",
    "rev.removePhoto": "Удалить фото",
    "rev.send": "Отправить отзыв",
    "rev.sending": "Отправляем…",
    "rev.ok": "Спасибо! Отзыв опубликован.",
    "rev.err": "Отзыв не отправился. Проверьте интернет и попробуйте ещё раз.",
    "rev.errName": "Укажите имя",
    "rev.errText": "Отзыв должен быть не короче 3 букв",
    "rev.latest": "Последние отзывы",
    "rev.all": "Все отзывы",
    "rev.empty": "Пока нет отзывов. Будьте первым!",
    "rev.off": "Отзывы временно недоступны.",
    "rev.loadErr": "Отзывы не загрузились. Обновите страницу.",
    "rev.more": "Показать ещё",
    "rev.pageTitle": "Отзывы гостей",
    "rev.pageLead": "Что гости говорят об otdoner. Свой отзыв можно оставить на главной странице.",
    "rev.leave": "Оставить отзыв",
    "rev.count": "отзывов",

    "contacts.title": "Контакты",
    "contacts.lead": "Четыре филиала в Актау. Пишите заказ в WhatsApp или приходите в ближайший.",
    "contacts.2gis": "Открыть в 2GIS",
    "contacts.openNow": "Сейчас открыто",
    "contacts.closed": "Сейчас закрыто",
    "contacts.whatsapp": "Написать в WhatsApp",
    "contacts.instagram": "Instagram",

    "footer.since": "since 2020 · Актау",

    "qr.title": "QR-код на сайт",
    "qr.lead": "Распечатайте и повесьте в кафе. Гость сканирует и сразу открывает меню.",
    "qr.url": "Адрес сайта",
    "qr.poster1": "Сканируй",
    "qr.poster2": "и заказывай",
    "qr.posterSub": "Меню · Доставка · Отзывы",
    "qr.print": "Распечатать",
    "qr.download": "Скачать PNG",
  },
};

const LANG_KEY = "otdoner_lang";

function getLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "kz" || saved === "ru") return saved;
  } catch (e) {}
  return "kz";
}

let LANG = getLang();

function t(key) {
  return (I18N[LANG] && I18N[LANG][key]) || I18N.kz[key] || key;
}

// data.js-тағы {kz, ru} объектісінен мәтін алу
function tr(obj) {
  if (!obj) return "";
  return obj[LANG] || obj.kz || "";
}

function applyI18n(root = document) {
  document.documentElement.lang = LANG === "kz" ? "kk" : "ru";
  root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  const title = document.querySelector("title[data-i18n-title]");
  if (title) title.textContent = t(title.dataset.i18nTitle);
  document.querySelectorAll(".lang__btn").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.lang === LANG));
  });
}

function setLang(lang) {
  LANG = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  applyI18n();
  document.dispatchEvent(new CustomEvent("langchange"));
}

function formatPrice(n) {
  // мыңдықтар арасы мен ₸ алдында бөлінбейтін бос орын — баға екі жолға бөлінбейді
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".lang__btn").forEach((b) => {
    b.addEventListener("click", () => setLang(b.dataset.lang));
  });
  applyI18n();
});
