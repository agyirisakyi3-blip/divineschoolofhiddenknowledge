# CONTENT.md — what to replace before publishing

Every value on this site is **sample content**. This file is the checklist.

Nothing here is broken — the site works as-is. But publishing it unchanged
would put a fictional address, fictional email addresses and fictional
accreditation on the internet. Accreditation claims in particular are legally
meaningful; please do not ship them as placeholders.

No fee figures are published anywhere on the site — every currency amount was
removed on purpose. See `courses.html` under §3.

**The site was written for an Indian college and you have given a Ghanaian
address.** Location and telephone are now correct, but the degrees,
regulators and email domains still assume India. Read the
"the site was written for India" section in §2 before publishing anything.

---

## 1. The one file to edit first

**`js/site-data.js`** holds everything that appears in more than one place:
name, tagline, established year, address, phone numbers, emails, office hours,
social links, accreditation, admission dates, and the form endpoint.

Edit it once and the header, utility bar, footer, contact details, the
`EducationalOrganization` JSON-LD block and the footer year all update together.
That is why those elements carry `data-dm="..."` attributes and why the footer
contact block is stamped from JavaScript rather than hand-written into each page.

### Already confirmed — no action needed

| Key | Value |
|---|---|
| `phone.main` | +233 59 101 3771 |
| `phone.admissions` | +233 59 101 3771 (same line — add a second number if you have one) |
| `phone.whatsapp` | +233 59 101 3771 |
| `address.city` | Kasoa |
| `address.state` | Central Region |
| `address.country` / `countryName` | GH / Ghana |

One number is currently serving office, admissions and WhatsApp. If you get a
separate admissions line or a Ghana toll-free number (0800 XXX XXX), update
`phone` — every page picks it up automatically.

### Still to change in `js/site-data.js`

| Key | Currently | Replace with |
|---|---|---|
| `name`, `legalName` | Divine Mystical &amp; Ayurvedic College | Your registered name |
| `tagline` | Where tradition meets evidence | Your line, or remove the key |
| `established` | 1987 | Founding year |
| `siteUrl` | `…ayurvedic.edu.in` | **Your real .gh or .com.gh domain** |
| `email.general` | info@…edu.in | Office inbox on your real domain |
| `email.admissions` | admissions@…edu.in | Admissions inbox |
| `email.academics` | academics@…edu.in | Academics inbox |
| `address.line1` / `line2` | empty | Street-level address, if you have one |
| `geo.latitude` / `geo.longitude` | `null` | Campus coordinates |
| `hours.display` | Mon–Sat 9:00–17:00 | Real hours |
| `social.*` | bare platform URLs | Your profile URLs, or delete the key |
| `accreditation[0..3]` | obvious placeholders | **Only what you actually hold** |
| `admissions.batchYear` | 2026 | Current batch |
| `admissions.deadlineLabel` | 31 March 2026 | Real deadline |
| `admissions.deadlineIso` | 2026-03-31 | Real deadline, `YYYY-MM-DD` |

`geo` is `null`, which makes `main.js` omit the `GeoCoordinates` block from the
structured data entirely. That is deliberate — it is better to publish no
coordinates than wrong ones. Add them when you can pin the campus on a map.

---

## ⚠ Read this before publishing: the site was written for India

The copy, degrees and regulators across this site assume an Indian Ayurvedic
college. You have now given a Ghanaian address and number, so a real mismatch
exists. I have fixed the location and phone everywhere, but I cannot invent
Ghanaian regulatory facts, so these are still unresolved and they are the
items most likely to be wrong in front of the public:

1. **Accreditation and recognition.** `accreditation[0..3]` originally claimed
   affiliation to a state Ayurvedic university, recognition by the National
   Council for Indian Systems of Medicine, and NAAC 'A+' accreditation. None of
   that is valid in Ghana. Those values are now obviously-wrong-looking
   placeholders so nobody can mistake them for real claims. Put your genuine
   Ghanaian recognition body and registration number in.

2. **Degree names.** The programmes are called BAMS and MD Ayurveda, and the
   curriculum copy refers to a prescribed syllabus and an affiliating
   university. BAMS is the Indian degree title. Ghana does not use it. Either
   the college awards an Indian-affiliated degree (in which case the site needs
   to say so plainly and address international applicants) or it awards
   something else, in which case every course name, the JSON-LD programme list,
   the application form dropdowns and the FAQ all need renaming. I have not
   guessed.

3. **The regulatory FAQ.** The FAQ on `index.html` used to promise that the
   degree qualifies holders to register as Ayurvedic practitioners *in India*.
   It now says requirements differ by country and tells applicants to confirm
   with the admissions office, because I do not know what a Ghanaian
   qualification entitles them to do.

4. **Registration of the word "Ayurveda".** Traditional Medicine regulation in
   Ghana is administered nationally and differs from India's. Check what the
   college actually needs before publishing any practice-related claim.

5. **Cedu / currency.** No fee is published anywhere on this site, so no
   currency is shown either — nothing to change. If you publish fees later,
   quote in Ghana cedis (GHS) and confirm what the regulator requires.

6. **Email domain and site URL.** Both still use `.edu.in`. A Ghanaian
   institution needs a `.gh` or `.com.gh` domain, and the email addresses must
   match it. Note `data-dm-href` stamps the `mailto:` links at runtime, but the
   hardcoded fallback `mailto:` values in the HTML still say `example.edu.in`
   until JavaScript runs.

7. **Geography check.** You gave "Central Region". Kasoa is commonly described
   as being in the Greater Accra Region, close to the Central Region border
   and roughly 20 km from Accra. I have used your wording exactly as given —
   please confirm which region the campus is legally and administratively in,
   because the address appears in the structured data that search engines read.

8. **Admission dates.** "31 March 2026" came from the Indian academic calendar.
   Ghanaian intakes usually run differently. Update both `deadlineLabel` and
   `deadlineIso`.

### The domain must match in four places

`site-data.js` → `siteUrl` · `robots.txt` → `Sitemap:` · `sitemap.xml` → every
`<loc>` · and the `<link rel="canonical">` + `og:url` in each of the six HTML
files. A mismatch here is the classic cause of "Google thinks I have two sites".

---

## 2. Form submissions

By default **both forms fall back to a `mailto:` hand-off** — they compose a
draft email with the fields laid out, and nothing else. That works with zero
infrastructure, but no structured data is stored and the visitor has to press
send.

To collect submissions properly, set `formEndpoint` in `js/site-data.js`:

```js
formEndpoint: "https://formspree.io/f/YOUR_ID"
```

The JS `POST`s the form as `FormData` and expects any 2xx back. Formspree,
Basin, Getform and your own handler all fit. If the request fails, the form
automatically falls back to the `mailto:` route after 1.2 seconds, so you never
silently lose an application.

You can also set it per form in the HTML, without touching `site-data.js`:

```html
<form data-validate data-endpoint="https://..." data-status="#apply-status">
```

Forms currently on the site:

- `admissions.html` → `#application-form`, status `#apply-status`
- `contact.html` → `#contact-form`, status `#contact-status`

---

## 3. Page-by-page placeholder list

### `index.html`
- Hero stats: `40+ years`, `1,200 alumni`, `60 clinical beds`
- Credential strip — driven by `accreditation[]` in `site-data.js`
- Faculty: Vaidya Dr. S. Raghavan, Prof. Meera Deshmukh, Dr. Anil Vyas
- Testimonials: Dr. A. Kulkarni, Dr. Farhana Nadeem, R. Sundaram
- Notices: three dated announcements

### `about.html`
- Vision / Mission / Values cards
- History timeline — six milestones, 1987 → 2023
- Founder message (Vaidya Shri Krishna Prasad) and Principal message
- Leadership grid: four named people
- Campus stats: 24 faculty, 60 beds, 4 acres, 12 stations, 320 seats
- Accreditation cards — driven by `accreditation[]`

### `courses.html`
Seven programmes. Each card carries a duration, eligibility, mode, seat count
and the level, mode and seat count in its `.spec-list`.

**No fee figures are published anywhere on this site.** Every currency amount
was removed deliberately, so there is nothing to replace here. Fees are stated
in writing in each offer letter, and the `#fees` section on `courses.html` is a
"published on request" block rather than a price list.

If you later decide to publish fees on the site, that is a legal question
before it is a content one — Indian regulations expect fee information to be
published accurately and prospectively for each intake. Check the current
requirements with the affiliating university, then add a table back under
`courses.html#fees` and a `Fee` row back to each `.spec-list`.

Still placeholder, and still needing replacement: **seat counts**
(120/30/40/40/30/24) and the BAMS curriculum breakdown.

The `<script type="application/ld+json">` block in `courses.html` lists the
seven programme names. Update it if you rename or add a programme.

### `admissions.html`
- Six-step process
- Eligibility table (minimum qualification, subject, min. age)
- Document checklist
- Scholarship and hostel details
- **Important dates table** — eight dates from 15 Dec 2025 to 1 Aug 2026
- Admissions FAQ — five items, mirrored in the `FAQPage` JSON-LD at the top of
  the file. **If you edit a FAQ answer, edit the JSON-LD too**, or Google will
  show stale text.

### `contact.html`
- Address block — **hardcoded as well as driven by `site-data.js`**, on purpose:
  this is the page that must rank for local search, so the NAP text is in the
  static HTML. Update it together with `site-data.js`.
- Department directory table — six rows, inboxes and extensions are placeholders
- "How to reach us" travel times and the local landmark are invented
- Privacy notice and Terms of use are **drafts, not legal advice.** Have your
  own adviser review both before publishing. They currently live at
  `contact.html#privacy` and `contact.html#terms`.

---

## 4. Images

`assets/img/` is intentionally empty. Each `.slot` box shows the exact
filename it wants. Drop in a file with that name and it appears automatically
— no HTML edits. See `assets/img/README.md` for the full list and target sizes.

### The logo

`assets/logo.jpg` is a copy of your original `school logo.jpeg`.

- It is **864 × 1079 px, portrait, 24-bit RGB with no alpha channel.** No
  transparency means it will render as a rectangle on any background, so it is
  seated inside a cream card with a gold hairline border (`.brand__mark`) to
  make that read as deliberate.
- It is **154 KB** and is loaded twice per page (header + footer). It is not
  the heaviest thing on the page, but you can halve it easily: export a
  ~200 × 250 px version at quality 80 and use that instead. The `.brand__mark`
  box is 44 × 54 px, so 2× would be about 100 × 130 px. Keep the full-size
  original for print.
- If you export a PNG with transparency, remove the card styling by deleting the
  `background`, `border` and `box-shadow` lines from `.brand__mark` in
  `css/styles.css`.
- I could not view the file (no image input in this build), so I have not
  verified that the mark actually reads well at 44 px wide. **Check it in a
  browser and tell me if it is illegible** — the fix is either a simplified
  mark for the header or a wider `.brand__mark`.

### Favicon

The favicon is an inline SVG lotus in brand colours, so there is no `.ico` to
supply. If you have a real icon, drop it at `assets/favicon.ico` and change
the `<link rel="icon">` line in all six HTML files.

### Social preview image

No `og:image` is set, deliberately — a broken image URL is worse than none.
Once you have a photograph that represents the campus, add to every page's
`<head>`:

```html
<meta property="og:image" content="https://your-domain/assets/img/og-cover.jpg">
<meta name="twitter:image" content="https://your-domain/assets/img/og-cover.jpg">
```

Recommended: **1200 × 630 px**, under 300 KB.

---

## 5. Adding a page

1. Copy any existing `.html` file. The header, footer and `<head>` are already
   correct — keep them identical so the nav stays consistent.
2. Set `aria-current="page"` on that page's nav link, and remove it from the
   others.
3. Add the URL to `sitemap.xml` with a real `<loc>`.
4. Run `python tools/check-links.py`. It will fail on a missing canonical, a
   duplicate id, a missing `alt`, or more than one `<h1>`.

---

## 6. Legal and regulatory notes

Things a real college site has that this one does not yet:

- **Registration / consent banner.** Required in India under the IT Rules and
  the DPDP Act if you collect personal data. Both forms currently ask for
  consent inline, which is a reasonable minimum but is not a cookie banner.
- **Grievance redressal officer**, with a published name and contact. Statutory
  for many institutions.
- **Anti-ragging and anti-harassment** committee details.
- **Fee refund and scholarship policy** as a downloadable document. Currently
  summarised on `courses.html#fees` and `admissions.html#scholarships`, with no
  actual figures published anywhere.
- **Mandatory disclosure** of any exam or affiliation conditions.

None of these are legal advice. Have them checked.

---

## 7. Verifying changes

```bash
python tools/check-links.py
```

Standard library only, no install. Checks every internal link and anchor,
missing `alt` attributes, duplicate ids, `h1` count per page, title and
description length, `lang`, canonical tags, and every `aria-controls` /
`aria-labelledby` / `aria-describedby` target. It exits non-zero on any error,
so it works as a pre-deploy gate.

To preview:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from disk also works — the scripts are plain
globals, not ES modules, specifically so `file://` does not break.

---

## 8. Deploying

Static files. Upload the whole folder to any host — Netlify, GitHub Pages,
Vercel, cPanel, S3, or plain Apache.

- Keep the file names and folder structure exactly as they are.
- `404.html` is picked up automatically by most hosts.
- Nothing here needs a server, a build step, or Node.
- If you deploy to GitHub Pages, add an empty file named `.nojekyll` to the root
  so Jekyll does not eat the underscore-prefixed directories (there are none
  now, but it costs nothing to prevent).
