# assets/img/

This folder is empty on purpose. Every image placeholder on the site shows the
exact filename it is waiting for.

**How it works:** each placeholder is a `.slot` box with a fixed `aspect-ratio`
and a caption naming the expected file. Drop a file in with that name and it
covers the box automatically — no HTML editing required. If the file is absent,
you get a clean gold-tagged placeholder instead of a broken-image icon.

If a photo does not match the aspect ratio it is cropped with
`object-fit: cover`, centred. Compose your shot with the centre in mind.

---

## Required filenames

### Campus — 16:9

| File | Where it appears | Suggested source size |
|---|---|---|
| `campus-exterior.jpg` | `index.html` | 1600 × 900 |
| `panchakarma-theatre.jpg` | `index.html` | 1600 × 900 |
| `plant-garden.jpg` | `index.html` | 1600 × 900 |
| `facility-hospital.jpg` | `about.html` | 1600 × 900 |
| `facility-library.jpg` | `about.html` | 1600 × 900 |
| `facility-hostel.jpg` | `about.html` | 1600 × 900 |

### Faculty — 3:4 portrait

| File | Where it appears |
|---|---|
| `faculty-01.jpg` | `index.html` — Principal |
| `faculty-02.jpg` | `index.html` — Head of Department |
| `faculty-03.jpg` | `index.html` — Sanskrit faculty |
| `lead-01.jpg` | `about.html` — Principal |
| `lead-02.jpg` | `about.html` — Dean |
| `lead-03.jpg` | `about.html` — Registrar |
| `lead-04.jpg` | `about.html` — Placement officer |
| `founder.jpg` | `about.html` — Founder |
| `principal.jpg` | `about.html` — Principal message |

### Social preview — 1200 × 630

| File | Notes |
|---|---|
| `og-cover.jpg` | Not yet referenced. See `CONTENT.md` §4 to switch it on. |

---

## Technical requirements

- **Format:** `.jpg` for photographs. `.webp` works too — just update the `src`
  in the HTML.
- **Quality:** export at 75–82. A 1600 × 900 photo at that quality is roughly
  180–280 KB, which is fine.
- **Colour space:** sRGB. Not Display P3 — it shifts the saffron and gold in the
  page once decoded.
- **File size target:** under 350 KB per image. Anything larger will show up as
  a slow first paint, and this is a content site where speed is the whole game.
- **Add `loading="lazy"` and `decoding="async"`** to any new `<img>` you insert
  by hand, except the header logo which already uses `fetchpriority="high"`.

---

## What would strengthen this site most

In rough order of impact:

1. **The panchakarma theatre, in use.** One good photograph of students working
   under supervision tells an applicant more than any paragraph of copy. Make
   sure faces and consent of patients are handled appropriately.
2. **The medicinal plant garden.** Labelled species in the background is a
   stronger proof of pharmacognosy teaching than any claim.
3. **A real clinic room.** Shows the practical standard.
4. **The pharmacy / Bhaishajya Kalpana lab.** Rarely photographed, and it is a
   genuine differentiator.
5. **Founder and principal portraits.** These carry the trust signal for
   parents more than student life does.
6. **Hostel and campus life.** Younger applicants decide on this.

Avoid: stock photography of unrelated ayurvedic imagery, heavily filtered shots
that shift the palette away from the site's saffron and gold, and anything
where a patient's face is identifiable without written consent.
