import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/* =====================================================================
   SETTINGS (speed)
   ===================================================================== */
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
const PARALLEL_CALLS = 2;      // ek saath 2 calls, jo pehle sahi aaye wahi use hoga
const MAX_ROUNDS = 2;          // sab fail hone par sirf ek aur round
const CALL_TIMEOUT_MS = 12000; // Gemini 12 sec me na de to cancel
const MAX_OUTPUT_TOKENS = 300;
const HISTORY_SIZE = 60;       // server par yaad rakhe gaye pichhle reviews

/* =====================================================================
   BUSINESS PACK  (New Baviskar Jewellers - Chhatrapati Sambhajinagar)
   ===================================================================== */
const OWNER_NAME = process.env.OWNER_NAME || 'Baviskar ji';
const PRODUCT_WORD = 'jewellery';

// Jewellery categories aur items: daily wear aur popular items ka weight zyada hai
// w = us series ka weight, variants = us category ke ornaments
const MODEL_SERIES = [
  { n: 'ring|anguthi|chain', w: 10, variants: [['gold ring', 4], ['gold chain', 3], ['couple rings', 2], ['daily wear ring', 2]] },
  { n: 'mangalsutra|ganthan', w: 10, variants: [['gold mangalsutra', 4], ['short mangalsutra', 3], ['traditional mangalsutra', 2], ['daily wear mangalsutra', 2]] },
  { n: 'earring|jhumka|tops', w: 9, variants: [['gold earrings', 4], ['gold jhumka', 3], ['daily wear tops', 3], ['stud earrings', 2]] },
  { n: 'necklace|haar|ranihar|thushi', w: 8, variants: [['gold necklace', 4], ['traditional ranihar', 2], ['Maharashtrian thushi', 2], ['lightweight necklace', 3]] },
  { n: 'bangle|kangan|patlya|bracelet', w: 7, variants: [['gold bangles', 4], ['gold bracelet', 3], ['traditional patlya', 2], ['daily wear bangles', 2]] },
  { n: 'silver|chandi|payal|idol|gift', w: 8, variants: [['silver payal', 4], ['silver idol for gift', 3], ['silver ornaments', 3], ['silver coin and pooja items', 2]] },
  { n: 'bridal|wedding|set|shadi', w: 6, variants: [['bridal gold set', 3], ['wedding jewellery set', 3], ['nath and traditional set', 2]] },
];

const SEO_KEYWORDS = [
  'best jewellers in Garkheda',
  'jewellery shop in Chhatrapati Sambhajinagar',
  'New Baviskar Jewellers Garkheda',
  '916 hallmark gold in Chhatrapati Sambhajinagar',
  'gold jewellery near Gajanan Maharaj Mandir Road',
  'trusted jewellers in Sambhajinagar',
  'pure gold and silver shop in Garkheda',
  'bridal jewellery in Chhatrapati Sambhajinagar',
  'Maharashtrian traditional jewellery',
  'low making charges gold shop',
  'custom jewellery design in Sambhajinagar',
  'silver ornaments and gift articles',
  'hallmarked gold jewellery Garkheda',
  'best gold rate in Chhatrapati Sambhajinagar',
  'family jeweller in Garkheda',
  'Chaitanya Nagar Garkheda jewellers',
  'pure 22k gold ornaments',
  'latest mangalsutra designs in Sambhajinagar',
  'silver payal and idols shop',
  'honest gold shop near Gajanan Maharaj Mandir',
];

// Topics: id, prompt text, aur check regex (review me in me se koi shabd hona chahiye)
const TOPICS = {
  location: {
    id: 'location',
    text: 'the location: easy to find in Garkheda on Gajanan Maharaj Mandir Road, Chaitanya Nagar, safe and convenient to reach',
    must: /garkheda|mandir|chaitanya|sambhajinagar|location|jagah|rasta|nazdik|paas|easy to find|aasani|area|road/i,
  },
  politeness: {
    id: 'politeness',
    text: 'the behaviour of the owner and staff: polite, patient, showed many designs without hurry, treated with respect',
    must: /staff|behav|polite|patient|samjhaya|dikhaya|baat|nature|pressure|baviskar|respect|attend|owner|pyar/i,
  },
  pricing: {
    id: 'pricing',
    text: 'the making charges and pricing: reasonable making charges, transparent calculation explained clearly, no hidden charges',
    must: /price|rate|daam|paise|deal|budget|making|charge|transparent|sahi|pocket|hisab|hisaab|kimat|value|bill/i,
  },
  quality: {
    id: 'quality',
    text: 'the finishing and quality: neat finishing, strong build, shiny polish, genuine 916 hallmark quality',
    must: /finish|quality|polish|hallmark|916|genuine|original|pure|shuddh|chamak|design|strong|work|kaam/i,
  },
  trust: {
    id: 'trust',
    text: 'trust: honest weight and purity check in front of the customer, proper GST bill, felt completely safe buying gold here',
    must: /trust|honest|bharosa|bill|genuine|original|safe|vishwas|weight|purity|vajan|khara|reliable|family/i,
  },
  purity: {
    id: 'purity',
    text: 'purity: 916 BIS hallmarked gold, purity and weight checked properly in front of him',
    must: /916|hallmark|pure|purity|shuddh|gold|sona|check|weight|vajan|carat|22k|khara/i,
  },
  designs: {
    id: 'designs',
    text: 'the designs and variety: fresh and unique collection, both modern lightweight and traditional Maharashtrian designs available',
    must: /design|variety|collection|pattern|unique|latest|naya|naye|traditional|choice|pasand|options/i,
  },
  silver: {
    id: 'silver',
    text: 'silver ornaments and articles: nice collection of silver payal, rings, pooja items and gift articles at fair rates',
    must: /silver|chandi|payal|gift|idol|murti|coin|ring|item|article/i,
  },
  bridal: {
    id: 'bridal',
    text: 'wedding and bridal jewellery: great collection for marriage shopping, traditional sets, mangalsutra and ranihar',
    must: /bridal|wedding|marriage|shaadi|shadi|set|mangalsutra|ranihar|family|shopping|function/i,
  },
  custom: {
    id: 'custom',
    text: 'custom order design: made a custom piece on order exactly as shown in the photo, delivered on time with neat finishing',
    must: /custom|order|design|photo|banwaya|banaya|time|ready|fitting|exact|finish/i,
  },
  lightweight: {
    id: 'lightweight',
    text: 'lightweight daily wear options: good collection of light weight gold items that fit well within a small budget',
    must: /light|weight|halka|daily|wear|budget|small|pocket|ring|earring|chain|tops|mangalsutra/i,
  },
  exchange: {
    id: 'exchange',
    text: 'old gold exchange: exchanged old gold ornaments for a new design and got fair value without unfair deductions',
    must: /exchange|old|purana|badle|naya|value|rate|deduct|katoti|gold|sona|design/i,
  },
  advice: {
    id: 'advice',
    text: 'honest guidance: the shopkeeper suggested ornaments that suited the budget and occasion, did not push heavy items',
    must: /advice|suggest|guide|salah|budget|samjhaya|batay|sahi|bataya|zaroorat|need|honest/i,
  },
  testing: {
    id: 'testing',
    text: 'transparent weight and calculation: weight on scale, gold rate and making charges were shown clearly before billing',
    must: /weight|vajan|scale|check|dikhaya|front|saamne|samne|hisab|hisaab|rate|bill|clear/i,
  },
};

// Chips = keywords. Customer jo chip dabaye, review me wahi baat aani chahiye.
// text = Gemini ko kya batana hai, must = review me kaun se shabd hone chahiye (check)
const CHIPS = {
  '916 Hallmark Gold': { id: 'chip_purity', text: 'the gold is 916 BIS hallmarked with genuine purity checked properly', must: /916|hallmark|pure|purity|shuddh|gold|sona|khara|22k/i },
  'Unique Designs': { id: 'chip_designs', text: 'they have unique and latest jewellery designs with great variety', must: /design|variety|collection|unique|latest|pattern|pasand|choice/i },
  'Silver Ornaments': { id: 'chip_silver', text: 'he bought silver ornaments or gift articles, great silver collection and finish', must: /silver|chandi|payal|gift|idol|murti|coin|article|item/i },
  'Low Making Charges': { id: 'chip_price', text: 'the making charges were very reasonable and the pricing was transparent', must: /making|charge|price|rate|daam|paise|deal|budget|sahi|hisab|hisaab|value/i },
  'Bridal & Wedding': { id: 'chip_bridal', text: 'he did wedding or bridal jewellery shopping here and loved the traditional sets', must: /bridal|wedding|marriage|shaadi|shadi|set|mangalsutra|ranihar|traditional|function/i },
  'Custom Jewellery': { id: 'chip_models', text: 'he got a specific ornament or custom design made exactly as wanted', must: /design|order|ring|chain|mangalsutra|necklace|earring|bangle/i }, // model/must buildPrompt me set hota hai
  'Pure & Trusted': { id: 'chip_trust', text: 'exact weight on scale, proper bill, honest and trusted family jeweller', must: /trust|honest|bharosa|bill|pure|safe|vishwas|weight|vajan|genuine/i },
  'Old Gold Exchange': { id: 'chip_exchange', text: 'he got a fair value when exchanging old gold for new ornaments', must: /exchange|old|purana|badle|naya|value|rate|gold|sona/i },
  'Polite Staff': { id: 'chip_advice', text: 'the owner and staff were very polite, patient and showed many designs calmly', must: /staff|polite|patient|behav|owner|baviskar|dikhaya|samjhaya|nature|respect|calm/i },
  'Garkheda Location': { id: 'chip_location', text: 'the shop is easy to reach in Garkheda near Gajanan Maharaj Mandir Road', must: /garkheda|mandir|chaitanya|sambhajinagar|location|jagah|rasta|nazdik|paas|easy/i },
};

const ALL_TOPICS = ['location', 'politeness', 'pricing', 'quality', 'trust', 'purity', 'designs', 'silver', 'bridal', 'custom', 'lightweight', 'exchange', 'advice', 'testing'];

// Likhne wale 13 type ke customers (class, umar, andaaz)
const PERSONAS = [
  { id: 'desi', text: 'a simple local person from Chhatrapati Sambhajinagar, speaks plain and rough, short sentences, no fancy words, a little loose grammar is fine' },
  { id: 'family', text: 'a middle class family person doing jewellery shopping, practical and careful with money, talks about family or wife/mother, honest and simple' },
  { id: 'professional', text: 'an educated working professional, polished and clear, well-structured sentences, calm and respectful tone' },
  { id: 'young', text: 'a young customer buying a ring, chain or gift, casual and quick typing style, energetic' },
  { id: 'uncle', text: 'an older respectful person (uncle ji) buying gold for the house or a wedding, polite, simple words, blesses or thanks the jeweller' },
  { id: 'blunt', text: 'a straightforward no-nonsense person, few words, says only what mattered to him about purity and rate' },
  { id: 'lowerclass', text: 'a hardworking person saving money to buy a small gold or silver item, very simple words, short plain sentences, cares about honest weight and low making charges' },
  { id: 'business', text: 'a local business owner who values trust and transparent gold calculation, practical, talks about value for money' },
  { id: 'officer', text: 'a well-off senior person or officer, formal and precise, values 916 hallmark certification and proper billing' },
  { id: 'mother', text: 'a housewife or mother choosing ornaments for her daughter or family, careful about designs and finishing, warm tone' },
  { id: 'firsttimer', text: 'someone visiting this jewellery shop for the first time, was careful about purity and making charges before coming, left happy' },
  { id: 'giftbuyer', text: 'someone buying a gold or silver ornament as a gift for a wedding, birthday or festival, wanted something genuine inside budget' },
  { id: 'detailoriented', text: 'a careful buyer who compares gold rates, making charges and hallmark stamps across shops, writes in a clear matter-of-fact way' },
];

const WRITING_STYLES = [
  'neat spelling and proper grammar',
  'casual WhatsApp-style typing, relaxed',
  'all small letters, casual typing, no capital letters',
  'simple and slightly rough, one tiny spelling slip is fine',
];

const HINGLISH_LEVELS = [
  'mostly Hindi words, only a few English words like gold, design, ring, bill',
  'half Hindi, half English words',
  'Hindi grammar but many common English words mixed in',
];

const OPENERS = [
  'start with the ornament or jewellery item you bought',
  'start with the shop or the Garkheda area',
  'start with the shopkeeper or staff behaviour',
  'start with how happy you or your family feel now',
  'start with the occasion (wedding, festival, gift or daily wear) why you came here',
  'start in the middle of a thought, casually',
  'start with what you were worried about before coming (making charges or purity)',
  'start with the designs or collection you saw',
  'start by saying how you found this shop (maps, family reference or local area)',
  'start with your plain verdict in your own words',
  'start with your budget or the making charges',
  'start with a simple statement about the whole shopping experience',
];

const ENDINGS = [
  'end with a small thanks or blessing',
  'end by saying you would tell friends and relatives',
  'end by saying this is now your permanent family jeweller',
  'end with a short plain remark about the deal or purity',
  'end with one line about how much the family liked the design',
  'just stop naturally after your last point, no wrap-up line',
];

const BUYER_LINES = [
  'You bought it for yourself.',
  'You bought it for your wife or mother.',
  'You bought it for a family wedding or function.',
  'You bought it as a gift.',
  'You bought it for a festival or auspicious occasion.',
];

// Sirf tone samjhane ke liye (copy nahi karna). Koi full stop nahi.
const EXAMPLES = {
  ENGLISH: [
    'Went in with my family to look for a daily wear mangalsutra, they showed plenty of lightweight designs patiently and the making charges were very fair',
    'Bought a gold ring and silver payal from here, weight and 916 hallmark were checked right in front of me, very transparent dealing',
    'Easy to find on Gajanan Maharaj Mandir Road in Garkheda, polite owner and good variety of traditional Maharashtrian jewellery',
    'Ordered a custom necklace design and they made it with neat finishing on time, everyone at home liked the work',
  ],
  HINGLISH: [
    'ghar ki shaadi ke liye gold shopping ki thi yahan se, design kaafi alag aur naye mile, making charges bhi dusri dukaano se sahi lage',
    '916 hallmark sona hai aur vajan bilkul saamne check karke proper bill diya, Garkheda me bharose wali dukaan hai',
    'mummy ke liye kangan aur chandi ki payal li, staff ne bade aaram se saare design dikhaye, koi jaldbazi nahi ki',
    'purana sona dekar naya mangalsutra banwaya, rate aur hisaab ekdum saaf rakha, kaam aur finishing bahut badhiya hai',
  ],
};

/* =====================================================================
   ENGINE  (sab categories me same rahega)
   ===================================================================== */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const i of items) {
    if ((r -= i.w) <= 0) return i;
  }
  return items[0];
}

// Model/Item chunna: pichhle 3 me aaya hua ornament dobara nahi
function pickModel(recentModels) {
  const flat = [];
  for (const sr of MODEL_SERIES) {
    const total = sr.variants.reduce((a, v) => a + v[1], 0);
    for (const [name, vw] of sr.variants) {
      if (recentModels.includes(name)) continue;
      flat.push({ name, series: sr.n, w: sr.w * (vw / total) });
    }
  }
  return pickWeighted(flat);
}

// ~8 words = 1 line on phone
const LENGTHS = [
  { w: 12, lines: 1, min: 7,  max: 11, rule: 'ONE short line, 7 to 10 words' },
  { w: 16, lines: 2, min: 13, max: 21, rule: 'TWO lines, 14 to 20 words' },
  { w: 30, lines: 3, min: 21, max: 31, rule: 'THREE lines, 22 to 30 words' },
  { w: 28, lines: 4, min: 30, max: 42, rule: 'FOUR lines, 32 to 40 words' },
  { w: 14, lines: 5, min: 40, max: 52, rule: 'FIVE lines, 42 to 50 words' },
];

function chooseLength(recent, minLines = 1) {
  const lens = recent.map((r) => r.lines).filter(Boolean);
  const l1 = lens[lens.length - 1];
  const l2 = lens[lens.length - 2];
  const l3 = lens[lens.length - 3];
  let pool = LENGTHS.filter((x) => x.lines >= minLines);

  const mid = (n) => n === 3 || n === 4;
  if (lens.length >= 3 && mid(l1) && mid(l2) && mid(l3)) {
    const f = pool.filter((x) => !mid(x.lines));
    if (f.length) pool = f;
  } else if (l1 && !mid(l1)) {
    const f = pool.filter((x) => mid(x.lines));
    if (f.length) pool = f;
  }
  if (l1 && l1 === l2) {
    const f = pool.filter((x) => x.lines !== l1);
    if (f.length) pool = f;
  }
  return pickWeighted(pool);
}

function choosePersona(recent) {
  const last = recent.map((r) => r.voice).filter(Boolean).slice(-4);
  const pool = PERSONAS.filter((v) => !last.includes(v.id));
  return pick(pool.length ? pool : PERSONAS);
}

function chooseTopic(recent) {
  const last = recent.map((r) => r.topic).filter(Boolean).slice(-2);
  const pool = ALL_TOPICS.filter((t) => !last.includes(t));
  return TOPICS[pick(pool.length ? pool : ALL_TOPICS)];
}

// Customer ne jo chips chune (max 3) unhe nikalo
function chosenChips(body) {
  const labels = Array.isArray(body.selectedChips) ? body.selectedChips : [];
  return labels.filter((l) => typeof l === 'string' && CHIPS[l]).slice(0, 3).map((l) => ({ label: l, ...CHIPS[l] }));
}

function chooseFrom(list, key, recent, n = 3) {
  const last = recent.map((r) => r[key]).filter((v) => v !== undefined && v !== null).slice(-n);
  const pool = list.filter((x) => !last.includes(x));
  return pick(pool.length ? pool : list);
}

const BANNED_OPENINGS = [
  'Great', 'Best', 'Amazing', 'Excellent', 'Highly recommend', 'Bhai', 'Superb', 'Awesome', 'The staff here',
  'Outstanding', 'Fantastic', 'Wonderful', 'Perfect', 'Must visit', 'Trust me',
];

const AI_PHRASES = /seamless|hassle[- ]free|top[- ]notch|look no further|go-to|game[- ]changer|one[- ]stop|unparalleled|exceptional|impeccable|commendable|must[- ]visit|highly recommended|hands down|truly|delighted|kudos|exquisite|craftsmanship|timeless|elegance|—|–/i;

const DANGLING = new Set([
  'to', 'aur', 'ki', 'ke', 'ka', 'se', 'me', 'mein', 'par', 'pe', 'ko', 'toh',
  'and', 'but', 'the', 'a', 'an', 'of', 'in', 'on', 'for', 'with', 'at', 'that',
  'so', 'if', 'or', 'because', 'jo', 'jab', 'agar', 'lekin', 'ya', 'jaise', 'kyunki',
]);

// NOTE: 'the' yahan se hata diya (English me bahut aata hai, galat reject karta tha)
const HINDI_WORDS = new Set([
  'hai', 'hain', 'nahi', 'nahin', 'bahut', 'bohot', 'bhot', 'mera', 'meri', 'mere', 'mujhe', 'hume',
  'aur', 'ki', 'ke', 'ka', 'ko', 'se', 'par', 'pe', 'tha', 'thi', 'kiya', 'mila', 'mil', 'gaya', 'gayi',
  'liya', 'wala', 'wale', 'jo', 'kaafi', 'accha', 'acha', 'achha', 'sach', 'yahan', 'yaha', 'kar', 'karke', 'raha',
  'rahe', 'rahi', 'laga', 'lagi', 'bilkul', 'ekdum', 'sab', 'kuch', 'koi', 'phir', 'fir', 'bhi', 'toh', 'lekin',
  'isliye', 'abhi', 'dekh', 'dekha', 'diya', 'dikhaya', 'samjhaya', 'sahi', 'dukaan', 'dukan', 'aap', 'aapne',
  'paise', 'kam', 'jyada', 'zyada', 'badhiya', 'mast', 'yaar', 'mein', 'yeh', 'ye', 'woh', 'wo', 'ne', 'hu', 'hun', 'tak', 'wahan', 'sabse',
  'sona', 'chandi', 'vajan', 'banwaya', 'dikha', 'ghar', 'shaadi',
]);

/* ------------------ yaadasht (server par, best-effort) ------------------ */
const HISTORY = []; // { open, ws }
const HITS = new Map(); // ip -> [timestamps]

const openingOf = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
const wordSet = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2));

function tooSimilar(text, recentOpenings) {
  const open = openingOf(text);
  if (recentOpenings.includes(open)) return true;
  const ws = wordSet(text);
  for (const h of HISTORY) {
    if (h.open === open) return true;
    let inter = 0;
    for (const w of ws) if (h.ws.has(w)) inter++;
    const union = ws.size + h.ws.size - inter || 1;
    if (inter / union > 0.45) return true;
  }
  return false;
}

function remember(text) {
  HISTORY.push({ open: openingOf(text), ws: wordSet(text) });
  while (HISTORY.length > HISTORY_SIZE) HISTORY.shift();
}

function rateLimited(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const arr = (HITS.get(ip) || []).filter((t) => now - t < 5 * 60 * 1000);
  arr.push(now);
  HITS.set(ip, arr);
  if (HITS.size > 2000) {
    for (const [k, v] of HITS) if (!v.some((t) => now - t < 5 * 60 * 1000)) HITS.delete(k);
  }
  return arr.length > 25; // 5 minute me 25 se zyada nahi
}

/* ------------------ safai aur checks ------------------ */
function cleanReview(text) {
  return text
    .replace(/^["'`\s]+|["'`\s]+$/g, '')
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.{2,}/g, ' ')
    .replace(/\.\s+/g, ', ')
    .replace(/\.+$/g, '')
    .replace(/,\s*,/g, ',')
    .trim();
}

// Adhoora ending ho to dobara Gemini ko bulane ke bajaye code se kaat do
function fixCutOff(text) {
  let parts = text.trim().replace(/[,\-\s]+$/g, '').split(/\s+/);
  while (parts.length > 6) {
    const last = parts[parts.length - 1].toLowerCase().replace(/[^a-z]/g, '');
    if (!DANGLING.has(last)) break;
    parts.pop();
    parts = parts.join(' ').replace(/[,\-\s]+$/g, '').split(/\s+/);
  }
  return parts.join(' ');
}

function looksCutOff(text) {
  const last = text.split(/\s+/).pop().toLowerCase().replace(/[^a-z]/g, '');
  return DANGLING.has(last) || /[,\-]$/.test(text.trim());
}

function hindiCount(text) {
  return text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter((w) => HINDI_WORDS.has(w)).length;
}

function languageOk(text, language, words) {
  const h = hindiCount(text);
  if (language === 'HINGLISH') return h >= Math.max(3, Math.floor(words * 0.2));
  return h <= 2;
}

function startsBanned(text) {
  const t = text.trim().toLowerCase();
  return BANNED_OPENINGS.some((b) => t.startsWith(b.toLowerCase()));
}

/* ------------------ Gemini ko jaane wali command ------------------ */
function buildPrompt(body, recent) {
  const language = body.language === 'HINGLISH' ? 'HINGLISH' : 'ENGLISH';
  const businessName = String(body.businessName || 'New Baviskar Jewellers').slice(0, 120);
  const category = String(body.category || 'Jewellery Store').slice(0, 200);
  const description = String(body.description || '916 BIS Hallmarked Gold, Silver Ornaments, Bridal & Traditional Maharashtrian Jewellery in Garkheda, Chhatrapati Sambhajinagar').slice(0, 600);
  const city = String(body.city || 'Chhatrapati Sambhajinagar').slice(0, 120);

  const recentModels = recent.map((r) => r.model).filter(Boolean).slice(-3);
  let chips = chosenChips(body);
  const hasModelChip = chips.some((c) => c.id === 'chip_models');
  const picked = hasModelChip || chance(0.45) ? pickModel(recentModels) : null;
  const model = picked ? picked.name : null;
  if (hasModelChip && picked) {
    chips = chips.map((c) =>
      c.id === 'chip_models'
        ? { ...c, text: `he bought or ordered a ${picked.name} with neat finishing`, must: new RegExp(picked.series, 'i') }
        : c
    );
  }
  const minLines = chips.length >= 3 ? 4 : chips.length === 2 ? 3 : 1;
  const length = chooseLength(recent, minLines);
  const persona = choosePersona(recent);
  const topic = chips.length
    ? { id: chips[0].id, text: chips[0].text, must: chips[0].must }
    : chooseTopic(recent);
  const extraChips = chips.slice(1);
  const opener = chooseFrom(OPENERS, 'opener', recent, 3);
  const ending = chooseFrom(ENDINGS, 'ending', recent, 2);
  const style = pick(WRITING_STYLES);
  const hinglishLevel = pick(HINGLISH_LEVELS);
  const buyerLine = chance(0.5) ? pick(BUYER_LINES) + ' ' : '';

  const longEnough = length.lines >= 3;
  const secondPoint = !extraChips.length && length.lines >= 4 && chance(0.5);
  const mentionName = chance(0.4);
  const mentionStaff = topic.id === 'politeness' ? chance(0.5) : chance(0.15);
  const useEmoji = chance(0.08);

  const recentSeo = recent.map((r) => r.seo).filter(Boolean).slice(-8);
  const seoPool = SEO_KEYWORDS.filter((k) => !recentSeo.includes(k));
  const seo = chance(0.3) ? pick(seoPool.length ? seoPool : SEO_KEYWORDS) : null;

  const languageBlock =
    language === 'HINGLISH'
      ? `LANGUAGE (MOST IMPORTANT): Write in HINGLISH = Hindi sentences typed in English/Roman letters, like an Indian customer on WhatsApp. Level: ${hinglishLevel}. Grammar must be Hindi (hai, tha, kiya, mila, nahi, bahut, aur, ke liye, wala etc.). Jewellery terms and keywords can stay in English. Never write a full English sentence. Never use Devanagari.`
      : `LANGUAGE (MOST IMPORTANT): Write in simple natural English like an Indian customer. Do not use Hindi words.`;

  const examples = shuffle(EXAMPLES[language]).slice(0, 3).map((e) => `- ${e}`).join('\n');

  const prompt = `${languageBlock}

You are ${persona.text}. ${buyerLine}You bought ${PRODUCT_WORD} from this shop and are writing a Google Maps review.
Business: ${businessName} (${city}) | ${category}
About: ${description}

Tone samples from other customers (only for feel, never copy words or structure):
${examples}

THIS REVIEW:
- Main topic: ${topic.text}. The review must clearly be about this.
${extraChips.length ? `- ALSO naturally cover these points (all of them): ${extraChips.map((c) => c.text).join('; ')}.` : secondPoint ? '- You may add one small extra point at the end, from any other area.' : '- Stick to the main topic only.'}
- Writing style: ${style}.
- Opening: ${opener}.
${longEnough ? `- Ending: ${ending}.` : ''}
- Length: ${length.rule}. Stay inside this range.
${mentionName ? `- Mention the shop name "${businessName}" once, naturally.` : '- Do not repeat the full shop name.'}
${seo ? `- If it fits naturally, include the phrase "${seo}".` : ''}
${model ? (hasModelChip ? `- Mention ${model} by name.` : `- You may mention ${model}.`) : ''}
${mentionStaff ? `- Mention the owner/staff "${OWNER_NAME}" once, naturally.` : '- Do not name any person.'}
${useEmoji ? '- One emoji at the very end is allowed.' : '- No emojis.'}

HARD RULES:
- ONE single paragraph. No line breaks, bullets or title.
- Do NOT use a full stop (.) anywhere. Use commas, "aur"/"and", or just flow.
- Never start with: ${BANNED_OPENINGS.join(', ')}.
- Sound like a real customer, not an advertisement. No hashtags, slogans, keyword stuffing, no dashes. Avoid polished marketing words (seamless, hassle-free, top-notch, exceptional, exquisite, craftsmanship, timeless).
- Do not invent facts: only talk about what the main topic says. No other market names, no exact gold prices in rupees, no fake discount numbers.
- Do not use the word "wholesale".
- End with a COMPLETE thought. Never stop mid-sentence.
- Output only the review text.`.replace(/\n{3,}/g, '\n\n').replace(/\n\n(- )/g, '\n$1');

  return { prompt, length, persona, topic, extraChips, opener, ending, seo, model, language };
}

async function callGemini(apiKey, payload, signal) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    }
  );
  const data = await res.json();
  return { res, data };
}

/* ------------------ ek koshish: likhwao + check karo ------------------ */
async function attempt(apiKey, body, recent, signal) {
  const built = buildPrompt(body, recent);
  const { prompt, length, persona, topic, extraChips, opener, ending, seo, model, language } = built;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: `Write the review for ${body.businessName || 'New Baviskar Jewellers'} now.` }] }],
    systemInstruction: { parts: [{ text: prompt }] },
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  try {
    let { res, data } = await callGemini(apiKey, payload, signal);

    if (!res.ok && /thinking/i.test(data?.error?.message || '')) {
      delete payload.generationConfig.thinkingConfig;
      ({ res, data } = await callGemini(apiKey, payload, signal));
    }
    if (!res.ok) return { ok: false, error: data?.error?.message || 'Gemini API request failed.' };

    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const raw = parts.filter((p) => !p.thought).map((p) => p.text || '').join('');
    const review = fixCutOff(cleanReview(raw));
    const words = review.split(/\s+/).filter(Boolean).length;

    if (!review) return { ok: false, error: 'Empty response from Gemini.' };
    if (candidate?.finishReason === 'MAX_TOKENS') return { ok: false, error: 'Response was cut off.' };
    if (looksCutOff(review)) return { ok: false, error: 'Review ended mid-sentence.' };
    if (words > length.max + 8) return { ok: false, error: 'Review too long.' };
    if (words < Math.floor(length.min * 0.75)) return { ok: false, error: 'Review too short.' };
    if (/[ऀ-ॿ]/.test(review)) return { ok: false, error: 'Devanagari used.' };
    if (/wholesale/i.test(review)) return { ok: false, error: 'Banned word used.' };
    if (AI_PHRASES.test(review)) return { ok: false, error: 'Robotic phrase used.' };
    if (startsBanned(review)) return { ok: false, error: 'Banned opening used.' };
    if (!languageOk(review, language, words)) return { ok: false, error: 'Wrong language style.' };
    if (!topic.must.test(review)) return { ok: false, error: 'Review missed the selected topic.' };
    if (extraChips.some((c) => !c.must.test(review))) return { ok: false, error: 'Review missed a selected keyword.' };
    const recentOpenings = recent.map((r) => r.open).filter(Boolean);
    if (tooSimilar(review, recentOpenings)) return { ok: false, error: 'Too similar to an earlier review.' };

    return {
      ok: true,
      review,
      meta: {
        lines: length.lines,
        voice: persona.id,
        topic: topic.id,
        opener,
        ending,
        seo: seo || null,
        model: model || null,
        open: openingOf(review),
      },
    };
  } catch (e) {
    return { ok: false, error: e?.name === 'AbortError' ? 'aborted' : e?.message || 'Request failed.', aborted: e?.name === 'AbortError' };
  }
}

// Jo pehle sahi result de, wahi lo
function firstValid(tasks) {
  return new Promise((resolve) => {
    let pending = tasks.length;
    let firstError = null;
    for (const t of tasks) {
      t.then((r) => {
        if (r.ok) return resolve(r);
        if (!r.aborted && !firstError) firstError = r.error;
        if (--pending === 0) resolve({ ok: false, error: firstError || 'Failed to generate review draft.' });
      });
    }
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key not configured.' }, { status: 500 });
    }
    if (rateLimited(request)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const recent = (Array.isArray(body.recentLengths) ? body.recentLengths : [])
      .filter((r) => r && typeof r === 'object')
      .slice(-6);

    let lastError = 'Failed to generate review draft.';

    for (let round = 0; round < MAX_ROUNDS; round++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);

      const winner = await firstValid(
        Array.from({ length: PARALLEL_CALLS }, () => attempt(apiKey, body, recent, controller.signal))
      );

      clearTimeout(timer);
      controller.abort(); // bacha hua dusra call band

      if (winner.ok) {
        remember(winner.review);
        return NextResponse.json({ review: winner.review, meta: winner.meta });
      }
      lastError = winner.error;
    }

    throw new Error(lastError);
  } catch (error) {
    console.error('API Review Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate review draft.' },
      { status: 500 }
    );
  }
}
