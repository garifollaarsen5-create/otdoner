// ===== otdoner · мәзір мен филиалдар =====
// Бағаны өзгерту үшін тек price мәнін түзетіңіз.

const CATEGORIES = [
  { id: "new",      kz: "Жаңалықтар", ru: "Новинки",  en: "New" },
  { id: "combo",    kz: "Комбо мен сеттер", ru: "Комбо и сеты", en: "Combos & sets" },
  { id: "doner",    kz: "Донер",      ru: "Донер",    en: "Doner" },
  { id: "shawarma", kz: "Шаурма",     ru: "Шаурма",   en: "Shawarma" },
  { id: "baguette", kz: "Багет",      ru: "Багет",    en: "Baguette" },
  { id: "special",  kz: "Nan Et",     ru: "Nan Et",   en: "Nan Et" },
  { id: "hotdog",   kz: "Хот-дог",    ru: "Хот-дог",  en: "Hot dog" },
  { id: "chicken",  kz: "Чикен",      ru: "Чикен",    en: "Chicken" },
  { id: "snacks",   kz: "Снэктер",    ru: "Снэки",    en: "Snacks" },
  { id: "pizza",    kz: "Пицца",      ru: "Пицца",    en: "Pizza" },
  { id: "drinks",   kz: "Сусындар",   ru: "Напитки",  en: "Drinks" },
];

// Сусын көлемдері
const VOL = {
  s025: { id: "025", kz: "0,25 л", ru: "0,25 л", en: "0.25 L" },
  s05:  { id: "05",  kz: "0,5 л",  ru: "0,5 л",  en: "0.5 L" },
  s1:   { id: "1",   kz: "1 л",    ru: "1 л",    en: "1 L" },
};
const soda = [{ ...VOL.s05, price: 600 }, { ...VOL.s1, price: 700 }];

const MENU = [
  // ---- Донер ----
  {
    id: "doner-chicken", cat: "doner", img: "doner-chicken", price: 1690,
    name: { kz: "Донер тауық етінен", ru: "Донер куриный" },
    desc: {
      kz: "Шырынды тауық еті, қытырлақ фри картобы, балғын көкөністер, фирмалық соус және жұмсақ лаваш.",
      ru: "Сочная курица, хрустящий картофель фри, свежие овощи, фирменный соус и мягкий лаваш.",
    },
  },
  {
    id: "doner-beef", cat: "doner", img: "doner-beef", price: 1790,
    name: { kz: "Донер сиыр етінен", ru: "Донер говяжий" },
    desc: {
      kz: "Шырынды сиыр еті, қытырлақ фри картобы, балғын көкөністер, фирмалық соус және жұмсақ лаваш.",
      ru: "Сочная говядина, хрустящий картофель фри, свежие овощи, фирменный соус и мягкий лаваш.",
    },
  },
  {
    id: "doner-mix", cat: "doner", img: "doner-mix", price: 1790,
    name: { kz: "Донер ассорти", ru: "Донер ассорти" },
    desc: {
      kz: "Тауық пен сиыр етінің үйлесімі, қытырлақ фри картобы, балғын көкөністер, фирмалық соус және жұмсақ лаваш.",
      ru: "Курица и говядина вместе, хрустящий картофель фри, свежие овощи, фирменный соус и мягкий лаваш.",
    },
  },

  // ---- Шаурма ----
  {
    id: "shawarma-chicken", cat: "shawarma", img: "shawarma-chicken", price: 1390,
    name: { kz: "Шаурма тауық етінен", ru: "Шаурма куриная" },
    desc: {
      kz: "Шырынды тауық еті, фри картобы, балғын көкөністер және фирмалық соус тандыр нанында.",
      ru: "Сочная курица, картофель фри, свежие овощи и фирменный соус в тандырной лепёшке.",
    },
  },
  {
    id: "shawarma-beef", cat: "shawarma", img: "shawarma-beef", price: 1490,
    name: { kz: "Шаурма сиыр етінен", ru: "Шаурма говяжья" },
    desc: {
      kz: "Шырынды сиыр еті, фри картобы, балғын көкөністер және фирмалық соус тандыр нанында.",
      ru: "Сочная говядина, картофель фри, свежие овощи и фирменный соус в тандырной лепёшке.",
    },
  },
  {
    id: "shawarma-mix", cat: "shawarma", img: "shawarma-mix", price: 1490,
    name: { kz: "Шаурма ассорти", ru: "Шаурма ассорти" },
    desc: {
      kz: "Тауық пен сиыр еті, фри картобы, балғын көкөністер және фирмалық соус тандыр нанында.",
      ru: "Курица и говядина, картофель фри, свежие овощи и фирменный соус в тандырной лепёшке.",
    },
  },

  // ---- Багет ----
  {
    id: "baguette-chicken", cat: "baguette", img: "baguette-chicken", price: 1690,
    name: { kz: "Багет тауық етінен", ru: "Багет куриный" },
    desc: {
      kz: "Қытырлақ багет, шырынды тауық еті, фри картобы, балғын көкөністер және фирмалық соус.",
      ru: "Хрустящий багет, сочная курица, картофель фри, свежие овощи и фирменный соус.",
    },
  },
  {
    id: "baguette-beef", cat: "baguette", img: "baguette-beef", price: 1790,
    name: { kz: "Багет сиыр етінен", ru: "Багет говяжий" },
    desc: {
      kz: "Қытырлақ багет, шырынды сиыр еті, фри картобы, балғын көкөністер және фирмалық соус.",
      ru: "Хрустящий багет, сочная говядина, картофель фри, свежие овощи и фирменный соус.",
    },
  },
  {
    id: "baguette-mix", cat: "baguette", img: "baguette-mix", price: 1790,
    name: { kz: "Багет ассорти", ru: "Багет ассорти" },
    desc: {
      kz: "Қытырлақ багет, тауық пен сиыр еті, фри картобы, балғын көкөністер және фирмалық соус.",
      ru: "Хрустящий багет, курица и говядина, картофель фри, свежие овощи и фирменный соус.",
    },
  },

  // ---- Nan Et және басқа ----
  {
    id: "nanet", cat: "special", img: "nanet", price: 2390,
    name: { kz: "Nan Et сиыр етінен", ru: "Nan Et говяжий" },
    desc: {
      kz: "Шырынды сиыр еті, барбекю соусы, балғын көкөністер және фирмалық соус қытырлақ нанның ішінде.",
      ru: "Сочная говядина, соус барбекю, свежие овощи и фирменный соус в хрустящем хлебе.",
    },
  },
  {
    id: "bastyrma-chicken", cat: "new", isNew: true, img: "bastyrma", price: 2090,
    name: { kz: "Бастырма тауық етімен", ru: "Бастырма с курицей" },
    desc: null,
  },
  {
    id: "bastyrma-beef", cat: "new", isNew: true, img: "bastyrma", price: 2190,
    name: { kz: "Бастырма сиыр етімен", ru: "Бастырма с говядиной" },
    desc: null,
  },
  {
    id: "green-doner", cat: "new", isNew: true, img: "green-doner", price: 1890,
    name: { kz: "Green Doner", ru: "Green Doner" },
    desc: null,
  },
  {
    id: "twister", cat: "new", isNew: true, img: "twister", price: 1690,
    name: { kz: "Твистер", ru: "Твистер" },
    desc: null,
  },

  // ---- Хот-дог ----
  {
    id: "hotdog-classic", cat: "hotdog", img: "hotdog-classic", price: 890,
    name: { kz: "Хот-дог Классик", ru: "Хот-дог Классик" },
    desc: {
      kz: "Жұмсақ бөлке, сосиска, балғын көкөністер, фирмалық соус, картоп фри және қытырлақ қуырылған пияз.",
      ru: "Мягкая булочка, сосиска, свежие овощи, фирменный соус, картофель фри и хрустящий жареный лук.",
    },
  },
  {
    id: "hotdog-big", cat: "hotdog", img: "hotdog-big", price: 1090,
    name: { kz: "Хот-дог BIG", ru: "Хот-дог BIG" },
    desc: {
      kz: "Екі сосиска, балғын көкөністер, фирмалық соус, картоп фри және қытырлақ қуырылған пияз қосылған үлкен хот-дог.",
      ru: "Большой хот-дог: две сосиски, свежие овощи, фирменный соус, картофель фри и хрустящий жареный лук.",
    },
  },
  {
    id: "hotdog-lavash", cat: "hotdog", img: "hotdog-lavash", photo: true, price: 1190,
    name: { kz: "Лаваш хот-дог", ru: "Хот-дог в лаваше" },
    desc: {
      kz: "4 сосиска, фри картобы, балғын көкөністер және фирмалық соус жұмсақ лавашқа оралған.",
      ru: "4 сосиски, картофель фри, свежие овощи и фирменный соус, завёрнутые в мягкий лаваш.",
    },
  },

  // ---- Чикен ----
  {
    id: "chicken", cat: "chicken", img: "chicken",
    name: { kz: "Чикен", ru: "Чикен" },
    desc: {
      kz: "Сырты алтын түстес қытырлақ, іші жұмсақ әрі шырынды тауық еті.",
      ru: "Золотистая хрустящая корочка, а внутри — нежная и сочная курица.",
    },
    variants: [
      { id: "6",  kz: "6 дана",  ru: "6 шт", en: "6 pcs",  price: 1990 },
      { id: "9",  kz: "9 дана",  ru: "9 шт", en: "9 pcs",  price: 2890 },
      { id: "15", kz: "15 дана", ru: "15 шт", en: "15 pcs", price: 4690 },
      { id: "21", kz: "21 дана", ru: "21 шт", en: "21 pcs", price: 6490 },
    ],
  },

  // ---- Снэктер ----
  {
    id: "fries", cat: "snacks", img: "fries", price: 890,
    name: { kz: "Картоп фри", ru: "Картофель фри" },
    desc: {
      kz: "Алтын түстес, қытырлақ классикалық картоп фри.",
      ru: "Золотистый хрустящий классический картофель фри.",
    },
  },
  {
    id: "wedges", cat: "snacks", img: "wedges", price: 990,
    name: { kz: "Картоп тілімдері", ru: "Картофельные дольки" },
    desc: {
      kz: "Сырты қытырлақ, іші жұмсақ алтын түстес картоп тілімдері.",
      ru: "Золотистые дольки: хрустящие снаружи, мягкие внутри.",
    },
  },
  {
    id: "nuggets", cat: "snacks", img: "nuggets", price: 990,
    name: { kz: "Наггетстер", ru: "Наггетсы" },
    desc: {
      kz: "Алтын түстес қытырлақ қабықтағы жұмсақ тауық еті.",
      ru: "Нежная курица в золотистой хрустящей панировке.",
    },
  },

  // ---- Пицца ----
  {
    id: "pizza-beef", cat: "pizza", img: "pizza-beef", price: 3090,
    name: { kz: "Пицца сиыр етінен", ru: "Пицца говяжья" },
    desc: {
      kz: "Шырынды сиыр еті, моцарелла ірімшігі және фирмалық соус қосылған тойымды пицца.",
      ru: "Сытная пицца с сочной говядиной, моцареллой и фирменным соусом.",
    },
  },
  {
    id: "pizza-chicken", cat: "pizza", img: "pizza-chicken", price: 2990,
    name: { kz: "Пицца тауық етінен", ru: "Пицца куриная" },
    desc: {
      kz: "Жұмсақ тауық еті, моцарелла ірімшігі және фирмалық соус қосылған пицца.",
      ru: "Пицца с нежной курицей, моцареллой и фирменным соусом.",
    },
  },
  {
    id: "pizza-pepperoni", cat: "pizza", img: "pizza-pepperoni", price: 2590,
    name: { kz: "Пепперони", ru: "Пепперони" },
    desc: {
      kz: "Пепперони шұжығы, балқыған моцарелла ірімшігі және фирмалық соус қосылған классикалық пицца.",
      ru: "Классическая пицца с колбасками пепперони, тянущейся моцареллой и фирменным соусом.",
    },
  },
  {
    id: "pizza-margherita", cat: "pizza", img: "pizza-margherita", price: 2290,
    name: { kz: "Маргарита", ru: "Маргарита" },
    desc: {
      kz: "Моцарелла ірімшігі, балғын қызанақ және фирмалық соус қосылған классикалық пицца.",
      ru: "Классическая пицца с моцареллой, свежими томатами и фирменным соусом.",
    },
  },
  {
    id: "pizza-4seasons", cat: "pizza", img: "pizza-4seasons", price: 3090,
    name: { kz: "4 маусым", ru: "4 сезона" },
    desc: {
      kz: "Төрт түрлі дәм бір пиццада: тауық еті, сиыр еті, пепперони, қызанақ, моцарелла ірімшігі және фирмалық соус.",
      ru: "Четыре вкуса в одной пицце: курица, говядина, пепперони, томаты, моцарелла и фирменный соус.",
    },
  },
  {
    // уақытша фото: тауық пиццасы басқа ракурстан (Sweet Chili өз фотосы жоқ)
    id: "pizza-sweet-chili", cat: "pizza", img: "pizza-sweet-chili", price: 2990,
    name: { kz: "Цыплёнок Sweet Chili", ru: "Цыплёнок Sweet Chili" },
    desc: {
      kz: "Тауық еті, моцарелла ірімшігі және тәтті-ащы Sweet Chili соусы қосылған пицца.",
      ru: "Пицца с курицей, моцареллой и сладко-острым соусом Sweet Chili.",
    },
  },

  // ---- Сусындар ----
  { id: "cola",   cat: "drinks", img: "drink-cola",   name: { kz: "Coca-Cola", ru: "Coca-Cola" }, desc: null, variants: soda },
  { id: "fanta",  cat: "drinks", img: "drink-fanta",  name: { kz: "Fanta",     ru: "Fanta" },     desc: null, variants: soda },
  { id: "sprite", cat: "drinks", img: "drink-sprite", name: { kz: "Sprite",    ru: "Sprite" },    desc: null, variants: soda },
  {
    id: "fuse", cat: "drinks", img: "drink-fuse-mango",
    name: { kz: "Fuse tea", ru: "Fuse tea" }, desc: null, variants: soda,
    flavors: [
      { id: "mango",     kz: "Манго-түймедақ", ru: "Манго-ромашка", img: "drink-fuse-mango" },
      { id: "pineapple", kz: "Манго-ананас",   ru: "Манго-ананас",  img: "drink-fuse-pineapple" },
      { id: "peach",     kz: "Шабдалы",        ru: "Персик",        img: "drink-fuse-peach" },
    ],
  },
  {
    id: "piko", cat: "drinks", img: "drink-piko-orange",
    name: { kz: "Piko Pulpy", ru: "Piko Pulpy" }, desc: null,
    variants: [{ ...VOL.s025, price: 400 }, { ...VOL.s05, price: 650 }, { ...VOL.s1, price: 900 }],
    flavors: [
      { id: "orange", kz: "Апельсин",      ru: "Апельсин",         img: "drink-piko-orange" },
      { id: "grape",  kz: "Жүзім-алоэ",    ru: "Виноград-алоэ",    img: "drink-piko-grape" },
    ],
  },
  { id: "ayran", cat: "drinks", img: "drink-ayran", price: 450, name: { kz: "Айран", ru: "Айран" }, desc: null },
  {
    id: "bonaqua", cat: "drinks", img: null,
    name: { kz: "Bon Aqua су", ru: "Вода Bon Aqua" }, desc: null,
    variants: [{ ...VOL.s05, price: 400 }, { ...VOL.s1, price: 500 }],
  },
];

// Жұмыс уақыты: open/close — минутпен (Ақтау уақыты). allDay — тәулік бойы.
const BRANCHES = [
  {
    id: "dukat", pickup: true, allDay: true,
    name: { kz: "ЖК Дукат", ru: "ЖК Дукат", en: "Dukat residence" },
    addr: { kz: "17 шағын аудан, 1", ru: "17 мкр, 1", en: "17 microdistrict, 1" },
    hours: { kz: "Тәулік бойы, демалыссыз", ru: "Круглосуточно, без выходных", en: "Open 24/7" },
    link: "https://2gis.kz/aktau/geo/70000001113214564",
  },
  {
    id: "27", pickup: true, allDay: true,
    name: { kz: "27 шағын аудан", ru: "27 мкр", en: "27 microdistrict" },
    addr: { kz: "27 шағын аудан, 10/1", ru: "27 мкр, 10/1", en: "27 microdistrict, 10/1" },
    hours: { kz: "Тәулік бойы, демалыссыз", ru: "Круглосуточно, без выходных", en: "Open 24/7" },
    link: "https://2gis.kz/aktau/geo/70000001094991910",
  },
  {
    id: "astana",
    name: { kz: "ТРЦ Астана", ru: "ТРЦ Астана", en: "Astana mall" },
    addr: { kz: "14 шағын аудан, 100/5", ru: "14 мкр, 100/5", en: "14 microdistrict, 100/5" },
    hours: { kz: "10:00 – 03:00", ru: "10:00 – 03:00", en: "10:00 – 03:00" },
    open: 10 * 60, close: 3 * 60,
    link: "https://2gis.kz/aktau/geo/70000001094632008",
  },
  {
    id: "28a",
    name: { kz: "28А шағын аудан", ru: "28А мкр", en: "28A microdistrict" },
    addr: { kz: "28А шағын аудан, 9/4", ru: "28А мкр, 9/4", en: "28A microdistrict, 9/4" },
    hours: { kz: "07:00 – 06:00, үзіліс 06:00–07:00", ru: "07:00 – 06:00, перерыв 06:00–07:00", en: "07:00 – 06:00, break 06:00–07:00" },
    open: 7 * 60, close: 6 * 60,
    link: "https://2gis.kz/aktau/geo/70000001047393946",
  },
  {
    id: "aktau",
    name: { kz: "ТРК Актау", ru: "ТРК Актау", en: "Aktau mall" },
    addr: { kz: "16 шағын аудан, 16/4, 1-қабат", ru: "16 мкр, 16/4, 1 этаж", en: "16 microdistrict, 16/4, 1st floor" },
    hours: { kz: "10:00 – 23:00", ru: "10:00 – 23:00", en: "10:00 – 23:00" },
    open: 10 * 60, close: 23 * 60,
    link: "https://2gis.kz/aktau/geo/70000001094632093/51.152436,43.666921",
  },
];

// ---- Ағылшынша атаулар мен сипаттамалар (id бойынша) ----
const EN_MENU = {
  "doner-chicken": ["Chicken doner", "Juicy chicken, crispy fries, fresh vegetables, signature sauce and soft lavash."],
  "doner-beef": ["Beef doner", "Juicy beef, crispy fries, fresh vegetables, signature sauce and soft lavash."],
  "doner-mix": ["Mixed doner", "Chicken and beef together, crispy fries, fresh vegetables, signature sauce and soft lavash."],
  "shawarma-chicken": ["Chicken shawarma", "Juicy chicken, fries, fresh vegetables and signature sauce in tandoor bread."],
  "shawarma-beef": ["Beef shawarma", "Juicy beef, fries, fresh vegetables and signature sauce in tandoor bread."],
  "shawarma-mix": ["Mixed shawarma", "Chicken and beef, fries, fresh vegetables and signature sauce in tandoor bread."],
  "baguette-chicken": ["Chicken baguette", "Crispy baguette, juicy chicken, fries, fresh vegetables and signature sauce."],
  "baguette-beef": ["Beef baguette", "Crispy baguette, juicy beef, fries, fresh vegetables and signature sauce."],
  "baguette-mix": ["Mixed baguette", "Crispy baguette, chicken and beef, fries, fresh vegetables and signature sauce."],
  "nanet": ["Nan Et with beef", "Juicy beef, BBQ sauce, fresh vegetables and signature sauce in crispy bread."],
  "bastyrma-chicken": ["Bastyrma with chicken"],
  "bastyrma-beef": ["Bastyrma with beef"],
  "green-doner": ["Green Doner"],
  "twister": ["Twister"],
  "hotdog-classic": ["Classic hot dog", "Soft bun, sausage, fresh vegetables, signature sauce, fries and crispy fried onions."],
  "hotdog-big": ["BIG hot dog", "A big hot dog: two sausages, fresh vegetables, signature sauce, fries and crispy fried onions."],
  "hotdog-lavash": ["Lavash hot dog", "4 sausages, fries, fresh vegetables and signature sauce wrapped in soft lavash."],
  "chicken": ["Crispy chicken", "Golden crispy crust, tender and juicy chicken inside."],
  "fries": ["French fries", "Golden, crispy classic fries."],
  "wedges": ["Potato wedges", "Golden wedges: crispy outside, soft inside."],
  "nuggets": ["Nuggets", "Tender chicken in a golden crispy coating."],
  "pizza-beef": ["Beef pizza", "A hearty pizza with juicy beef, mozzarella and signature sauce."],
  "pizza-chicken": ["Chicken pizza", "Pizza with tender chicken, mozzarella and signature sauce."],
  "pizza-pepperoni": ["Pepperoni", "Classic pizza with pepperoni, melted mozzarella and signature sauce."],
  "pizza-margherita": ["Margherita", "Classic pizza with mozzarella, fresh tomatoes and signature sauce."],
  "pizza-4seasons": ["Four seasons", "Four flavours in one pizza: chicken, beef, pepperoni, tomatoes, mozzarella and signature sauce."],
  "pizza-sweet-chili": ["Sweet Chili chicken", "Pizza with chicken, mozzarella and sweet chili sauce."],
  "cola": ["Coca-Cola"],
  "fanta": ["Fanta"],
  "sprite": ["Sprite"],
  "fuse": ["Fuse tea"],
  "piko": ["Piko Pulpy"],
  "ayran": ["Ayran"],
  "bonaqua": ["Bon Aqua water"],
};
const EN_FLAVORS = {
  mango: "Mango & chamomile", pineapple: "Mango & pineapple", peach: "Peach",
  orange: "Orange", grape: "Grape & aloe",
};
MENU.forEach((item) => {
  const en = EN_MENU[item.id];
  if (en) {
    item.name.en = en[0];
    if (item.desc && en[1]) item.desc.en = en[1];
  }
  (item.flavors || []).forEach((f) => { if (EN_FLAVORS[f.id]) f.en = EN_FLAVORS[f.id]; });
});

// ---- Жеткізу ----
// Тағам сомасы FREE_DELIVERY_FROM-нан асса, жеткізу тегін (жеткізу бағасы есептелмейді).
const FREE_DELIVERY_FROM = 6000;

// price: null — бағасын менеджер нақтылайды (range болса, соны көрсетеміз)
const mcr = (n, subs, price) => ({
  id: `m${n}`,
  kz: `${n} мкр${subs ? ` (${subs})` : ""}`,
  ru: `${n} мкр${subs ? ` (${subs})` : ""}`,
  en: `Microdistrict ${n}${subs ? ` (${subs})` : ""}`,
  price,
});

const DELIVERY_ZONES = [
  mcr(1, "1а, 1б, 1в", 1000),
  mcr(2, "", 1000),
  mcr(3, "3а, 3б", 900),
  mcr(4, "", 900),
  mcr(5, "5а", 900),
  mcr(6, "", 800),
  mcr(7, "7а", 800),
  mcr(8, "", 800),
  mcr(9, "", 800),
  mcr(10, "", 800),
  mcr(11, "11а", 700),
  mcr(12, "12а", 700),
  mcr(13, "", 700),
  mcr(14, "", 700),
  mcr(15, "", 700),
  mcr(16, "", 700),
  mcr(17, "", 700),
  mcr(18, "18а, 18б", 700),
  mcr(19, "19а", 700),
  mcr(20, "20а", 800),
  mcr(21, "", 800),
  mcr(22, "", 800),
  mcr(23, "", 800),
  mcr(24, "", 800),
  mcr(25, "", 900),
  mcr(26, "", 700),
  mcr(27, "", 700),
  mcr(28, "28а", 700),
  mcr(29, "29а", 800),
  mcr(30, "", 800),
  mcr(31, "31а, 31б", 800),
  mcr(32, "32а, 32б, 32в", 800),
  mcr(33, "", 800),
  mcr(34, "34а", 800),
  mcr(35, "", 900),
  mcr(36, "", 900),
  mcr(37, "", 900),
  { id: "samal",    kz: "Самал",           ru: "Самал",           en: "Samal",            price: 700 },
  { id: "shygys1",  kz: "Шығыс, 1 мкр",    ru: "Шыгыс, 1 мкр",    en: "Shygys, mcr 1",    price: 900 },
  { id: "shygys2",  kz: "Шығыс, 2 мкр",    ru: "Шыгыс, 2 мкр",    en: "Shygys, mcr 2",    price: 900 },
  { id: "shygys3",  kz: "Шығыс, 3 мкр",    ru: "Шыгыс, 3 мкр",    en: "Shygys, mcr 3",    price: 900 },
  { id: "tolkyn1",  kz: "Толқын 1",        ru: "Толкын 1",        en: "Tolkyn 1",         price: null, range: "800–900" },
  { id: "tolkyn2",  kz: "Толқын 2",        ru: "Толкын 2",        en: "Tolkyn 2",         price: null },
  { id: "tolkyn3",  kz: "Толқын 3",        ru: "Толкын 3",        en: "Tolkyn 3",         price: null },
  { id: "other",    kz: "Тізімде жоқ мекенжай", ru: "Другой адрес", en: "Other address", price: null, other: true },
];

// ---- Комбо мен сеттер ----
// set: [id немесе "id:көлем", саны, қосымша белгі] — құрамы мәзірдегі тағамдардан алынады
// gifts: сыйлыққа берілетіндер. «Чикен N дана» үшін: ["chicken-pcs", N]
// Комбоның ескі бағасы (сызылған) құрамының бағасынан автоматты есептеледі.
const SET_EXTRAS = {
  sauce:    { kz: "соус",      ru: "соус",      en: "sauce" },
  jalapeno: { kz: "халапеньо", ru: "халапеньо", en: "jalapeño" },
};

MENU.push(
  {
    id: "combo-chicken", cat: "combo", img: "combo-chicken", price: 2990, showOld: true,
    name: { kz: "Комбо тауық етінен", ru: "Комбо куриный", en: "Chicken combo" },
    set: [["doner-chicken", 1], ["fries", 1, "L"], ["cola:05", 1]],
  },
  {
    id: "combo-beef", cat: "combo", img: "combo-beef", price: 3090, showOld: true,
    name: { kz: "Комбо сиыр етінен", ru: "Комбо говяжий", en: "Beef combo" },
    set: [["doner-beef", 1], ["fries", 1, "L"], ["cola:05", 1]],
  },
  {
    id: "combo-mix", cat: "combo", img: "combo-mix", price: 3090, showOld: true,
    name: { kz: "Комбо ассорти", ru: "Комбо ассорти", en: "Mixed combo" },
    set: [["doner-mix", 1], ["fries", 1, "L"], ["cola:05", 1]],
  },
  {
    id: "set-dostar", cat: "combo", img: "set-dostar", price: 5490, people: "2",
    name: { kz: "«Достар» сеті", ru: "Сет «Достар»", en: "Dostar set" },
    set: [["doner-chicken", 2], ["fries", 2, "L"]],
    gifts: [["cola:1", 1], ["sauce", 2], ["jalapeno", 2]],
  },
  {
    id: "set-chicken", cat: "combo", img: "set-chicken", price: 11290, people: "4–5",
    name: { kz: "«Тауық» сеті", ru: "Сет «Куриный»", en: "Chicken set" },
    set: [["doner-chicken", 4], ["chicken-pcs", 8], ["fries", 2, "L"]],
    gifts: [["cola:1", 1], ["sauce", 2], ["jalapeno", 4]],
  },
  {
    id: "set-assorti", cat: "combo", img: "set-assorti", price: 11290, people: "4–5",
    name: { kz: "«Ассорти» сеті", ru: "Сет «Ассорти»", en: "Mixed set" },
    set: [["doner-chicken", 2], ["doner-beef", 2], ["pizza-pepperoni", 1], ["fries", 2, "L"]],
    gifts: [["cola:1", 1], ["jalapeno", 4], ["sauce", 2]],
  },
  {
    id: "set-otbasy", cat: "combo", img: "set-otbasy", price: 13490, people: "6–7",
    name: { kz: "«Отбасы» сеті", ru: "Сет «Отбасы»", en: "Otbasy family set" },
    set: [["doner-chicken", 3], ["chicken-pcs", 9], ["fries", 3, "L"], ["pizza-pepperoni", 1]],
    gifts: [["cola:1", 2], ["sauce", 5], ["jalapeno", 3]],
  },
  {
    id: "set-dastarkhan", cat: "combo", img: "set-dastarkhan", price: 21390, people: "8–10",
    name: { kz: "«Дастархан» сеті", ru: "Сет «Дастархан»", en: "Dastarkhan feast set" },
    set: [["doner-chicken", 4], ["chicken-pcs", 15], ["pizza-pepperoni", 1], ["pizza-margherita", 1], ["nuggets", 2], ["fries", 3, "L"]],
    gifts: [["cola:1", 3], ["sauce", 5], ["jalapeno", 4]],
  },
);
