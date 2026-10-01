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
| `siteUrl` | `…-college.example` | **Your real .gh or .com.gh domain** |
| `email.general` | info@…-college.example | Office inbox on your real domain |
| `email.admissions` | admissions@…-college.example | Admissions inbox |
| `email.academics` | academics@…-college.example | Academics inbox |
| `address.line1` / `line2` | empty | Street-level address, if you have one |
| `geo.latitude` / `geo.longitude` | `null` | Campus coordinates |
| `hours.display` | Mon–Sat 9:00–17:00 | Real hours |
| `social.*` | bare platform URLs | Your profile URLs, or delete the key |
| `admissions.batchYear` | 2026 | Current batch |
| `admissions.deadlineLabel` | Dates to be confirmed | Real deadline |
| `admissions.deadlineIso` | empty | Real deadline, `YYYY-MM-DD` |

The `accreditation` key has been **deleted**, not filled in. See below.

`geo` is `null`, which makes `main.js` omit the `GeoCoordinates` block from the
structured data entirely. That is deliberate — it is better to publish no
coordinates than wrong ones. Add them when you can pin the campus on a map.

---

## Accreditation status: settled, and it is the important one

The site was originally written as though this were an accredited Indian
Ayurvedic college. It is not, and the college is in Ghana. **You have confirmed
that the college is not accredited.** Every claim to the contrary has been
removed rather than softened:

- The four-column credential strip on the home page (affiliation, recognition,
  accreditation grade, ISO certification) is **gone**.
- The "Affiliation & accreditation" section on `about.html` is **gone**, replaced
  by a plain "Where we actually stand" statement.
- The `accreditation` array in `js/site-data.js` is **deleted**. Do not
  reinstate it with placeholder text — if you gain real accreditation, put the
  actual certifying body and registration number in.
- Programmes were renamed from BAMS / MD Ayurveda to **Professional Diploma in
  Ayurvedic Medicine** and **Advanced Diploma in Ayurvedic Practice**. Every
  course name, ID, JSON-LD entry, anchor link, form dropdown and eligibility row
  was updated to match. Two course IDs changed, so any inbound links to
  `courses.html#bams` or `#md-ayurveda` will now 404.
- The home-page FAQ no longer promises registration. It says the honest thing:
  these awards do **not** on their own entitle the holder to register or
  practise as a healthcare practitioner, in Ghana or anywhere else.
- `contact.html` terms repeat the same position, so the disclaimer is not only
  on the marketing pages.
- Entry requirements were rewritten as the college's own criteria. The old
  table deferred to an affiliating university and to Indian qualification
  titles (10+2, BAMS, GNM, BPT); those are now WASSCE/BECE equivalents and
  diploma-level equivalents.
- Testimonial attributions were Ghanaianised and stripped of "Dr." and
  "BAMS 2014 · Pune" style credentials.

**Why this matters legally.** Advertising a qualification you do not hold is a
consumer-protection problem in Ghana, and medical-adjacent claims carry
additional exposure. Publishing the shortfall plainly is both safer and more
credible than leaving fake credentials for someone to catch.

If the college applies for recognition later, update the three `.clarifier`
blocks — `index.html`, `about.html` and `courses.html` — together, so they
never contradict each other.

## Still placeholders — the original India/Ghana mismatches

These are resolved as far as I can take them without inventing facts:

1. **Degree names.** Resolved as above: all awards are diplomas and
   certificates of training issued by the college. If that changes, every
   course name needs renaming again.

2. **The regulatory FAQ.** Rewritten to state plainly that the awards confer no
   registration entitlement. The intake FAQ on `admissions.html` no longer
   refers to an affiliating university or a national commission.

3. **Registration of the word "Ayurveda".** Still worth checking. Ghana
   regulates traditional medicine nationally and differently from India —
   confirm what the college actually needs to be permitted to call itself an
   Ayurvedic college and to run these programmes.

4. **Cedu / currency.** No fee is published anywhere on this site, so no
   currency appears either. If you publish fees later, quote in Ghana cedis
   (GHS).

5. **Email domain and site URL.** Both now use `.example`, which is reserved by
   IANA and can never be registered. Nothing resolves — canonical and `og:url`
   tags point to an unreachable host, and the `mailto:` form fallback will
   bounce. This must be fixed before launch.

6. **Geography check.** You confirmed **Central Region**, so that is what the
   site says, including in the structured data. Worth noting that Kasoa is
   often described as Greater Accra; if the legal registration differs, change
   `address.state`.

7. **Admission dates.** The inherited "31 March 2026" was an Indian academic
   calendar date and has been replaced with "Dates to be confirmed". Set both
   `deadlineLabel` and `deadlineIso` when the real intake date is known.

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
- Status notice — a `.clarifier` stating the college is not accredited
- Faculty: Vaidya Dr. S. Raghavan, Prof. Meera Deshmukh, Dr. Anil Vyas
- Testimonials: A. Kumi, F. Nartey, R. Sowah
- Notices: three dated announcements

### `about.html`
- Vision / Mission / Values cards
- History timeline — six milestones, 1987 → 2023
- Founder message (Vaidya Shri Krishna Prasad) and Principal message
- Leadership grid: four named people
- Campus stats: 24 faculty, 60 beds, 4 acres, 12 stations, 320 seats
- "Where we actually stand" — a `.clarifier` stating the non-accredited status

### `courses.html`
Seven programmes. Each card carries a duration, eligibility, mode, seat count
and the level, mode and seat count in its `.spec-list`.

**No fee figures are published anywhere on this site.** Every currency amount
was removed deliberately, so there is nothing to replace here. Fees are stated
in writing in each offer letter, and the `#fees` section on `courses.html` is a
"published on request" block rather than a price list.

If you later decide to publish fees on the site, that is a legal question
before it is a content one — check what Ghana's regulator requires for fee
disclosure, then add a table back under `courses.html#fees` and a `Fee` row back
to each `.spec-list`.

The page also opens with a `.clarifier` under the heading "What these
qualifications are" (`#qualification-status`). It is the honest version of what
used to be an accreditation claim, and it is linked from the eligibility table
on `admissions.html` and the intake FAQ on `index.html`.

Still placeholder, and still needing replacement: **seat counts**
(120/30/40/40/30/24) and the curriculum breakdown shown on the professional
diploma card.

Course IDs that changed during the renaming — fix any inbound links you control:
- `courses.html#bams` → `#diploma-ayurvedic-medicine`
- `courses.html#md-ayurveda` → `#advanced-diploma-ayurveda`

The `<script type="application/ld+json">` block in `courses.html` lists the
seven programme names. Update it if you rename or add a programme.

### `admissions.html`
- Six-step process
- Eligibility table (minimum qualification, subject, min. age)
- Document checklist
- Scholarship and hostel details
- **Important dates table** — placeholder dates; the deadline row now reads
  "Dates to be confirmed" until you supply real ones
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
