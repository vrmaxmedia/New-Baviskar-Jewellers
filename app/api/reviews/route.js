import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/* =====================================================================
   SETTINGS (Cost Optimized, Fast & Hard-Locked Model)
   ===================================================================== */
const MODEL = 'gemini-3.5-flash-lite'; // Hard-locked: sabse fast aur sasta model
const MAX_ROUNDS = 2;                   // 1 single call; fail hone par sirf 1 retry round
const CALL_TIMEOUT_MS = 12000;          // 12 second timeout
const MAX_OUTPUT_TOKENS = 480;          // 2 to 8 lines ke liye exact token cap
const HISTORY_SIZE = 120;               // Server memory: pichhle 120 reviews track honge
const RECENT_WINDOW = 25;               // Lagatar 25-50 reviews me pattern repeat nahi hoga

/* =====================================================================
   BUSINESS PACK  (Client: New Baviskar Jewellers - Chhatrapati Sambhajinagar)
   ===================================================================== */
const OWNER_NAME = process.env.OWNER_NAME || 'Baviskar ji';
const PRODUCT_WORD = 'jewellery';

// Jewellery categories aur items: daily wear aur popular items ka weight zyada hai
const MODEL_SERIES = [
  { n: 'ring|anguthi|chain',            w: 10, variants: [['gold ring', 4], ['gold chain', 3], ['couple rings', 2], ['daily wear ring', 2]] },
  { n: 'mangalsutra|ganthan',           w: 10, variants: [['gold mangalsutra', 4], ['short mangalsutra', 3], ['traditional mangalsutra', 2], ['daily wear mangalsutra', 2]] },
  { n: 'earring|jhumka|tops',           w: 9,  variants: [['gold earrings', 4], ['gold jhumka', 3], ['daily wear tops', 3], ['stud earrings', 2]] },
  { n: 'necklace|haar|ranihar|thushi',  w: 8,  variants: [['gold necklace', 4], ['traditional ranihar', 2], ['Maharashtrian thushi', 2], ['lightweight necklace', 3]] },
  { n: 'bangle|kangan|patlya|bracelet', w: 7,  variants: [['gold bangles', 4], ['gold bracelet', 3], ['traditional patlya', 2], ['daily wear bangles', 2]] },
  { n: 'silver|chandi|payal|idol|gift', w: 8,  variants: [['silver payal', 4], ['silver idol for gift', 3], ['silver ornaments', 3], ['silver coin and pooja items', 2]] },
  { n: 'bridal|wedding|set|shadi',      w: 6,  variants: [['bridal gold set', 3], ['wedding jewellery set', 3], ['nath and traditional set', 2]] },
];

// Local SEO Keywords (Har review me ek alag keyword naturally inject hoga)
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

const KEYWORD_PLACEMENTS = [
  'in the first half of the review (never as the very first words)',
  'somewhere naturally in the middle of the review',
  'near the end of the review',
  'wherever it blends most naturally into a sentence',
];

// Topics: id, prompt text, aur check regex
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
    text: 'purity: 916 BIS hallmarked gold, purity and weight checked properly in front of the customer',
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

// Frontend page.js ke exact chip labels (bilkul same)
const CHIPS = {
  '916 Hallmark Gold': { id: 'chip_purity', text: 'the gold is 916 BIS hallmarked with genuine purity checked properly', must: /916|hallmark|pure|purity|shuddh|gold|sona|khara|22k/i },
  'Unique Designs': { id: 'chip_designs', text: 'they have unique and latest jewellery designs with great variety', must: /design|variety|collection|unique|latest|pattern|pasand|choice/i },
  'Silver Ornaments': { id: 'chip_silver', text: 'bought silver ornaments or gift articles, great silver collection and finish', must: /silver|chandi|payal|gift|idol|murti|coin|article|item/i },
  'Low Making Charges': { id: 'chip_price', text: 'the making charges were very reasonable and the pricing was transparent', must: /making|charge|price|rate|daam|paise|deal|budget|sahi|hisab|hisaab|value/i },
  'Bridal & Wedding': { id: 'chip_bridal', text: 'did wedding or bridal jewellery shopping here and loved the traditional sets', must: /bridal|wedding|marriage|shaadi|shadi|set|mangalsutra|ranihar|traditional|function/i },
  'Custom Jewellery': { id: 'chip_models', text: 'got a specific ornament or custom design made exactly as wanted', must: /design|order|ring|chain|mangalsutra|necklace|earring|bangle/i },
  'Pure & Trusted': { id: 'chip_trust', text: 'exact weight on scale, proper bill, honest and trusted family jeweller', must: /trust|honest|bharosa|bill|pure|safe|vishwas|weight|vajan|genuine/i },
  'Old Gold Exchange': { id: 'chip_exchange', text: 'got a fair value when exchanging old gold for new ornaments', must: /exchange|old|purana|badle|naya|value|rate|gold|sona/i },
  'Polite Staff': { id: 'chip_advice', text: 'the owner and staff were very polite, patient and showed many designs calmly', must: /staff|polite|patient|behav|owner|baviskar|dikhaya|samjhaya|nature|respect|calm/i },
  'Garkheda Location': { id: 'chip_location', text: 'the shop is easy to reach in Garkheda near Gajanan Maharaj Mandir Road', must: /garkheda|mandir|chaitanya|sambhajinagar|location|jagah|rasta|nazdik|paas|easy/i },
};

const ALL_TOPICS = [
  'location', 'politeness', 'pricing', 'quality', 'trust', 'purity', 'designs',
  'silver', 'bridal', 'custom', 'lightweight', 'exchange', 'advice', 'testing',
];

// Socio-Economic Class Matrix (Upper, Middle, Mass diversity)
const PERSONAS = [
  { id: 'desi', cls: 'mass', text: 'a simple local person from Chhatrapati Sambhajinagar, speaks plain and rough, short sentences, no fancy words, a little loose grammar is fine' },
  { id: 'family', cls: 'middle', text: 'a middle class family person doing jewellery shopping, practical and careful with money, talks about family or wife/mother, honest and simple' },
  { id: 'professional', cls: 'upper', text: 'an educated working professional, polished and clear, well-structured sentences, calm and respectful tone' },
  { id: 'young', cls: 'mass', text: 'a young customer buying a ring, chain or gift, casual and quick typing style, energetic' },
  { id: 'uncle', cls: 'middle', text: 'an older respectful person (uncle ji) buying gold for the house or a wedding, polite, simple words, blesses or thanks the jeweller from the heart' },
  { id: 'blunt', cls: 'mass', text: 'a straightforward no-nonsense person, few words, says only what mattered about purity and rate' },
  { id: 'lowerclass', cls: 'mass', text: 'a hardworking person saving money to buy a small gold or silver item, very simple words, short plain sentences, cares about honest weight and low making charges' },
  { id: 'business', cls: 'middle', text: 'a local business owner who values trust and transparent gold calculation, practical, talks about value for money' },
  { id: 'officer', cls: 'upper', text: 'a well-off senior person or officer, formal and precise, values 916 hallmark certification and proper billing' },
  { id: 'mother', cls: 'middle', text: 'a housewife or mother choosing ornaments for her daughter or family, careful about designs and finishing, warm tone' },
  { id: 'firsttimer', cls: 'middle', text: 'someone visiting this jewellery shop for the first time, was careful about purity and making charges before coming, left genuinely happy' },
  { id: 'giftbuyer', cls: 'middle', text: 'someone buying a gold or silver ornament as a gift for a wedding, birthday or festival, wanted something genuine inside budget' },
  { id: 'detailoriented', cls: 'upper', text: 'a careful buyer who compares gold rates, making charges and hallmark stamps across shops, writes in a clear matter-of-fact way' },
];

const WRITING_STYLES = [
  'neat spelling and proper grammar',
  'casual WhatsApp-style typing, relaxed',
  'all small letters, casual typing, no capital letters',
  'simple and direct everyday typing',
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

// Middle-Part Story Diversity: beech ka flow har review me alag rahe
const MIDDLE_FLOWS = [
  'describe how patiently the staff showed multiple lightweight and traditional designs without any hurry',
  'mention how transparently the exact weight on the scale, gold rate and making charges were explained before billing',
  'highlight the neat finishing, shine and genuine 916 BIS hallmark quality of the ornament',
  'share a quick contrast: compared making charges at two or three other shops, and found the most honest deal here',
  'focus on family trust: everyone at home liked the design and felt completely safe buying gold here',
  'talk about how smoothly old gold exchange or custom order sizing was handled on time',
];

const ENDINGS = [
  'end with a small heartfelt thanks or blessing',
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

// 2 crisp tone samples per language (input tokens bachane ke liye concise rakha hai)
const EXAMPLES = {
  ENGLISH: [
    'Went in with my family to look for a daily wear mangalsutra, they showed plenty of lightweight designs patiently and the making charges were very fair.',
    'Bought a gold ring and silver payal from here, weight and 916 hallmark were checked right in front of me, very transparent dealing',
  ],
  HINGLISH: [
    'ghar ki shaadi ke liye gold shopping ki thi yahan se, design kaafi alag aur naye mile, making charges bhi dusri dukaano se sahi lage.',
    '916 hallmark sona hai aur vajan bilkul saamne check karke proper bill diya, Garkheda me bharose wali dukaan hai',
  ],
};

/* =====================================================================
   ENGINE  (Locked Core Engine)
   ===================================================================== */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const countWords = (t) => t.split(/\s+/).filter(Boolean).length;

function pickWeighted(items) {
  const total = items.reduce((s, i) => s + i.w, 0);
  let r = Math.random() * total;
  for (const i of items) {
    if ((r -= i.w) <= 0) return i;
  }
  return items[0];
}

function pickModel(recentModels) {
  const flat = [];
  for (const sr of MODEL_SERIES) {
    const total = sr.variants.reduce((a, v) => a + v[1], 0);
    for (const [name, vw] of sr.variants) {
      if (recentModels.includes(name)) continue;
      flat.push({ name, series: sr.n, w: sr.w * (vw / total) });
    }
  }
  return pickWeighted(flat.length ? flat : [{ name: MODEL_SERIES[0].variants[0][0], series: MODEL_SERIES[0].n, w: 1 }]);
}

/* ---- 60-20-20 Weighted Random Length System (2 to 8 Lines) ----
   - 20% Short  (2 to 3 lines) -> w: 10 + 10 = 20
   - 60% Medium (4 to 5 lines) -> w: 32 + 28 = 60
   - 20% Long   (6 to 8 lines) -> w: 9 + 7 + 4 = 20
   Pichhle 2 reviews ki exact line count repeat nahi hogi. */
const LENGTHS = [
  { w: 10, lines: 2, min: 13, max: 21, rule: 'TWO lines, about 14 to 20 words' },
  { w: 10, lines: 3, min: 21, max: 31, rule: 'THREE lines, about 22 to 30 words' },
  { w: 32, lines: 4, min: 30, max: 42, rule: 'FOUR lines, about 32 to 40 words' },
  { w: 28, lines: 5, min: 40, max: 54, rule: 'FIVE lines, about 42 to 52 words' },
  { w: 9,  lines: 6, min: 50, max: 66, rule: 'SIX lines, about 52 to 64 words' },
  { w: 7,  lines: 7, min: 58, max: 78, rule: 'SEVEN lines, about 60 to 75 words' },
  { w: 4,  lines: 8, min: 66, max: 90, rule: 'EIGHT lines, about 68 to 86 words' },
];

function chooseLength(recent, minLines = 2) {
  const lastTwo = recent.map((r) => r.lines).filter(Boolean).slice(-2);
  let pool = LENGTHS.filter((x) => x.lines >= minLines);

  const fresh = pool.filter((x) => !lastTwo.includes(x.lines));
  if (fresh.length) pool = fresh;

  return pickWeighted(pool);
}

function choosePersona(recent) {
  const lastVoices = recent.map((r) => r.voice).filter(Boolean).slice(-12);
  const lastClass = recent.map((r) => r.cls).filter(Boolean).slice(-2);

  let pool = PERSONAS.filter((v) => !lastVoices.includes(v.id));
  if (lastClass.length === 2 && lastClass[0] === lastClass[1]) {
    const diffClass = pool.filter((v) => v.cls !== lastClass[1]);
    if (diffClass.length) pool = diffClass;
  }
  return pick(pool.length ? pool : PERSONAS);
}

function chooseTopic(recent) {
  const last = recent.map((r) => r.topic).filter(Boolean).slice(-12);
  const pool = ALL_TOPICS.filter((t) => !last.includes(t));
  return TOPICS[pick(pool.length ? pool : ALL_TOPICS)];
}

// Customer ne jo chips chune unhe random order me shuffle karke lo
function chosenChips(body) {
  const labels = Array.isArray(body.selectedChips) ? body.selectedChips : [];
  const valid = labels.filter((l) => typeof l === 'string' && CHIPS[l]).slice(0, 3);
  return shuffle(valid).map((l) => ({ label: l, ...CHIPS[l] }));
}

function chooseFrom(list, key, recent, n = 8) {
  const last = recent.map((r) => r[key]).filter((v) => v !== undefined && v !== null).slice(-n);
  const pool = list.filter((x) => !last.includes(x));
  return pick(pool.length ? pool : list);
}

const SERVER_KWS = [];

function chooseKeyword(recent) {
  let used = recent.map((r) => r.seo).filter(Boolean).slice(-16);
  if (!used.length) used = SERVER_KWS.slice(-16);
  const pool = SEO_KEYWORDS.filter((k) => !used.includes(k));
  return pick(pool.length ? pool : SEO_KEYWORDS);
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

const HINDI_WORDS = new Set([
  'hai', 'hain', 'nahi', 'nahin', 'bahut', 'bohot', 'bhot', 'mera', 'meri', 'mere', 'mujhe', 'hume',
  'aur', 'ki', 'ke', 'ka', 'ko', 'se', 'par', 'pe', 'tha', 'thi', 'kiya', 'mila', 'mil', 'gaya', 'gayi',
  'liya', 'wala', 'wale', 'jo', 'kaafi', 'accha', 'acha', 'achha', 'sach', 'yahan', 'yaha', 'kar', 'karke', 'raha',
  'rahe', 'rahi', 'laga', 'lagi', 'bilkul', 'ekdum', 'sab', 'kuch', 'koi', 'phir', 'fir', 'bhi', 'toh', 'lekin',
  'isliye', 'abhi', 'dekh', 'dekha', 'diya', 'dikhaya', 'samjhaya', 'sahi', 'dukaan', 'dukan', 'aap', 'aapne',
  'paise', 'kam', 'jyada', 'zyada', 'badhiya', 'mast', 'yaar', 'mein', 'yeh', 'ye', 'woh', 'wo', 'ne', 'hu', 'hun', 'tak', 'wahan', 'sabse',
  'sona', 'chandi', 'vajan', 'banwaya', 'dikha', 'ghar', 'shaadi',
]);

const KW_STOP_WORDS = new Set(['jewellers', 'jewellery', 'shop', 'in', 'garkheda', 'chhatrapati', 'sambhajinagar', 'best', 'near', 'and', 'for', 'gold']);

/* ------------------ Memory & 50-Review Anti-Repetition ------------------ */
const HISTORY = [];
const HITS = new Map();

const openingOf = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
const wordSet = (t) =>
  new Set(
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !KW_STOP_WORDS.has(w))
  );

function tooSimilar(text, recentOpenings) {
  const open = openingOf(text);
  if (recentOpenings.includes(open)) return true;
  const ws = wordSet(text);
  for (const h of HISTORY) {
    if (h.open === open) return true;
    if (ws.size < 7 || h.ws.size < 7) continue;
    let inter = 0;
    for (const w of ws) if (h.ws.has(w)) inter++;
    const union = ws.size + h.ws.size - inter || 1;
    if (inter / union > 0.36) return true; // Strict 36% similarity limit across last 120 reviews
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
  return arr.length > 35;
}

/* ------------------ Auto-Repair & Cleaning Pipeline ------------------ */
function scrubRobotic(text) {
  const startedUpper = /^[A-Z]/.test(text);
  let t = text
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\btruly\s+/gi, '')
    .replace(/\bseamless(ly)?\b/gi, (m, ly) => (ly ? 'smoothly' : 'smooth'))
    .replace(/\bhassle[- ]free\b/gi, 'easy')
    .replace(/\btop[- ]notch\b/gi, 'very good')
    .replace(/\bexceptional(ly)?\b/gi, (m, ly) => (ly ? 'very' : 'very good'))
    .replace(/\bimpeccabl(e|y)\b/gi, (m, e) => (e === 'y' ? 'very well' : 'very good'))
    .replace(/\bcommendable\b/gi, 'good')
    .replace(/\bunparalleled\b/gi, 'very good')
    .replace(/\bgo-to\b/gi, 'favourite')
    .replace(/\bgame[- ]changer\b/gi, 'big plus')
    .replace(/\bone[- ]stop\b/gi, 'complete')
    .replace(/\bmust[- ]visit\b/gi, 'worth visiting')
    .replace(/\bhighly recommended\b/gi, 'recommended')
    .replace(/\bhands down,?\s*/gi, '')
    .replace(/\bdelighted\b/gi, 'happy')
    .replace(/\bexquisite\b/gi, 'beautiful')
    .replace(/\bcraftsmanship\b/gi, 'finishing')
    .replace(/\btimeless\b/gi, 'classic')
    .replace(/\belegance\b/gi, 'look')
    .replace(/\bkudos( to)?\b/gi, (m, to) => (to ? 'thanks to' : 'thanks'));
  t = t.replace(/\s{2,}/g, ' ').replace(/\s+([.,])/g, '$1').trim();
  if (startedUpper && /^[a-z]/.test(t)) t = t[0].toUpperCase() + t.slice(1);
  return t;
}

function cleanReview(text, useFullStop) {
  let t = text
    .replace(/[*#]/g, '')
    .replace(/^["'`\s]+|["'`\s]+$/g, '')
    .replace(/\s*\n+\s*/g, ' ')
    .replace(/[—–]/g, ', ');

  if (useFullStop) {
    t = t
      .replace(/!+/g, '.')
      .replace(/\.{2,}|…/g, '.')
      .replace(/\s+([.,])/g, '$1')
      .replace(/\.(?=[A-Za-z])/g, '. ')
      .replace(/\.\s*\./g, '.')
      .replace(/,\s*\./g, '.');
  } else {
    t = t
      .replace(/!+/g, ',')
      .replace(/\.{2,}|…/g, ' ')
      .replace(/\.\s+/g, ', ')
      .replace(/\.+$/g, '');
  }

  return t
    .replace(/,\s*,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function fixCutOff(text) {
  let parts = text.trim().replace(/[,\-\s]+$/g, '').split(/\s+/);
  while (parts.length > 5) {
    const last = parts[parts.length - 1].toLowerCase().replace(/[^a-z]/g, '');
    if (!DANGLING.has(last)) break;
    parts.pop();
    parts = parts.join(' ').replace(/[,\-\s]+$/g, '').split(/\s+/);
  }
  return parts.join(' ');
}

function trimToLimit(text, maxWords, stillOk) {
  const m = text.match(/^([\s\S]*?)([\s\uFE0F\u200D\p{Extended_Pictographic}]*)$/u);
  const core = m ? m[1].trim() : text;
  const tail = m ? m[2].trim() : '';
  const sentences = core.split(/(?<=[.,])\s+/).filter(Boolean);

  while (countWords(sentences.join(' ')) > maxWords && sentences.length > 2) {
    let removed = false;
    for (let i = sentences.length - 1; i >= 1; i--) {
      const test = sentences.filter((_, j) => j !== i).join(' ');
      if (!stillOk(test)) continue;
      sentences.splice(i, 1);
      removed = true;
      break;
    }
    if (!removed) break;
  }
  const out = sentences.join(' ');
  return tail ? `${out} ${tail}` : out;
}

function finalizeReview(text, useFullStop) {
  const m = text.match(/^([\s\S]*?)([\s\p{Extended_Pictographic}\uFE0F\u200D]*)$/u);
  let core = (m ? m[1] : text).replace(/[,;:\-\s]+$/g, '').trim();
  const tail = (m ? m[2] : '').replace(/\s+/g, '');

  if (useFullStop) {
    if (!/\.$/.test(core)) core += '.';
  } else {
    core = core.replace(/\.+$/g, '').trim();
  }
  return tail ? `${core} ${tail}` : core;
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
  if (language === 'HINGLISH') return h >= Math.max(2, Math.floor(words * 0.18));
  return h <= 2;
}

function startsBanned(text) {
  const t = text.trim().toLowerCase();
  return BANNED_OPENINGS.some((b) => t.startsWith(b.toLowerCase()));
}

/* ------------------ Compressed Prompt Builder ------------------ */
function buildPrompt(body, recent) {
  const language = body.language === 'HINGLISH' ? 'HINGLISH' : 'ENGLISH';
  const businessName = String(body.businessName || 'New Baviskar Jewellers').slice(0, 120);
  const category = String(body.category || 'Jewellery Store').slice(0, 200);
  const description = String(body.description || '916 BIS Hallmarked Gold, Silver Ornaments, Bridal & Traditional Maharashtrian Jewellery in Garkheda, Chhatrapati Sambhajinagar').slice(0, 600);
  const city = String(body.city || 'Chhatrapati Sambhajinagar').slice(0, 120);

  const recentModels = recent.map((r) => r.model).filter(Boolean).slice(-6);
  let chips = chosenChips(body);
  const hasModelChip = chips.some((c) => c.id === 'chip_models');
  const picked = hasModelChip || chance(0.55) ? pickModel(recentModels) : null;
  const model = picked ? picked.name : null;
  if (hasModelChip && picked) {
    chips = chips.map((c) =>
      c.id === 'chip_models'
        ? { ...c, text: `bought or ordered a ${picked.name} with neat finishing`, must: new RegExp(picked.series, 'i') }
        : c
    );
  }

  const minLines = chips.length >= 3 ? 4 : 2;
  const length = chooseLength(recent, minLines);
  const persona = choosePersona(recent);

  // Random topic + bonus secondary topic for longer reviews (4+ lines) so 50 reviews never repeat
  const primaryTopic = chips.length
    ? { id: chips[0].id, text: chips[0].text, must: chips[0].must }
    : chooseTopic(recent);
  const extraChips = chips.slice(1);

  let bonusTopic = null;
  if (!extraChips.length && length.lines >= 4 && chance(0.65)) {
    const candidate = chooseTopic([...recent, { topic: primaryTopic.id }]);
    if (candidate.id !== primaryTopic.id) bonusTopic = candidate;
  }

  const opener = chooseFrom(OPENERS, 'opener', recent, 9);
  const middleFlow = chooseFrom(MIDDLE_FLOWS, 'mid', recent, 5);
  const ending = chooseFrom(ENDINGS, 'ending', recent, 5);

  const hasSpellingSlip = chance(0.10); // 10% natural spelling slip
  const style = hasSpellingSlip
    ? 'casual WhatsApp typing with 1 or 2 natural human spelling slips (like real people typing fast on phone)'
    : pick(WRITING_STYLES);
  const useFullStop = chance(0.80); // 80% full stop, 20% without full stop
  const hinglishLevel = pick(HINGLISH_LEVELS);
  const buyerLine = length.lines >= 3 && chance(0.5) ? pick(BUYER_LINES) + ' ' : '';

  const mentionName = length.lines >= 3 && chance(0.4);
  const mentionStaff = length.lines >= 3 && (primaryTopic.id === 'politeness' ? chance(0.5) : chance(0.15));
  const useEmoji = chance(0.08);

  // Mandatory unique SEO keyword in every review (rotated across last 16 reviews)
  const seo = chooseKeyword(recent);
  const kwPlacement = pick(KEYWORD_PLACEMENTS);

  const languageBlock =
    language === 'HINGLISH'
      ? `LANGUAGE: HINGLISH = Hindi sentences typed in Roman/English letters like an Indian customer on WhatsApp. Level: ${hinglishLevel}. Hindi grammar (hai, tha, kiya, mila, nahi, bahut, aur, ke liye). Jewellery/SEO words can stay in English. Never write a full English sentence. No Devanagari.`
      : `LANGUAGE: Simple natural Indian English. Do not use Hindi words.`;

  const examples = shuffle(EXAMPLES[language]).map((e) => `- ${e}`).join('\n');

  const punctuationRule = useFullStop
    ? `- FULL STOPS: End every sentence with a full stop (.) and end the review with a full stop (.). No exclamation marks or dashes.`
    : `- NO FULL STOPS: Do NOT use a full stop (.) anywhere. Use commas, "aur"/"and", or natural flow.`;

  const prompt = `${languageBlock}

You are ${persona.text}. ${buyerLine}You bought ${PRODUCT_WORD} from this shop and are writing a Google Maps review.
Business: ${businessName} (${city}) | ${category}
About: ${description}

Tone samples (feel only, never copy words/structure):
${examples}

THIS REVIEW:
- Main topic: ${primaryTopic.text}.
${extraChips.length ? `- ALSO cover these selected points: ${extraChips.map((c) => c.text).join('; ')}.` : bonusTopic ? `- Also weave in a short natural mention of ${bonusTopic.text}.` : '- Keep it focused on the main topic.'}
- Style: ${style}.
- Opening: ${opener}.
${length.lines >= 4 ? `- Middle flow: ${middleFlow}.` : ''}
${length.lines >= 3 ? `- Ending: ${ending}.` : ''}
- Length: ${length.rule}. Stay strictly inside this word count.
- SEO KEYWORD (MANDATORY): Naturally include the phrase "${seo}" ${kwPlacement}.
${mentionName ? `- Mention "${businessName}" once naturally.` : '- Do not repeat the full shop name.'}
${model ? (hasModelChip ? `- Mention ${model} by name.` : `- You may mention ${model}.`) : ''}
${mentionStaff ? `- Mention "${OWNER_NAME}" once naturally.` : '- Do not name any person.'}
${useEmoji ? '- One emoji at the very end is allowed.' : '- No emojis.'}

RULES:
- ONE single paragraph. No line breaks, bullets, or title.
${punctuationRule}
- Never start with: ${BANNED_OPENINGS.join(', ')}.
- Sound like a real human customer praising from the heart, not an ad. No hashtags, slogans, keyword stuffing, or heavy marketing words.
- No fake facts: no other market or shop names, no exact gold prices in rupees, no fake discount percentages.
- Complete thought only. Output ONLY the review text.`;

  return { prompt, length, persona, topic: primaryTopic, extraChips, opener, middleFlow, ending, seo, model, language, useFullStop };
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

/* ------------------ Single-Shot Attempt + Auto-Repair ------------------ */
async function attempt(apiKey, body, recent, signal, strict = true) {
  const built = buildPrompt(body, recent);
  const { prompt, length, persona, topic, extraChips, opener, middleFlow, ending, seo, model, language, useFullStop } = built;

  const payload = {
    contents: [{ role: 'user', parts: [{ text: `Write the review for ${body.businessName || 'New Baviskar Jewellers'} now.` }] }],
    systemInstruction: { parts: [{ text: prompt }] },
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  };

  try {
    const { res, data } = await callGemini(apiKey, payload, signal);
    if (!res.ok) return { ok: false, error: data?.error?.message || 'Gemini API request failed.' };

    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const raw = parts.filter((p) => !p.thought).map((p) => p.text || '').join('');
    const usage = data.usageMetadata;

    if (!raw.trim()) return { ok: false, error: 'Empty response from Gemini.' };
    if (candidate?.finishReason === 'MAX_TOKENS') return { ok: false, error: 'Response was cut off.' };

    // Auto-repair pipeline (prevents wasteful Round 2 API calls)
    let review = scrubRobotic(raw);
    review = fixCutOff(cleanReview(review, useFullStop));
    if (looksCutOff(review)) return { ok: false, error: 'Review ended mid-sentence.' };

    const stillOk = (t) => topic.must.test(t) && extraChips.every((c) => c.must.test(t));

    let words = countWords(review);
    if (words > length.max + 5) {
      review = trimToLimit(review, length.max + 3, stillOk);
      words = countWords(review);
    }

    review = finalizeReview(review, useFullStop);
    words = countWords(review);

    const maxAllowed = length.max + (strict ? 8 : 16);
    const minAllowed = Math.floor(length.min * (strict ? 0.72 : 0.60));

    if (words > maxAllowed) return { ok: false, error: 'Review too long.' };
    if (words < minAllowed) return { ok: false, error: 'Review too short.' };
    if (/[\u0900-\u097F]/.test(review)) return { ok: false, error: 'Devanagari used.' };
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
      usage,
      meta: {
        lines: length.lines,
        voice: persona.id,
        cls: persona.cls,
        topic: topic.id,
        opener,
        mid: middleFlow,
        ending,
        seo,
        model: model || null,
        open: openingOf(review),
      },
    };
  } catch (e) {
    return {
      ok: false,
      error: e?.name === 'AbortError' ? 'Request timed out.' : e?.message || 'Request failed.',
    };
  }
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
      .slice(-RECENT_WINDOW);

    let lastError = 'Failed to generate review draft.';

    // 1 single call per round; sirf fail/reject hone par Round 2 chalega
    for (let round = 0; round < MAX_ROUNDS; round++) {
      const strict = round === 0;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), CALL_TIMEOUT_MS);

      const result = await attempt(apiKey, body, recent, controller.signal, strict);
      clearTimeout(timer);

      if (result.ok) {
        remember(result.review);
        SERVER_KWS.push(result.meta.seo);
        while (SERVER_KWS.length > SEO_KEYWORDS.length) SERVER_KWS.shift();

        if (result.usage) {
          console.log(
            `[API Cost] ${MODEL} | In: ${result.usage.promptTokenCount} | Out: ${result.usage.candidatesTokenCount} | Total: ${result.usage.totalTokenCount}`
          );
        }
        return NextResponse.json({ review: result.review, meta: result.meta });
      }
      lastError = result.error;
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
