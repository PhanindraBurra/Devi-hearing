# Devi Care Speech & Hearing Clinic — Official Website

Modern, responsive, production-quality website built for **Devi Care Speech and Hearing Clinic** (Devi Care Hearing), serving Amalapuram, Rajahmundry, and the Konaseema region in Andhra Pradesh, India.

🔗 **Google Business Listing:** [https://share.google/zYegRBufM2jDKkhES](https://share.google/zYegRBufM2jDKkhES)  
📞 **Primary / WhatsApp Contact:** +91 88855 57633  
⭐ **Google Rating:** 4.9 / 5.0 (37+ Verified Patient Reviews)  
🕒 **Operating Hours:** Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)  
📍 **Address:** Door No 26-3-23, Opposite Hitech Bus Stand, Hitech Busstand Road, Kambala Peta, Rajahmundry - 533101 (Serving Amalapuram & East Godavari)

---

## 🎨 Brand Identity & Theme
Built strictly from the official **DEVI Care** logo palette:
* **Primary Emerald Green:** `#008C43`
* **Deep Forest Green:** `#056332`
* **Vitality Mint Accent:** `#10B981`
* **Medical Cross Gold Swirl:** `#C2B067`
* **Light Herbal Tint Background:** `#F4FAF6`
* **Pure Surface:** `#FFFFFF`
* **Accessible Dark Slate Text:** `#12241A`

## ✨ Key Features
1. **Interactive Ear Soundwave Intro Animation:**
   * Features glowing anatomical ear emblem emitting acoustic ripples and dynamic audio equalizer waves.
   * Includes harmonic clarity chime using the browser's Web Audio API.
   * Replayable via the *"Sound Experience"* button in the hero section.
2. **Ambient Acoustic Background Animations:**
   * Gentle floating SVG ear silhouettes and soundwave streams drifting subtly in the background across sections.
   * GPU-accelerated 3D CSS transforms (`translate3d`), zero overflow, fully responsive on mobile, tablet, and desktop.
3. **Single-Line Top Announcement Bar:**
   * Elegant non-wrapping layout: `Location • Phone • Hours • Live IST Status Badge`.
4. **Balanced Navigation Header:**
   * Centered navigation links, non-wrapping quick-call pill, and prominent *"Book Appointment"* CTA with ample breathing room.
5. **Interactive 1-Minute Hearing Health Screener:**
   * 4-question interactive self-check that computes an instant auditory score and guidance.
6. **Clinical Services & Technology Showcase:**
   * Computerized Pure Tone Audiometry (PTA)
   * Miniature In-Canal Hearing Aids (looks like earpods)
   * Speech & Language Therapy (child delays, fluency/stuttering)
   * Hearing Aid Repair & Earmold Services
7. **Filterable Photo Gallery & Lightbox:**
   * 12 photos in WebP (6 authentic listing photos + 6 medical placeholders).
8. **WhatsApp Appointment Booking Integration:**
   * Form pre-populates name, phone, date, and requested service directly into WhatsApp chat.
9. **Single Source of Truth (`/data/clinic.json`):**
   * Edit clinic hours, phone numbers, addresses, reviews, and services in one simple JSON file.

## 📁 Project Structure
```
├── assets/
│   ├── icons/       # Favicon SVG and PNG
│   ├── images/      # 12 optimized clinic, product, and medical photos (WebP)
│   └── logo/        # Vector SVG logo, white card badge logo, and original source
├── data/
│   └── clinic.json  # Centralized clinic data, reviews, hours, services & checklist
├── index.html       # Semantic HTML5 website structure
├── style.css        # Vanilla CSS design system with logo-derived tokens
└── app.js           # Dynamic data hydration, intro controller & interactive widgets
```

## 🚀 Running Locally
Open `index.html` directly in your browser or run a lightweight local server:
```bash
python -m http.server 8085
```
Then visit `http://localhost:8085`.
