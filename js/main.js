/* ==========================================================================
   DIVINE MYSTICAL & AYURVEDIC COLLEGE — behaviour layer.

   No framework, no dependencies. ~5KB unminified. Every feature degrades:
   without JS the content is fully readable and the nav (which is hardcoded
   in each HTML file) still works.
   ========================================================================== */

(function () {
  "use strict";

  var data = window.DMC || {};
  var root = document.documentElement;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  root.classList.remove("no-js");

  /* --- utils --------------------------------------------------------- */

  function resolve(path) {
    if (!data || !path) return "";
    var out = path.split(".").reduce(function (acc, key) {
      return acc == null ? undefined : acc[key];
    }, data);
    return out == null ? "" : String(out);
  }

  function schemeFor(node, value) {
    var type = node.getAttribute("data-dm-scheme");
    if (type === "tel") return "tel:" + value.replace(/[^\d+]/g, "");
    if (type === "mailto") return "mailto:" + value;
    if (type === "url") return value;
    return value;
  }

  /* Inject shared contact details from site-data.js. The visible footer
     contact block is stamped from here so the address and phone can never
     drift out of sync between the pages that render it. */
  function hydrateSiteData() {
    document.querySelectorAll("[data-dm]").forEach(function (node) {
      node.textContent = resolve(node.getAttribute("data-dm"));
    });

    document.querySelectorAll("[data-dm-href]").forEach(function (node) {
      var value = resolve(node.getAttribute("data-dm-href"));
      if (value) node.setAttribute("href", schemeFor(node, value));
    });

    document.querySelectorAll("[data-dm-src]").forEach(function (node) {
      var value = resolve(node.getAttribute("data-dm-src"));
      if (value) node.setAttribute("src", value);
    });

    document.querySelectorAll("[data-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  /* EducationalOrganization JSON-LD, stamped from the same source so the
     structured data can never contradict the visible footer. */
  function injectSchema() {
    if (!data.siteUrl) return;

    var a = data.address || {};
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: data.name,
      legalName: data.legalName,
      url: data.siteUrl,
      foundingDate: data.established,
      description:
        "Ayurvedic college offering BAMS, MD and diploma programmes in " +
        "Ayurveda, Panchakarma, herbal pharmacy and yoga therapy.",
      telephone: data.phone && data.phone.main,
      email: data.email && data.email.general,
      address: {
        "@type": "PostalAddress",
        streetAddress: [a.line1, a.line2].filter(Boolean).join(", "),
        addressLocality: a.city,
        addressRegion: a.state,
        postalCode: a.postalCode,
        addressCountry: a.country
      },
      geo: data.geo
        ? { "@type": "GeoCoordinates", latitude: data.geo.latitude, longitude: data.geo.longitude }
        : undefined,
      sameAs: Object.keys(data.social || {}).map(function (k) {
        return data.social[k];
      })
    });
    document.head.appendChild(script);
  }

  /* --- sticky header -------------------------------------------------- */

  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;
    function update() {
      header.setAttribute("data-scrolled", String(window.scrollY > 8));
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* --- mobile navigation drawer --------------------------------------- */

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function isOpen() {
      return document.body.getAttribute("data-nav-open") === "true";
    }

    function focusables() {
      return Array.prototype.filter.call(nav.querySelectorAll(FOCUSABLE), function (el) {
        return el.offsetParent !== null;
      });
    }

    function open() {
      document.body.setAttribute("data-nav-open", "true");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-is-open");
      var first = focusables()[0];
      if (first) first.focus();
    }

    function close(returnFocus) {
      document.body.setAttribute("data-nav-open", "false");
      document.body.classList.remove("nav-is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      isOpen() ? close(true) : open();
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen()) return;

      if (event.key === "Escape") {
        close(true);
        return;
      }

      if (event.key !== "Tab") return;

      var items = focusables();
      if (!items.length) return;

      var first = items[0];
      var last = items[items.length - 1];
      var active = document.activeElement;

      if (event.shiftKey && (active === first || !nav.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });

    /* Following a link should close the drawer */
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && isOpen()) close(false);
    });

    /* Leaving the mobile breakpoint must never strand the locked body */
    var desktop = window.matchMedia("(min-width: 901px)");
    function onBreakpoint(event) {
      if (event.matches) close(false);
    }
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }

  /* --- scroll reveal --------------------------------------------------- */

  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.setAttribute("data-reveal", "in");
      });
      return;
    }

    /* Mark anything already at or above the fold synchronously, so removing
       .no-js never causes a flash of visible content. */
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute("data-reveal", "in");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-reveal", "in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    items.forEach(function (el) {
      if (el.getAttribute("data-reveal") !== "in") observer.observe(el);
    });
  }

  /* --- accordion -------------------------------------------------------- */

  function initAccordions() {
    document.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      function setState(expanded) {
        trigger.setAttribute("aria-expanded", String(expanded));
        panel.setAttribute("data-open", String(expanded));
        /* Collapsed panels are clipped by the grid animation but would stay
           focusable, so mark them inert while shut. */
        if (expanded) panel.removeAttribute("inert");
        else panel.setAttribute("inert", "");
      }

      setState(trigger.getAttribute("aria-expanded") === "true");

      trigger.addEventListener("click", function () {
        setState(trigger.getAttribute("aria-expanded") !== "true");
      });
    });
  }

  /* --- course filter ---------------------------------------------------- */

  function initFilters() {
    document.querySelectorAll("[data-filter-group]").forEach(function (group) {
      var target = document.getElementById(group.getAttribute("data-filter-group"));
      if (!target) return;

      var cards = Array.prototype.slice.call(target.querySelectorAll("[data-level]"));
      var buttons = Array.prototype.slice.call(group.querySelectorAll(".filter"));
      var status = document.getElementById(group.getAttribute("data-filter-status"));

      function apply(level, activeBtn) {
        var shown = 0;

        cards.forEach(function (card) {
          var match = level === "all" || card.getAttribute("data-level").indexOf(level) > -1;
          card.hidden = !match;
          if (match) shown++;
        });

        buttons.forEach(function (btn) {
          btn.setAttribute("aria-pressed", String(btn === activeBtn));
        });

        if (status) {
          status.textContent =
            shown + (shown === 1 ? " programme" : " programmes") +
            (level === "all" ? " available." : " in this category.");
        }
      }

      group.addEventListener("click", function (event) {
        var btn = event.target.closest(".filter");
        if (!btn || !group.contains(btn)) return;
        apply(btn.getAttribute("data-filter"), btn);
      });
    });
  }

  /* --- form validation & submit ----------------------------------------- */

  function initForms() {
    document.querySelectorAll("form[data-validate]").forEach(function (form) {
      var status = document.querySelector(
        form.getAttribute("data-status") || "#" + (form.id + "-status")
      );

      function fieldOf(control) {
        return control.closest(".field") || control.parentElement;
      }

      function messageFor(control) {
        var field = fieldOf(control);
        var custom = field && field.querySelector("[data-error-text]");
        if (custom && custom.textContent.trim()) return custom.textContent.trim();

        if (control.validity.valueMissing) {
          return control.type === "checkbox" || control.type === "radio"
            ? "Please complete this option."
            : "This field is required.";
        }
        if (control.validity.typeMismatch && control.type === "email") {
          return "Enter a valid email address, e.g. name@example.com.";
        }
        if (control.validity.typeMismatch && control.type === "tel") {
          return "Enter a valid phone number, including the country code.";
        }
        if (control.validity.tooShort) {
          return "Please write at least " + control.minLength + " characters.";
        }
        if (control.validity.rangeUnderflow) return "That value is too small.";
        if (control.validity.patternMismatch) return "Please match the requested format.";
        return "Please check this field.";
      }

      function validate(control) {
        var field = fieldOf(control);
        var ok = control.checkValidity();
        if (field) field.setAttribute("data-invalid", String(!ok));
        control.setAttribute("aria-invalid", String(!ok));
        return ok;
      }

      var controls = Array.prototype.slice.call(
        form.querySelectorAll("input, select, textarea")
      );

      controls.forEach(function (control) {
        control.addEventListener("blur", function () {
          if (control.value !== "" || control.hasAttribute("required")) validate(control);
        });
        control.addEventListener("input", function () {
          var field = fieldOf(control);
          if (field && field.getAttribute("data-invalid") === "true") validate(control);
        });
      });

      function mailtoFallback() {
        var lines = [];
        new FormData(form).forEach(function (value, key) {
          if (key.startsWith("_") || value === "") return;
          lines.push(key.replace(/-/g, " ").replace(/\b\w/g, function (c) {
            return c.toUpperCase();
          }) + ": " + value);
        });

        var to = (data.email && data.email.admissions) || (data.email && data.email.general) || "";
        var subject = (form.getAttribute("data-subject") || "Website enquiry") + " — " + data.name;
        var body = lines.join("\n");

        window.location.href =
          "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      }

      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var invalid = controls.filter(function (control) {
          return !validate(control);
        });

        if (invalid.length) {
          if (status) {
            status.setAttribute("data-state", "error");
            status.innerHTML =
              "<strong>Not sent yet.</strong> " + invalid.length +
              (invalid.length === 1 ? " field needs" : " fields need") +
              " your attention — see the notes below.";
          }
          invalid[0].focus();
          invalid[0].scrollIntoView({ block: "center", behavior: reducedMotion.matches ? "auto" : "smooth" });
          return;
        }

        var endpoint = form.getAttribute("data-endpoint") || data.formEndpoint || "";

        if (!endpoint) {
          if (status) {
            status.setAttribute("data-state", "pending");
            status.innerHTML =
              "<strong>Opening your email client.</strong> Your details have been laid out " +
              "in a draft message. Press send there, or ask us to call you back.";
          }
          mailtoFallback();
          return;
        }

        if (status) {
          status.setAttribute("data-state", "pending");
          status.innerHTML = "<strong>Sending…</strong> Please hold on a moment.";
        }

        var submit = form.querySelector('[type="submit"]');
        if (submit) submit.disabled = true;

        fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        })
          .then(function (response) {
            if (!response.ok) throw new Error("HTTP " + response.status);
            if (status) {
              status.setAttribute("data-state", "success");
              status.innerHTML =
                "<strong>Thank you — your enquiry has reached us.</strong> " +
                "Our " + (form.getAttribute("data-team") || "admissions") +
                " team replies within two working days.";
            }
            form.reset();
            controls.forEach(function (control) {
              var field = fieldOf(control);
              if (field) field.setAttribute("data-invalid", "false");
              control.removeAttribute("aria-invalid");
            });
          })
          .catch(function () {
            if (status) {
              status.setAttribute("data-state", "error");
              status.innerHTML =
                "<strong>We could not send that.</strong> Please try again, or email " +
                'us directly at <a href="mailto:' +
                ((data.email && data.email.general) || "") +
                '">our office</a>.';
            }
            window.setTimeout(mailtoFallback, 1200);
          })
          .then(function () {
            if (submit) submit.disabled = false;
          });
      });
    });
  }

  /* --- floating WhatsApp button ------------------------------------------ */

  /* Injected rather than written into six pages, and built from the same
     phone.whatsapp value as the rest of the contact details. Nothing is
     added if the number is missing, so removing it from site-data.js is
     enough to remove it from the site. */
  function initWhatsAppButton() {
    var url = data.whatsapp && data.whatsapp.url;
    if (!url) return;

    var a = document.createElement("a");
    a.className = "wa-fab";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Message us on WhatsApp");

    a.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M20.52 3.48A12.07 12.07 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.88c0 2.1.55 4.14 1.59 5.95L0 24l6.31-1.66a12.09 12.09 0 0 0 5.73 1.45h.01c6.54 0 11.88-5.34 11.88-11.88 0-3.17-1.24-6.15-3.48-8.39zm-8.48 18.3a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.74.98.98-3.65-.24-.37a9.87 9.87 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.88-9.88a9.84 9.84 0 0 1 6.99 2.9 9.84 9.84 0 0 1 2.9 6.99c0 5.45-4.43 9.88-9.88 9.88m5.46-7.45c-.3-.15-1.77-.87-2.05-.97s-.47-.15-.67.15-.77.97-.95 1.17-.35.22-.65.08a8.15 8.15 0 0 1-2.4-1.48 9.02 9.02 0 0 1-1.66-2.07c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5a.53.53 0 0 0-.02-.52c-.08-.15-.67-1.61-.92-2.2-.24-.57-.49-.5-.67-.5h-.58c-.2 0-.52.08-.79.37-.27.3-1.03 1.01-1.03 2.46s1.06 2.86 1.21 3.06c.15.2 2.08 3.18 5.05 4.46.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.2-.58-.35z"/>' +
      "</svg>";

    document.body.appendChild(a);
  }

  /* --- boot ------------------------------------------------------------- */

  function boot() {
    hydrateSiteData();
    injectSchema();
    initHeader();
    initNav();
    initReveal();
    initAccordions();
    initFilters();
    initForms();
    initWhatsAppButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
