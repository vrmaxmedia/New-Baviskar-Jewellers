"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

import photo1 from "../gallery/photo1.webp";
import photo2 from "../gallery/photo2.webp";
import photo3 from "../gallery/photo3.webp";
import photo4 from "../gallery/photo4.webp";
import photo5 from "../gallery/photo5.webp";
import photo6 from "../gallery/photo6.webp";
import photo7 from "../gallery/photo7.webp";
import photo8 from "../gallery/photo8.webp";
import photo9 from "../gallery/photo9.webp";
import photo10 from "../gallery/photo10.webp";
import photo11 from "../gallery/photo11.webp";
import photo12 from "../gallery/photo12.webp";

const GALLERY_IMAGES = [
  photo1,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  photo10,
  photo11,
  photo12,
];

const CLIENT_CONFIG = {
  clientId: "new_baviskar_jewellers_01",
  businessName: "New Baviskar Jewellers",
  subHeading: "Purity · Tradition · Trust",
  tagline:
    "916 HALLMARK GOLD & SILVER JEWELLERS • GARKHEDA, CHHATRAPATI SAMBHAJINAGAR",
  description:
    "Trusted family jewellery showroom in Garkheda, Chhatrapati Sambhajinagar offering 916 BIS Hallmarked gold ornaments, traditional Maharashtrian bridal jewellery (mangalsutra, ranihar, thushi, nath, patlya), modern lightweight daily wear gold, pure silver ornaments, idols & gift articles, custom order designs, and transparent old gold exchange.",
  city: "Garkheda, Chhatrapati Sambhajinagar",
  fullAddress:
    "Shop No 5, Plot No 4, Sarang Housing Society, Garkheda, Gajanan Maharaj Mandir Rd, Chaitanya Nagar, Chhatrapati Sambhajinagar, Maharashtra",
  phone: "+917972131775",
  cleanPhone: "917972131775",
  logoUrl: "/logo.png",
  googleReviewUrl:
    "https://www.google.com/maps/search/?api=1&query=New+Baviskar+Jewellers+Garkheda+Gajanan+Maharaj+Mandir+Rd+Chhatrapati+Sambhajinagar",
  mapsDirectionUrl:
    "https://www.google.com/maps/search/?api=1&query=New+Baviskar+Jewellers+Shop+No+5+Plot+No+4+Sarang+Housing+Society+Garkheda+Gajanan+Maharaj+Mandir+Rd+Chaitanya+Nagar+Chhatrapati+Sambhajinagar",
  instagramUrl: "",
  facebookUrl: "",
  websiteUrl: "https://www.newbaviskarjewellers.com/",
  youtubeUrl: "",
  whatsappChannelUrl: "",
  agencyName: "VR Max AI",
  agencyWhatsapp: "918700660097",
  agencyPhoneDisplay: "+91 87006 60097",
  customInstruction:
    "You are an authentic local customer writing an unscripted Google Maps review for New Baviskar Jewellers in Garkheda, Chhatrapati Sambhajinagar. Write like a real human speaking straight from the heart. Talk about the 916 hallmark gold purity, unique Maharashtrian and modern designs, silver collection, fair making charges, polite staff and honest weight calculation in a natural way. Mention ornaments organically (e.g. mangalsutra, gold ring, chain, jhumka, necklace, ranihar, bangles, silver payal, gift idol). Strictly DO NOT use full stops (.) at the end of sentences. Vary lengths completely randomly (some 1-line quick reviews, some 2-line, some 3-4 lines detailed). Never use robotic or repetitive openings.",
  chips: [
    { label: "All", context: "overall jewellery shopping experience" },
    {
      label: "916 Hallmark Gold",
      context: "916 BIS hallmarked gold with genuine purity checked properly",
    },
    {
      label: "Unique Designs",
      context: "unique and latest jewellery designs with great variety",
    },
    {
      label: "Silver Ornaments",
      context: "silver payal, rings, idols and gift articles with neat finish",
    },
    {
      label: "Low Making Charges",
      context: "reasonable making charges and transparent price calculation",
    },
    {
      label: "Bridal & Wedding",
      context:
        "wedding and bridal jewellery shopping with traditional Maharashtrian sets",
    },
    {
      label: "Custom Jewellery",
      context: "custom made ornament on order with exact design and finishing",
    },
    {
      label: "Pure & Trusted",
      context:
        "exact weight on scale, proper bill, honest and trusted family jeweller",
    },
    {
      label: "Old Gold Exchange",
      context: "fair value when exchanging old gold for new ornaments",
    },
    {
      label: "Polite Staff",
      context: "polite and patient owner and staff showing designs calmly",
    },
    {
      label: "Garkheda Location",
      context:
        "easy to find showroom in Garkheda on Gajanan Maharaj Mandir Road",
    },
  ],
};

const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(
  `${CLIENT_CONFIG.businessName},${CLIENT_CONFIG.fullAddress}`
)}&output=embed`;

const AGENCY_WA_LINK = `https://wa.me/${
  CLIENT_CONFIG.agencyWhatsapp
}?text=${encodeURIComponent(
  "Hi VR Max AI, I want to get a QR review system for my business."
)}`;

function useTypewriter(fullText, totalMs = 2300) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!fullText) {
      setDisplayText("");
      setIsTyping(false);
      return;
    }

    setDisplayText("");
    setIsTyping(true);

    const COMMA_PAUSE = 90;
    const commas = (fullText.match(/,/g) || []).length;
    const base = Math.min(
      26,
      Math.max(10, (totalMs - commas * COMMA_PAUSE) / fullText.length)
    );

    const times = [];
    let t = 0;

    for (let i = 0; i < fullText.length; i++) {
      t += base;
      times.push(t);
      if (fullText[i] === ",") t += COMMA_PAUSE;
    }

    const start = performance.now();
    let raf;

    const tick = (now) => {
      const elapsed = now - start;
      let n = 0;

      while (n < times.length && times[n] <= elapsed) n++;

      setDisplayText(fullText.slice(0, n));

      if (n >= fullText.length) {
        setIsTyping(false);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [fullText, totalMs]);

  return { displayText, isTyping };
}

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    // Fallback below
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);

    const ok = document.execCommand("copy");
    ta.remove();

    return ok;
  } catch (e) {
    return false;
  }
}

export default function UniversalReviewPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState(["All"]);
  const firstRunRef = useRef(true);
  const [language, setLanguage] = useState("ENGLISH");
  const [reviewDraft, setReviewDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Gallery state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryTouchStartXRef = useRef(0);

  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const recentLengthsRef = useRef([]);

  const { displayText, isTyping } = useTypewriter(reviewDraft);

  useEffect(() => {
    setMounted(true);

    return () => {
      requestIdRef.current++;
      abortControllerRef.current?.abort();
    };
  }, []);

  // Gallery automatic sliding - every 3 seconds
  useEffect(() => {
    if (!mounted) return;

    const galleryTimer = window.setInterval(() => {
      setGalleryIndex((current) => (current + 1) % GALLERY_IMAGES.length);
    }, 3000);

    return () => window.clearInterval(galleryTimer);
  }, [mounted]);

  // Manual touch swipe
  function handleGalleryTouchStart(event) {
    galleryTouchStartXRef.current = event.changedTouches[0].clientX;
  }

  function handleGalleryTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const difference = galleryTouchStartXRef.current - touchEndX;

    if (Math.abs(difference) < 45) return;

    if (difference > 0) {
      // Swipe left: next image
      setGalleryIndex((current) => (current + 1) % GALLERY_IMAGES.length);
    } else {
      // Swipe right: previous image
      setGalleryIndex(
        (current) =>
          (current - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
      );
    }
  }

  function handleGalleryPrevious() {
    setGalleryIndex(
      (current) => (current - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
    );
  }

  function handleGalleryNext() {
    setGalleryIndex((current) => (current + 1) % GALLERY_IMAGES.length);
  }

  const generateAIReview = useCallback(async (labels, lang) => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++requestIdRef.current;

    setLoading(true);
    setCopied(false);
    setError("");
    setReviewDraft("");

    try {
      const effectiveFocus = labels.join(" + ");

      const res = await fetch("/api/reviews", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          businessName: CLIENT_CONFIG.businessName,
          category: CLIENT_CONFIG.tagline,
          description: CLIENT_CONFIG.description,
          city: CLIENT_CONFIG.city,
          selectedService: effectiveFocus,
          selectedChips: labels,
          customInstruction: CLIENT_CONFIG.customInstruction,
          language: lang,
          nonce: Math.random().toString(36).substring(2, 12),
          timestamp: Date.now(),
          randomSeed: Math.floor(Math.random() * 100000),
          recentLengths: recentLengthsRef.current,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Draft generation failed (${res.status}).`);
      }

      if (!data.review?.trim()) {
        throw new Error("The API returned an empty draft.");
      }

      if (requestId !== requestIdRef.current) return;

      if (data.meta) {
        recentLengthsRef.current = [
          ...recentLengthsRef.current,
          data.meta,
        ].slice(-6);
      }

      setReviewDraft(data.review.trim());
    } catch (err) {
      if (err.name === "AbortError") return;

      if (requestId === requestIdRef.current) {
        setError(err.message || "Unable to generate a draft.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const delay = firstRunRef.current ? 0 : 350;
    firstRunRef.current = false;

    const t = setTimeout(
      () => generateAIReview(selectedLabels, language),
      delay
    );

    return () => {
      clearTimeout(t);
      abortControllerRef.current?.abort();
    };
  }, [mounted, selectedLabels, language, generateAIReview]);

  function handleChipChange(chipObj) {
    if (chipObj.label === "All") {
      if (selectedLabels.length === 1 && selectedLabels[0] === "All") {
        generateAIReview(["All"], language);
      } else {
        setSelectedLabels(["All"]);
      }
      return;
    }

    let next = selectedLabels.filter((l) => l !== "All");

    if (next.includes(chipObj.label)) {
      next = next.filter((l) => l !== chipObj.label);
    } else {
      next = [...next, chipObj.label];

      if (next.length > 3) {
        next = next.slice(-3);
      }
    }

    setSelectedLabels(next.length ? next : ["All"]);
  }

  function handleLanguageChange(lang) {
    if (lang === language) {
      generateAIReview(selectedLabels, lang);
      return;
    }

    setLanguage(lang);
  }

  async function handleCopyAndRedirect() {
    if (!reviewDraft || loading || isTyping) return;

    const ok = await copyToClipboard(reviewDraft);

    if (!ok) {
      setError("Could not copy the draft. Please select and copy it manually.");
      return;
    }

    setCopied(true);

    setTimeout(() => {
      window.location.href = CLIENT_CONFIG.googleReviewUrl;
    }, 550);
  }

  function handleSaveContact() {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${CLIENT_CONFIG.businessName}
ORG:${CLIENT_CONFIG.businessName}
TEL;TYPE=CELL:${CLIENT_CONFIG.phone}
ADR;TYPE=WORK:;;${CLIENT_CONFIG.fullAddress};;;;
NOTE:${CLIENT_CONFIG.subHeading}
END:VCARD`;

    const blob = new Blob([vcard], {
      type: "text/vcard;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${CLIENT_CONFIG.businessName.replace(/\s+/g, "_")}.vcf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#031a16",
        }}
      />
    );
  }

  return (
    <main className="soft-luxury-viewport">
      {/* Fixed Background Image */}
      <div className="fixed-bg"></div>

      <div className="main-content-flow">
        {/* Logo */}
        <div className="brand-medallion-badge">
          <div
            className="logo-circle-container"
            style={{
              backgroundImage: `url(${CLIENT_CONFIG.logoUrl})`,
            }}
            role="img"
            aria-label={`${CLIENT_CONFIG.businessName} logo`}
          ></div>

          <h1 className="brand-main-title">{CLIENT_CONFIG.businessName}</h1>
        </div>

        <p className="brand-serif-subtitle">{CLIENT_CONFIG.subHeading}</p>

        <div className="royal-shahi-divider">
          <span className="divider-line"></span>
          <span className="divider-gem">◆</span>
          <span className="divider-line"></span>
        </div>

        <div className="stars-cluster" aria-hidden="true">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>

        <p className="experience-tracker-title">SHARE YOUR EXPERIENCE</p>

        {/* Filter Chips */}
        <div className="floating-pills-cloud">
          {CLIENT_CONFIG.chips.map((chip) => {
            const active = selectedLabels.includes(chip.label);

            return (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleChipChange(chip)}
                aria-pressed={active}
                className={`embossed-pill ${active ? "active" : ""}`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <p className="chip-hint">Tap up to 3 keywords for your review</p>

        {/* Language Selector */}
        <div className="capsule-lang-dock">
          {["ENGLISH", "HINGLISH"].map((lang) => {
            const active = language === lang;

            return (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                aria-pressed={active}
                className={`capsule-lang-btn ${active ? "active" : ""}`}
              >
                {lang}
              </button>
            );
          })}
        </div>

        {/* Review Box */}
        <div className="signature-review-box">
          <div className="box-top-ribbon">
            <div className="label-badge">
              <span className="dot-ping"></span>
              YOUR REVIEW
            </div>

            <button
              type="button"
              disabled={loading || isTyping}
              onClick={() => generateAIReview(selectedLabels, language)}
              className="top-rewrite-btn"
            >
              <span>Rewrite</span>
            </button>
          </div>

          <div className="review-display-zone">
            {loading ? (
              <div className="loader-shimmer-wrap">
                <span className="sparkle-icon">✦</span>
                <span className="shimmer-text">Crafting authentic review...</span>
              </div>
            ) : error ? (
              <p className="review-error">{error}</p>
            ) : reviewDraft ? (
              <p className="review-body-text">
                {displayText}
                {isTyping && <span className="typewriter-cursor"></span>}
              </p>
            ) : (
              <p className="review-placeholder">
                Your review draft will appear here.
              </p>
            )}
          </div>

          <div className="card-ornament-center">
            <span>◆</span>
          </div>

          <button
            type="button"
            disabled={loading || isTyping || !reviewDraft}
            onClick={handleCopyAndRedirect}
            className={`full-luxury-copy-btn ${copied ? "copied" : ""}`}
          >
            <span>
              {copied ? "Copied! Opening Google..." : "Copy & Paste on Google"}
            </span>
          </button>

          <p className="card-disclaimer-note">
            Please review the wording before posting.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-card">
          <div className="soft-action-grid">
            <div className="action-row-upper">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/${CLIENT_CONFIG.cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="soft-circle-action"
              >
                <div className="icon-disc whatsapp-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <span className="icon-tag">WhatsApp</span>
              </a>

              {/* Call Us */}
              <a href={`tel:${CLIENT_CONFIG.phone}`} className="soft-circle-action">
                <div className="icon-disc call-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span className="icon-tag">Call Us</span>
              </a>

              {/* Save Contact */}
              <button
                type="button"
                onClick={handleSaveContact}
                className="soft-circle-action"
              >
                <div className="icon-disc contact-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <span className="icon-tag">Save Contact</span>
              </button>

              {/* Directions */}
              <a
                href={CLIENT_CONFIG.mapsDirectionUrl}
                target="_blank"
                rel="noreferrer"
                className="soft-circle-action"
              >
                <div className="icon-disc map-disc">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="icon-tag">Directions</span>
              </a>
            </div>

            <div className="action-row-lower">
              {/* Instagram */}
              {CLIENT_CONFIG.instagramUrl && (
                <a
                  href={CLIENT_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc insta-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <span className="icon-tag">Instagram</span>
                </a>
              )}

              {/* Website */}
              {CLIENT_CONFIG.websiteUrl && (
                <a
                  href={CLIENT_CONFIG.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc contact-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </div>
                  <span className="icon-tag">Website</span>
                </a>
              )}

              {/* WhatsApp Channel */}
              {CLIENT_CONFIG.whatsappChannelUrl && (
                <a
                  href={CLIENT_CONFIG.whatsappChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc wa-channel-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  <span className="icon-tag">WA Channel</span>
                </a>
              )}

              {/* Facebook */}
              {CLIENT_CONFIG.facebookUrl && (
                <a
                  href={CLIENT_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc fb-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </div>
                  <span className="icon-tag">Facebook</span>
                </a>
              )}

              {/* YouTube */}
              {CLIENT_CONFIG.youtubeUrl && (
                <a
                  href={CLIENT_CONFIG.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="soft-circle-action"
                >
                  <div className="icon-disc yt-disc">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon
                        points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="icon-tag">YouTube</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* =========================================
            PREMIUM JEWELLERY PHOTO GALLERY
            12 STATIC IMAGES - NO API / NO URL LIST
        ========================================= */}
        <section
          className="cafe-gallery-section"
          aria-label="Jewellery showroom photo gallery"
        >
          <div className="gallery-heading">
            <span className="gallery-eyebrow">ROYAL COLLECTION</span>

            <h2 className="gallery-title">Our Jewellery Showcase</h2>

            <p className="gallery-subtitle">
              916 Hallmark Gold, Silver & Bridal Ornaments
            </p>
          </div>

          <div
            className="gallery-slider"
            onTouchStart={handleGalleryTouchStart}
            onTouchEnd={handleGalleryTouchEnd}
            onTouchCancel={() => {
              galleryTouchStartXRef.current = 0;
            }}
          >
            <div
              className="gallery-track"
              style={{
                transform: `translateX(-${galleryIndex * 100}%)`,
              }}
            >
              {GALLERY_IMAGES.map((image, index) => (
                <div className="gallery-slide" key={`baviskar-gallery-${index + 1}`}>
                  <div className="gallery-image-frame">
                    <Image
                      src={image}
                      alt={`New Baviskar Jewellers gallery photo ${index + 1}`}
                      fill
                      sizes="(max-width: 410px) 100vw, 410px"
                      quality={90}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      draggable={false}
                      style={{
                        objectFit: "contain",
                        padding: "7px",
                        boxSizing: "border-box",
                        userSelect: "none",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Previous Slide */}
            <button
              type="button"
              className="gallery-arrow gallery-arrow-left"
              onClick={handleGalleryPrevious}
              aria-label="Previous gallery photo"
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Next Slide */}
            <button
              type="button"
              className="gallery-arrow gallery-arrow-right"
              onClick={handleGalleryNext}
              aria-label="Next gallery photo"
            >
              <svg
                viewBox="0 0 24 24"
                width="19"
                height="19"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Gallery indicators */}
          <div className="gallery-bottom-controls">
            <div className="gallery-dots" aria-label="Gallery slides">
              {GALLERY_IMAGES.map((_, index) => (
                <button
                  key={`gallery-dot-${index + 1}`}
                  type="button"
                  className={`gallery-dot ${
                    galleryIndex === index ? "active" : ""
                  }`}
                  onClick={() => setGalleryIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={galleryIndex === index ? "true" : undefined}
                />
              ))}
            </div>

            <span className="gallery-counter">
              {String(galleryIndex + 1).padStart(2, "0")}
              <span className="gallery-counter-divider"> / </span>
              {String(GALLERY_IMAGES.length).padStart(2, "0")}
            </span>
          </div>
        </section>

        {/* Map Card */}
        <div className="embedded-map-card">
          <a
            href={CLIENT_CONFIG.mapsDirectionUrl}
            target="_blank"
            rel="noreferrer"
            className="map-card-header-link"
          >
            <div className="address-highlight-box">
              <p className="agency-clean-address">
                <strong>📍 Address:</strong> {CLIENT_CONFIG.fullAddress}
              </p>
            </div>

            <div className="map-card-header">
              <span>Visit Us • Garkheda, Chhatrapati Sambhajinagar</span>
            </div>
          </a>

          <div className="map-iframe-container">
            <iframe
              title={`${CLIENT_CONFIG.businessName} Location`}
              src={MAP_EMBED_URL}
              width="100%"
              height="170"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            href={CLIENT_CONFIG.mapsDirectionUrl}
            target="_blank"
            rel="noreferrer"
            className="map-directions-link"
          >
            Get Directions on Google Maps →
          </a>
        </div>

        {/* Mini Footer */}
        <footer className="mini-footer">
          <span className="mini-footer-pill">
            Powered by <strong>{CLIENT_CONFIG.agencyName}</strong>
            <span className="mini-footer-dot">•</span>
            Get QR:
            <a href={AGENCY_WA_LINK} target="_blank" rel="noreferrer">
              {CLIENT_CONFIG.agencyPhoneDisplay}
            </a>
          </span>
        </footer>
      </div>

      <style jsx global>{`
        /* =========================================
           NEW BAVISKAR JEWELLERS
           ROYAL EMERALD + RICH GOLD + IVORY
        ========================================= */

        :root {
          --em-950: #021411;
          --em-900: #052e26;
          --em-800: #0a4034;
          --em-700: #0f5744;
          --gold-100: #fff3c4;
          --gold-200: #f9e29c;
          --gold-300: #f3d27a;
          --gold-400: #e6b94c;
          --gold-500: #d4a02f;
          --gold-600: #b8851c;
          --gold-700: #8a5e0e;
          --ivory: #fbf5e4;
          --ivory-soft: #e4dac0;
          --mist: #a9c2b5;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #031a16 !important;
          min-height: 100% !important;
          overflow-x: hidden !important;
        }

        /* =========================================
           FIXED FULL BACKGROUND
           EMERALD DEPTH + GOLD GLOW + FINE SPARKLE
        ========================================= */

        .fixed-bg {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          height: 100dvh;

          background: radial-gradient(
              ellipse at 50% -8%,
              rgba(230, 185, 76, 0.26),
              transparent 55%
            ),
            radial-gradient(
              circle at 105% 42%,
              rgba(15, 87, 68, 0.6),
              transparent 52%
            ),
            radial-gradient(
              circle at -5% 82%,
              rgba(184, 133, 28, 0.2),
              transparent 48%
            ),
            linear-gradient(180deg, #031a16 0%, #052e26 52%, #021411 100%);

          z-index: 0;
          pointer-events: none;
        }

        .fixed-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
              circle,
              rgba(243, 210, 122, 0.5) 0.8px,
              transparent 1.2px
            ),
            radial-gradient(
              circle,
              rgba(243, 210, 122, 0.3) 0.6px,
              transparent 1px
            );
          background-size: 46px 46px, 78px 78px;
          background-position: 0 0, 23px 31px;
          opacity: 0.28;
        }

        .soft-luxury-viewport {
          position: relative;
          isolation: isolate;
          z-index: 1;
          min-height: 100vh;
          min-height: 100dvh;
          background: transparent;
          padding: 10px 16px 24px;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          color: var(--ivory);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .main-content-flow {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 410px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .brand-medallion-badge {
          margin-top: 2px;
          margin-bottom: 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .logo-circle-container {
          width: 98px;
          height: 98px;
          border-radius: 50%;
          background-color: #fbf3e4;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          box-shadow: 0 0 0 3px rgba(230, 185, 76, 0.25),
            0 0 26px rgba(230, 185, 76, 0.45),
            0 12px 26px rgba(0, 0, 0, 0.45);
          margin-bottom: 8px;
          animation: floatLogo 3.5s ease-in-out infinite;
          border: 3px solid var(--gold-400);
          transition: transform 0.2s ease;
        }

        .logo-circle-container:active {
          transform: scale(0.96);
        }

        @keyframes floatLogo {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-circle-container {
            animation: none;
          }
        }

        .brand-main-title {
          font-family: Georgia, serif;
          font-size: 23px;
          font-weight: 800;
          margin: 0 0 4px;
          letter-spacing: 0.3px;

          color: var(--gold-300);
          background: linear-gradient(
            180deg,
            #fff3c4 0%,
            #f3d27a 45%,
            #d4a02f 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45));
        }

        .brand-serif-subtitle {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 12.5px;
          color: var(--gold-200);
          margin: 0 0 4px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .royal-shahi-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 85%;
          margin: 4px auto 8px;
          gap: 10px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--gold-400),
            transparent
          );
        }

        .divider-gem {
          color: var(--gold-300);
          font-size: 8px;
          text-shadow: 0 0 8px rgba(243, 210, 122, 0.8);
        }

        .stars-cluster {
          display: flex;
          gap: 4px;
          color: var(--gold-300);
          font-size: 14px;
          margin-bottom: 2px;
          text-shadow: 0 0 10px rgba(243, 210, 122, 0.65),
            0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .chip-hint {
          text-align: center;
          font-size: 11px;
          color: var(--mist);
          margin: 0 0 8px;
          letter-spacing: 0.3px;
        }

        .experience-tracker-title {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 2px;
          color: var(--gold-300);
          text-transform: uppercase;
          margin: 0 0 8px;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
        }

        .floating-pills-cloud {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 5px;
          margin: 0 auto 8px;
          width: 100%;
        }

        /* =========================================
           PREMIUM FILTER CHIPS (EMERALD GLASS & GOLD)
        ========================================= */

        .embossed-pill {
          position: relative;
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 11.5px;

          background: linear-gradient(
            145deg,
            rgba(15, 87, 68, 0.75) 0%,
            rgba(5, 46, 38, 0.85) 100%
          );

          color: var(--ivory);
          border: 1px solid rgba(230, 185, 76, 0.45);

          cursor: pointer;

          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.35),
            inset 0 1px 1px rgba(243, 210, 122, 0.22),
            inset 0 -1px 1px rgba(0, 0, 0, 0.35);

          transition: transform 0.16s ease, box-shadow 0.16s ease,
            background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
        }

        .embossed-pill:hover {
          transform: translateY(-2px);
          border-color: var(--gold-300);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4),
            0 0 12px rgba(230, 185, 76, 0.25),
            inset 0 1px 1px rgba(243, 210, 122, 0.3);
        }

        .embossed-pill:active {
          transform: translateY(2px) scale(0.98);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35),
            inset 0 2px 4px rgba(0, 0, 0, 0.35);
        }

        .embossed-pill.active {
          background: linear-gradient(
            145deg,
            #f9e29c 0%,
            #e6b94c 52%,
            #b8851c 100%
          );

          color: #1c1405;
          font-weight: 700;
          border: 1px solid #fff3c4;

          box-shadow: 0 5px 12px rgba(230, 185, 76, 0.4),
            0 0 14px rgba(243, 210, 122, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.65),
            inset 0 -2px 2px rgba(120, 78, 8, 0.35);
        }

        .embossed-pill.active:active {
          transform: translateY(2px);
          box-shadow: 0 1px 3px rgba(230, 185, 76, 0.3),
            inset 0 2px 4px rgba(120, 78, 8, 0.4);
        }

        /* =========================================
           PREMIUM LANGUAGE SELECTOR
        ========================================= */

        .capsule-lang-dock {
          display: inline-flex;
          background: linear-gradient(
            145deg,
            rgba(5, 46, 38, 0.9),
            rgba(2, 20, 17, 0.95)
          );

          border-radius: 999px;
          padding: 4px;
          gap: 3px;
          margin: 0 auto 12px;

          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.4),
            inset 0 1px 2px rgba(243, 210, 122, 0.15);

          border: 1px solid rgba(230, 185, 76, 0.5);
        }

        .capsule-lang-btn {
          position: relative;
          padding: 6px 19px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: transparent;
          font-size: 10px;
          font-weight: 700;
          color: var(--mist);
          cursor: pointer;

          transition: transform 0.16s ease, background 0.18s ease,
            box-shadow 0.18s ease, color 0.18s ease;
        }

        .capsule-lang-btn.active {
          background: linear-gradient(
            145deg,
            #f9e29c 0%,
            #e6b94c 55%,
            #b8851c 100%
          );

          color: #1c1405;
          border-color: #fff3c4;

          box-shadow: 0 4px 10px rgba(230, 185, 76, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.6),
            inset 0 -2px 2px rgba(120, 78, 8, 0.3);
        }

        .capsule-lang-btn:active {
          transform: translateY(2px);
        }

        /* =========================================
           REVIEW CARD (DEEP EMERALD GLASS)
        ========================================= */

        .signature-review-box {
          width: 100%;
          background: linear-gradient(
            165deg,
            rgba(10, 64, 52, 0.9) 0%,
            rgba(4, 36, 30, 0.94) 100%
          );
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          border-radius: 24px;
          padding: 18px;
          box-sizing: border-box;

          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5),
            0 0 24px rgba(230, 185, 76, 0.12),
            inset 0 1px 1px rgba(243, 210, 122, 0.2);

          margin-bottom: 16px;
          text-align: left;

          border: 1px solid rgba(230, 185, 76, 0.5);
          border-top: 4px solid var(--gold-400);

          color: var(--ivory);
        }

        .box-top-ribbon {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .label-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 1.8px;
          color: var(--gold-300);
          text-transform: uppercase;
        }

        .dot-ping {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold-300);
          box-shadow: 0 0 8px rgba(243, 210, 122, 0.9);
        }

        /* =========================================
           REWRITE BUTTON
        ========================================= */

        .top-rewrite-btn {
          position: relative;
          display: inline-flex;
          align-items: center;

          padding: 6px 13px;
          border-radius: 999px;

          background: linear-gradient(
            145deg,
            rgba(15, 87, 68, 0.8) 0%,
            rgba(5, 46, 38, 0.9) 100%
          );

          border: 1px solid rgba(230, 185, 76, 0.6);
          color: var(--gold-200);

          font-size: 10.5px;
          font-weight: 700;

          cursor: pointer;

          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35),
            inset 0 1px 1px rgba(243, 210, 122, 0.22);

          transition: transform 0.16s ease, box-shadow 0.16s ease,
            background 0.18s ease;
        }

        .top-rewrite-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 12px rgba(0, 0, 0, 0.4),
            0 0 12px rgba(230, 185, 76, 0.28),
            inset 0 1px 1px rgba(243, 210, 122, 0.3);
        }

        .top-rewrite-btn:active:not(:disabled) {
          transform: translateY(2px);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35),
            inset 0 2px 3px rgba(0, 0, 0, 0.35);
        }

        .top-rewrite-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .review-display-zone {
          min-height: 132px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 2px 8px;
        }

        .loader-shimmer-wrap {
          color: var(--gold-300);
          font-size: 12px;
          font-style: italic;
        }

        .sparkle-icon {
          color: var(--gold-300);
          text-shadow: 0 0 8px rgba(243, 210, 122, 0.9);
        }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            #b8851c 0%,
            #fff3c4 50%,
            #b8851c 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 1.8s linear infinite;
        }

        @keyframes textShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .review-body-text {
          font-family: Georgia, serif;
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--ivory);
          margin: 0;
          width: 100%;
          white-space: pre-wrap;
        }

        .review-placeholder {
          font-family: Georgia, serif;
          font-size: 13px;
          font-style: italic;
          color: var(--mist);
          margin: 0;
        }

        .review-error {
          font-size: 12px;
          color: #ffa596;
          margin: 0;
        }

        .typewriter-cursor {
          display: inline-block;
          width: 2px;
          height: 13px;
          background: var(--gold-300);
          margin-left: 3px;
          vertical-align: middle;
          animation: blink 0.7s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        .card-ornament-center {
          text-align: center;
          color: var(--gold-400);
          font-size: 7px;
          margin: 6px 0 10px;
          text-shadow: 0 0 8px rgba(243, 210, 122, 0.7);
        }

        /* =========================================
           MAIN COPY BUTTON (SHINING GOLD)
        ========================================= */

        .full-luxury-copy-btn {
          position: relative;
          overflow: hidden;

          width: 100%;
          height: 50px;
          border-radius: 999px;

          background: linear-gradient(
            145deg,
            #fbe9a8 0%,
            #e6b94c 45%,
            #b8851c 100%
          );

          border: 1px solid #fff3c4;
          color: #1c1405;

          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.3px;
          cursor: pointer;

          box-shadow: 0 8px 18px rgba(230, 185, 76, 0.35),
            0 0 20px rgba(243, 210, 122, 0.25),
            inset 0 1px 1px rgba(255, 255, 255, 0.7),
            inset 0 -3px 4px rgba(120, 78, 8, 0.35);

          transition: transform 0.16s ease, background 0.18s ease,
            box-shadow 0.16s ease, opacity 0.18s ease;
        }

        /* Moving shine sweep */
        .full-luxury-copy-btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: -60%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            100deg,
            transparent 0%,
            rgba(255, 255, 255, 0.65) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          animation: goldSweep 3.2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes goldSweep {
          0% {
            left: -60%;
          }
          55%,
          100% {
            left: 130%;
          }
        }

        .full-luxury-copy-btn:hover:not(:disabled) {
          transform: translateY(-2px);

          box-shadow: 0 12px 22px rgba(230, 185, 76, 0.42),
            0 0 26px rgba(243, 210, 122, 0.35),
            inset 0 1px 1px rgba(255, 255, 255, 0.75);
        }

        .full-luxury-copy-btn:active:not(:disabled) {
          transform: translateY(2px);

          box-shadow: 0 2px 5px rgba(230, 185, 76, 0.3),
            inset 0 3px 5px rgba(120, 78, 8, 0.4);
        }

        .full-luxury-copy-btn.copied {
          background: linear-gradient(145deg, #3fd39b, #1a8a62);
          border-color: #b6f3d9;
          color: #ffffff;
          box-shadow: 0 8px 18px rgba(26, 138, 98, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.45);
        }

        .full-luxury-copy-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
        }

        .full-luxury-copy-btn:disabled::after {
          display: none;
        }

        .card-disclaimer-note {
          font-size: 9.5px;
          color: var(--mist);
          text-align: center;
          margin: 8px 0 0;
          font-style: italic;
        }

        /* =========================================
           QUICK ACTIONS CARD
        ========================================= */

        .quick-actions-card {
          width: 100%;
          background: linear-gradient(
            165deg,
            rgba(10, 64, 52, 0.88) 0%,
            rgba(4, 36, 30, 0.92) 100%
          );
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          border-radius: 22px;
          padding: 18px 12px;
          box-sizing: border-box;

          border: 1px solid rgba(230, 185, 76, 0.45);

          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.45),
            inset 0 1px 1px rgba(243, 210, 122, 0.18);

          margin-bottom: 16px;
        }

        .soft-action-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .action-row-upper {
          display: flex;
          justify-content: center;
          gap: 14px;
          width: 100%;
        }

        .action-row-lower {
          display: flex;
          justify-content: center;
          gap: 14px;
          width: 100%;
        }

        /* =========================================
           ACTION BUTTONS
        ========================================= */

        .soft-circle-action {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 7px;

          text-decoration: none !important;
          color: var(--ivory);

          background: transparent;
          border: none;

          cursor: pointer;
          padding: 3px 4px 5px;

          -webkit-tap-highlight-color: transparent;

          transition: transform 0.18s ease, color 0.18s ease;
        }

        .soft-circle-action:hover {
          transform: translateY(-3px);
        }

        .soft-circle-action:active {
          transform: translateY(2px) scale(0.97);
        }

        .soft-circle-action:focus-visible {
          outline: 2px solid var(--gold-300);
          outline-offset: 4px;
          border-radius: 14px;
        }

        .icon-disc {
          position: relative;

          width: 54px;
          height: 54px;
          border-radius: 50%;

          background: linear-gradient(
            145deg,
            rgba(15, 87, 68, 0.9) 0%,
            rgba(3, 30, 25, 0.95) 100%
          );

          display: grid;
          place-items: center;

          border: 1px solid var(--gold-400);

          box-shadow: 0 7px 14px rgba(0, 0, 0, 0.45),
            0 0 12px rgba(230, 185, 76, 0.2),
            inset 0 2px 3px rgba(243, 210, 122, 0.25),
            inset 0 -2px 3px rgba(0, 0, 0, 0.4);

          transition: transform 0.18s ease, box-shadow 0.18s ease,
            background 0.18s ease, border-color 0.18s ease;
        }

        /* Soft inner highlight */
        .icon-disc::before {
          content: "";
          position: absolute;
          top: 3px;
          left: 7px;
          right: 7px;
          height: 35%;
          border-radius: 50%;

          background: linear-gradient(
            180deg,
            rgba(255, 243, 196, 0.3),
            rgba(255, 243, 196, 0)
          );

          pointer-events: none;
        }

        /* Icon depth */
        .icon-disc svg {
          position: relative;
          z-index: 1;

          width: 21px;
          height: 21px;

          stroke: var(--gold-300);
          stroke-width: 1.8;

          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));

          transition: stroke 0.18s ease, transform 0.18s ease;
        }

        .soft-circle-action:hover .icon-disc {
          transform: translateY(-2px);

          box-shadow: 0 10px 18px rgba(0, 0, 0, 0.5),
            0 0 18px rgba(230, 185, 76, 0.4),
            inset 0 2px 3px rgba(243, 210, 122, 0.3);
        }

        .soft-circle-action:active .icon-disc {
          transform: translateY(2px);

          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4),
            inset 0 3px 5px rgba(0, 0, 0, 0.4);
        }

        .icon-tag {
          font-size: 9.5px;
          font-weight: 700;
          color: var(--ivory-soft);
          line-height: 1.3;
          white-space: nowrap;
          transition: color 0.18s ease;
        }

        /* WhatsApp */
        .whatsapp-disc:hover {
          background: linear-gradient(145deg, #42e486, #1aaf58);
          border-color: #8df0b5;
          box-shadow: 0 7px 16px rgba(37, 211, 102, 0.4),
            inset 0 2px 3px rgba(255, 255, 255, 0.35);
        }

        .whatsapp-disc:hover svg {
          stroke: #ffffff;
        }

        /* Call */
        .call-disc:hover {
          background: linear-gradient(145deg, #45a4ff, #0874d1);
          border-color: #9ccfff;
          box-shadow: 0 7px 16px rgba(0, 122, 255, 0.38),
            inset 0 2px 3px rgba(255, 255, 255, 0.35);
        }

        .call-disc:hover svg {
          stroke: #ffffff;
        }

        /* Contact and Website */
        .contact-disc:hover {
          background: linear-gradient(145deg, #f9e29c, #d4a02f);
          border-color: #fff3c4;
          box-shadow: 0 7px 16px rgba(230, 185, 76, 0.4),
            inset 0 2px 3px rgba(255, 255, 255, 0.45);
        }

        .contact-disc:hover svg {
          stroke: #1c1405;
        }

        /* Directions */
        .map-disc:hover {
          background: linear-gradient(145deg, #ff776b, #e34539);
          border-color: #ffb3aa;
          box-shadow: 0 7px 16px rgba(234, 67, 53, 0.38),
            inset 0 2px 3px rgba(255, 255, 255, 0.3);
        }

        .map-disc:hover svg {
          stroke: #ffffff;
        }

        /* Instagram */
        .insta-disc:hover {
          background: radial-gradient(
            circle at 30% 107%,
            #fdf497 0%,
            #fdf497 5%,
            #fd5949 45%,
            #d6249f 60%,
            #285aeb 90%
          );

          border-color: #f3a6dc;

          box-shadow: 0 7px 16px rgba(214, 36, 159, 0.35),
            inset 0 2px 3px rgba(255, 255, 255, 0.3);
        }

        .insta-disc:hover svg {
          stroke: #ffffff;
        }

        /* WhatsApp Channel */
        .wa-channel-disc:hover {
          background: linear-gradient(145deg, #42e486, #1aaf58);
          border-color: #8df0b5;
        }

        .wa-channel-disc:hover svg {
          stroke: #ffffff;
        }

        /* Facebook */
        .fb-disc:hover {
          background: linear-gradient(145deg, #4095ff, #1877f2);
          border-color: #a5ccff;
          box-shadow: 0 7px 16px rgba(24, 119, 242, 0.38),
            inset 0 2px 3px rgba(255, 255, 255, 0.3);
        }

        .fb-disc:hover svg {
          stroke: #ffffff;
        }

        /* YouTube */
        .yt-disc:hover {
          background: linear-gradient(145deg, #ff4848, #cc0000);
          border-color: #ff9d9d;
          box-shadow: 0 7px 16px rgba(255, 0, 0, 0.35),
            inset 0 2px 3px rgba(255, 255, 255, 0.3);
        }

        .yt-disc:hover svg {
          stroke: #ffffff;
          color: #ffffff;
        }

        /* =========================================
           PREMIUM JEWELLERY GALLERY
        ========================================= */

        .cafe-gallery-section {
          width: 100%;
          box-sizing: border-box;
          padding: 17px 13px 14px;
          margin: 0 0 16px;

          background: linear-gradient(
            165deg,
            rgba(10, 64, 52, 0.9) 0%,
            rgba(4, 36, 30, 0.94) 100%
          );
          border: 1px solid rgba(230, 185, 76, 0.5);
          border-radius: 22px;

          box-shadow: 0 11px 28px rgba(0, 0, 0, 0.5),
            0 0 22px rgba(230, 185, 76, 0.1),
            inset 0 1px 1px rgba(243, 210, 122, 0.18);

          overflow: hidden;
        }

        .gallery-heading {
          text-align: center;
          margin: 0 0 13px;
        }

        .gallery-eyebrow {
          display: inline-block;
          color: var(--gold-300);
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .gallery-title {
          font-family: Georgia, serif;
          font-size: 21px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0 0 5px;

          color: var(--gold-300);
          background: linear-gradient(
            180deg,
            #fff3c4 0%,
            #f3d27a 50%,
            #d4a02f 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gallery-subtitle {
          color: var(--mist);
          font-family: Georgia, serif;
          font-size: 11px;
          font-style: italic;
          line-height: 1.4;
          margin: 0;
        }

        .gallery-slider {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 17px;
          background: #031a16;

          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }

        .gallery-track {
          display: flex;
          width: 100%;

          transition: transform 650ms cubic-bezier(0.22, 1, 0.36, 1);

          will-change: transform;
        }

        .gallery-slide {
          flex: 0 0 100%;
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }

        /*
          All photos use the same 4:3 frame.
          object-fit: contain keeps the complete image visible.
          Portrait and landscape images will not be cropped.
        */

        .gallery-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          min-height: 210px;
          max-height: 290px;

          overflow: hidden;
          border-radius: 17px;

          background: radial-gradient(
            circle at 50% 40%,
            #0f5744 0%,
            #052e26 60%,
            #021411 100%
          );

          border: 1px solid rgba(230, 185, 76, 0.55);

          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4),
            inset 0 0 18px rgba(0, 0, 0, 0.35);
        }

        .gallery-image-frame img {
          user-select: none;
          -webkit-user-drag: none;
        }

        /* Subtle previous / next controls */

        .gallery-arrow {
          position: absolute;
          z-index: 2;
          top: 50%;
          transform: translateY(-50%);

          width: 34px;
          height: 34px;
          border-radius: 50%;

          display: grid;
          place-items: center;

          background: rgba(3, 26, 22, 0.82);
          color: var(--gold-300);
          border: 1px solid rgba(230, 185, 76, 0.7);

          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.45),
            inset 0 1px 1px rgba(243, 210, 122, 0.25);

          cursor: pointer;

          transition: background 0.18s ease, transform 0.18s ease,
            box-shadow 0.18s ease;

          -webkit-tap-highlight-color: transparent;
        }

        .gallery-arrow-left {
          left: 8px;
        }

        .gallery-arrow-right {
          right: 8px;
        }

        .gallery-arrow:hover {
          background: rgba(10, 64, 52, 0.95);
          box-shadow: 0 5px 14px rgba(0, 0, 0, 0.5),
            0 0 12px rgba(230, 185, 76, 0.35);
        }

        .gallery-arrow:active {
          transform: translateY(-50%) scale(0.91);
        }

        .gallery-arrow:focus-visible {
          outline: 2px solid var(--gold-300);
          outline-offset: 3px;
        }

        .gallery-bottom-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 12px;
          min-height: 12px;
        }

        .gallery-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .gallery-dot {
          appearance: none;
          -webkit-appearance: none;

          width: 6px;
          height: 6px;
          min-width: 6px;

          padding: 0;
          border: 0;
          border-radius: 999px;

          background: rgba(230, 185, 76, 0.32);
          cursor: pointer;

          transition: width 350ms ease, background 250ms ease,
            box-shadow 250ms ease;
        }

        .gallery-dot.active {
          width: 19px;
          background: linear-gradient(90deg, #f9e29c, #e6b94c);
          box-shadow: 0 0 8px rgba(243, 210, 122, 0.6);
        }

        .gallery-counter {
          color: var(--mist);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
          font-variant-numeric: tabular-nums;
        }

        .gallery-counter-divider {
          color: var(--gold-400);
          padding: 0 2px;
        }

        /* =========================================
           MAP CARD
        ========================================= */

        .embedded-map-card {
          width: 100%;
          background: linear-gradient(
            165deg,
            rgba(10, 64, 52, 0.9) 0%,
            rgba(4, 36, 30, 0.94) 100%
          );
          border-radius: 22px;
          padding: 14px 16px;
          box-sizing: border-box;

          border: 1px solid rgba(230, 185, 76, 0.45);

          box-shadow: 0 9px 24px rgba(0, 0, 0, 0.45),
            inset 0 1px 1px rgba(243, 210, 122, 0.15);

          margin-bottom: 12px;
          text-align: left;
        }

        .map-card-header-link {
          text-decoration: none;
        }

        .map-card-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          font-size: 11.5px;
          font-weight: 800;
          color: var(--gold-300);

          margin-bottom: 8px;
        }

        .map-iframe-container {
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(230, 185, 76, 0.5);
          margin-bottom: 8px;
        }

        .map-directions-link {
          font-size: 11px;
          font-weight: 750;
          color: var(--gold-300);
          text-decoration: none;
          display: block;
          text-align: center;
          margin-bottom: 8px;
        }

        .address-highlight-box {
          background: rgba(2, 20, 17, 0.55);
          border-radius: 12px;
          padding: 10px 12px;
          border: 1px solid rgba(230, 185, 76, 0.35);
          margin-bottom: 8px;
        }

        .agency-clean-address {
          font-size: 10.5px;
          color: var(--ivory-soft);
          margin: 0;
          line-height: 1.4;
          text-align: center;
        }

        /* =========================================
           MINI FOOTER
        ========================================= */

        .mini-footer {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 2px;
        }

        .mini-footer-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;

          padding: 5px 12px;

          border: 1px solid rgba(230, 185, 76, 0.5);
          border-radius: 999px;
          background: rgba(3, 26, 22, 0.8);

          font-size: 8.5px;
          letter-spacing: 0.3px;
          color: var(--mist);
          line-height: 1.4;
        }

        .mini-footer-pill strong {
          color: var(--gold-300);
          font-weight: 700;
        }

        .mini-footer-dot {
          color: var(--gold-400);
        }

        .mini-footer-pill a {
          color: var(--gold-300);
          font-weight: 700;
          text-decoration: none;
        }

        /* =========================================
           RESPONSIVE GALLERY
        ========================================= */

        @media (max-width: 360px) {
          .cafe-gallery-section {
            padding: 14px 10px 12px;
          }

          .gallery-title {
            font-size: 19px;
          }

          .gallery-image-frame {
            min-height: 190px;
          }

          .gallery-arrow {
            width: 30px;
            height: 30px;
          }

          .gallery-dots {
            gap: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-track {
            transition: none;
          }

          .gallery-dot,
          .gallery-arrow {
            transition: none;
          }
        }

        /* =========================================
           ACCESSIBILITY & MOBILE TOUCH
        ========================================= */

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible,
        a:focus-visible {
          outline: 2px solid var(--gold-300);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}
