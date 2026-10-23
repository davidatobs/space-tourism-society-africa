(function () {
  "use strict";

  // Header scroll state & mobile navigation toggle
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 36 || header.dataset.alwaysSolid === "true") {
      header.classList.add("is-solid");
    } else {
      header.classList.remove("is-solid");
    }
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      mobileMenu.classList.toggle("is-open", !expanded);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.setAttribute("aria-expanded", "false");
        mobileMenu.classList.remove("is-open");
      });
    });
  }

  // Accessible programme tabs (Home page)
  const tabButtons = Array.from(document.querySelectorAll('[role="tab"][data-tab-target]'));
  const tabPanels = Array.from(document.querySelectorAll('[role="tabpanel"][data-tab-panel]'));

  function activateTab(button, moveFocus) {
    const targetId = button.getAttribute("data-tab-target");
    tabButtons.forEach(function (btn) {
      const isSelected = btn === button;
      btn.setAttribute("aria-selected", String(isSelected));
      btn.tabIndex = isSelected ? 0 : -1;
    });
    tabPanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-tab-panel") !== targetId;
    });
    if (moveFocus) {
      button.focus();
    }
  }

  tabButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      activateTab(button, false);
    });

    button.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const nextIndex =
        event.key === "ArrowRight"
          ? (index + 1) % tabButtons.length
          : (index - 1 + tabButtons.length) % tabButtons.length;
      activateTab(tabButtons[nextIndex], true);
    });
  });

  // Chronological milestone filter
  const filterChips = Array.from(document.querySelectorAll("[data-era-filter]"));
  const timelineRows = Array.from(document.querySelectorAll("[data-era]"));

  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      const selectedEra = chip.getAttribute("data-era-filter");
      filterChips.forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-pressed", String(c === chip));
      });
      timelineRows.forEach(function (row) {
        if (selectedEra === "all") {
          row.hidden = false;
        } else {
          row.hidden = row.getAttribute("data-era") !== selectedEra;
        }
      });
    });
  });

  // Pre-fill programme interest on membership page when linked via ?track=...
  const params = new URLSearchParams(window.location.search);
  const preselectedTrack = params.get("track");
  const interestSelect = document.getElementById("interest-area");
  if (preselectedTrack && interestSelect) {
    Array.from(interestSelect.options).forEach(function (opt) {
      if (opt.value.toLowerCase() === preselectedTrack.toLowerCase()) {
        interestSelect.value = opt.value;
      }
    });
  }

  // Static-host-friendly Membership & Chapter Application handler
  const form = document.getElementById("stsa-membership-form");
  const statusBox = document.getElementById("form-status");
  const mailtoBtn = document.getElementById("open-mailto-btn");
  const copyBtn = document.getElementById("copy-application-btn");
  const downloadBtn = document.getElementById("download-application-btn");

  let latestPacketText = "";
  let latestReferenceCode = "";

  function buildPacket(data) {
    const submittedDate = new Date().toISOString().slice(0, 10);
    const ref =
      "STSA-" +
      submittedDate.replace(/-/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
    latestReferenceCode = ref;

    const lines = [
      "SPACE TOURISM SOCIETY AFRICA (STSA)",
      "Official Membership / Chapter & Delegation Application",
      "------------------------------------------------------------",
      "Reference ID:           " + ref,
      "Date Prepared:          " + submittedDate,
      "Title & Full Name:      " + data.title + " " + data.fullName,
      "Gender:                 " + data.gender,
      "Country of Residence:   " + data.country,
      "Email Address:          " + data.email,
      "Telephone / WhatsApp:   " + data.phone,
      "Affiliated Institution: " + data.institution,
      "Qualification Level:    " + data.qualification,
      "Current Role/Position:  " + data.position,
      "Primary Space Track:    " + data.interest,
      "------------------------------------------------------------",
      "Statement of Interest & National Space Agency Context:",
      data.statement,
      "------------------------------------------------------------",
      "Regional Secretariat: Lead City University & Mokola Roundabout, Ibadan, Nigeria",
      "Official Dispatch: stsregionalpresident@carnasrda.com | spacemediatechnologies@yahoo.com"
    ];

    return lines.join("\n");
  }

  if (form && statusBox) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      // Simple honeypot check matching official form spam protection
      const honey = form.querySelector('input[name="website_check"]');
      if (honey && honey.value.trim() !== "") return;

      const formData = new FormData(form);
      const payload = {
        title: String(formData.get("title") || "").trim(),
        fullName: String(formData.get("full_name") || "").trim(),
        gender: String(formData.get("gender") || "").trim(),
        country: String(formData.get("country") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        institution: String(formData.get("institution") || "").trim(),
        qualification: String(formData.get("qualification") || "").trim(),
        position: String(formData.get("position") || "").trim(),
        interest: String(formData.get("interest") || "").trim(),
        statement: String(formData.get("statement") || "").trim()
      };

      latestPacketText = buildPacket(payload);

      const subject = encodeURIComponent(
        "STSA Membership Application [" + latestReferenceCode + "] - " + payload.fullName
      );
      const body = encodeURIComponent(latestPacketText);
      const mailtoHref =
        "mailto:stsregionalpresident@carnasrda.com?cc=spacemediatechnologies@yahoo.com&subject=" +
        subject +
        "&body=" +
        body;

      if (mailtoBtn) {
        mailtoBtn.setAttribute("href", mailtoHref);
      }

      const refSpan = document.getElementById("application-ref");
      if (refSpan) {
        refSpan.textContent = latestReferenceCode;
      }

      statusBox.hidden = false;
      statusBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      if (!latestPacketText) return;
      navigator.clipboard.writeText(latestPacketText).then(function () {
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied to clipboard";
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 2200);
      });
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      if (!latestPacketText) return;
      const blob = new Blob([latestPacketText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (latestReferenceCode || "STSA-Application") + ".txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
})();
