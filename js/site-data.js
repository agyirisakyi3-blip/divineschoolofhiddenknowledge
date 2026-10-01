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

  /* TODO: confirm this domain is registered to you, then update SITE_URL,
     the email addresses below, and sitemap.xml / robots.txt together.
     NOTE: the college is in Ghana, so an .edu.in domain (and any @…edu.in
     addresses below) is the Indian equivalent and will not be available.
     Use a .gh or .com.gh domain and matching email addresses. */
  siteUrl: "https://www.divinemysticalayurvedic.edu.in",

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
    /* TODO: real inboxes — and see the siteUrl note above. These .edu.in
       addresses will not work for a Ghanaian institution. */
    general: "info@divinemysticalayurvedic.edu.in",
    admissions: "admissions@divinemysticalayurvedic.edu.in",
    academics: "academics@divinemysticalayurvedic.edu.in"
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
     These were written for an Indian college and are NOT valid for Ghana.
     The placeholders below are deliberately obvious so nobody can mistake
     them for real claims — replace every value with recognition you actually
     hold before publishing. Accreditation and registration claims are
     legally meaningful, and Traditional Medicine regulation differs between
     Ghana and India: what was true for the old values is not true here.
  --------------------------------------------------------------------- */
  accreditation: [
    { label: "Affiliated to", value: "Add your affiliating institution" },
    { label: "Recognised by", value: "Add your recognition body" },
    { label: "Institutional grade", value: "Add your accreditation grade" },
    { label: "ISO certified", value: "Add your certification" }
  ],

  /* --- Admissions ----------------------------------------------------- */
  /* TODO: real dates and deadline */
  admissions: {
    batchYear: "2026",
    applicationsOpen: true,
    deadlineLabel: "31 March 2026",
    deadlineIso: "2026-03-31"
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
