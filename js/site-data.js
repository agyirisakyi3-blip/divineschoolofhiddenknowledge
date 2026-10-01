/* ==========================================================================
   SITE DATA — the single place to edit shared details.

   Everything here is SAMPLE CONTENT. Replace every value marked TODO before
   publishing. See CONTENT.md for the full replacement checklist.

   Loaded as a plain global (no ES module) so the site also works when opened
   directly from disk via file://.
   ========================================================================== */

window.DMC = {
  /* --- Identity ------------------------------------------------------- */
  name: "Divine Mystical & Ayurvedic College",
  shortName: "Divine Ayurvedic",
  legalName: "Divine Mystical & Ayurvedic College",
  tagline: "Where tradition meets evidence",
  established: "1987",

  /* PLACEHOLDER DOMAIN. `.example` is reserved by IANA and can never be
     registered, so nothing here resolves and canonical/og:url tags point
     nowhere. The college has no domain yet.

     TODO before publishing: buy a .gh or .com.gh domain, then update this,
     the email addresses below, and every <link rel="canonical">,
     sitemap.xml and robots.txt together. Search engines will penalise the
     site for canonicals pointing to an unreachable host. */
  siteUrl: "https://www.divine-ayurvedic-college.example",

  /* --- Contact -------------------------------------------------------- */
  phone: {
    /* Real number, supplied 2026. One line serves all enquiries until a
       separate admissions number exists. In Ghana, toll-free numbers are
       written 0800 XXX XXX; keep the +233 country code for international
       callers and for correct tel: links. */
    main: "+233 59 101 3771",
    admissions: "+233 59 101 3771",
    whatsapp: "+233 59 101 3771"
  },

  email: {
    /* TODO: real inboxes. These point at the reserved .example domain and will
       bounce. Register the domain first, then point these at live addresses.
       Note the forms fall back to a mailto: built from these values, so
       submissions are lost until this is fixed. */
    general: "info@divine-ayurvedic-college.example",
    admissions: "admissions@divine-ayurvedic-college.example",
    academics: "academics@divine-ayurvedic-college.example"
  },

  address: {
    /* Town, region and country confirmed. No street-level address has been
       supplied yet — add line1 (and line2 if needed) as soon as you have one.
       Pick-up directions on contact.html depend on it.

       `country` is the ISO 3166-1 alpha-2 code, used by schema.org.
       `countryName` is what visitors see. */
    line1: "",
    line2: "",
    city: "Kasoa",
    state: "Central Region",
    postalCode: "",
    country: "GH",
    countryName: "Ghana"
  },

  geo: {
    /* TODO: real coordinates for the campus itself. Left as null so that no
       wrong GeoCoordinates are published in the structured data — main.js
       omits the geo block entirely when this is null. Pin the exact campus
       location and paste the latitude and longitude here. */
    latitude: null,
    longitude: null
  },

  /* --- Hours (24h, used for schema.org openingHours) ------------------- */
  hours: {
    weekdays: "09:00",
    saturday: "09:00",
    sunday: "10:00",
    close: "17:00",
    display: "Mon–Sat 9:00–17:00 · Sun 10:00–14:00",
    displaySat: "Mon–Fri 9:00–17:00 · Sat 9:00–13:00"
  },

  /* --- Social --------------------------------------------------------- */
  /* TODO: real profile URLs, or remove the key to hide the icon */
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    linkedin: "https://linkedin.com/"
  },

  /* --- Accreditation --------------------------------------------------
     The college is NOT accredited and holds no university affiliation.

     The accreditation array that used to live here has been removed, along
     with the four-column credential strip that displayed it. Both had been
     asserting recognition the college does not hold — including, in an
     earlier draft, the National Council for Indian Systems of Medicine and
     NAAC 'A+' accreditation, neither of which is valid in Ghana.

     The site now states its status openly instead, in a .clarifier block on
     index.html, about.html and courses.html. Do not reintroduce a
     credentials strip unless every value is a real, verifiable award.
  --------------------------------------------------------------------- */

  /* --- Admissions -----------------------------------------------------
     TODO: these dates were placeholders carried over from an earlier draft.
     Confirm the real intake deadline with the admissions office, or leave
     them unset. A published deadline that has already passed — or one that
     was never real — is worse than no date at all. */
  admissions: {
    batchYear: "2026",
    applicationsOpen: true,
    deadlineLabel: "Dates to be confirmed",
    deadlineIso: ""
  },

  /* --- Forms ----------------------------------------------------------
     Leave FORM_ENDPOINT empty and both forms fall back to a mailto:
     hand-off, so they work on day one with no backend.

     To collect structured submissions, paste a form endpoint here
     (Formspree, Basin, Getform, or your own handler) and it takes over
     automatically. Expected contract: POST url-encoded form fields, return
     any 2xx status.
  --------------------------------------------------------------------- */
  formEndpoint: ""
};

/* --------------------------------------------------------------------------
   Derived address strings, so the footer, the contact page and the structured
   data can never drift apart when you edit `address` above. Pages read these
   with data-dm="address.summary" / data-dm="address.full".
   -------------------------------------------------------------------------- */
(function (d) {
  var a = d.address || {};
  var town = [a.city, a.postalCode].filter(Boolean).join(" ");
  var parts = [a.line1, a.line2, town, a.state].filter(Boolean);

  a.summary = parts.join(", ");
  a.full = (a.summary ? a.summary + ", " : "") + (a.countryName || "");

  /* WhatsApp deep link, derived from phone.whatsapp so the number is only
     ever written down once. wa.me needs digits only — no +, spaces or dashes.
     The message is prefilled so the applicant does not start from a blank
     box; edit it freely, and URL-encode it if you use & or #. */
  var waNumber = ((d.phone && d.phone.whatsapp) || "").replace(/\D/g, "");
  d.whatsapp = {
    display: (d.phone && d.phone.whatsapp) || "",
    message: "Hello, I would like to enquire about admissions at " +
             (d.name || "your college") + ".",
    url: waNumber
      ? "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(
          "Hello, I would like to enquire about admissions at " +
          (d.name || "your college") + ".")
      : ""
  };
})(window.DMC);
