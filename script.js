const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------
// Theme toggle (light/dark), persisted in localStorage
// ---------------------------------------------------------------
function applyThemeUI(theme) {
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    const icon = btn.querySelector(".theme-toggle__icon");
    if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  });
}

// Reflect whatever the inline head script already set on <html>
applyThemeUI(document.documentElement.getAttribute("data-theme") || "light");

document.querySelectorAll(".theme-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    applyThemeUI(next);
  });
});

// ---------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------
// Skill table: build dot indicators from data-level (1-5)
// ---------------------------------------------------------------
document.querySelectorAll(".dots").forEach((el) => {
  const level = parseInt(el.getAttribute("data-level"), 10) || 0;
  for (let i = 1; i <= 5; i++) {
    const dot = document.createElement("i");
    if (i <= level) dot.classList.add("is-filled");
    el.appendChild(dot);
  }
});

// ---------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------
const rail = document.getElementById("rail");
const navToggle = document.getElementById("navToggle");

navToggle.addEventListener("click", () => {
  const isOpen = rail.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".rail__link").forEach((link) => {
  link.addEventListener("click", () => {
    rail.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------------------------------------------------------------
// Scroll-spy: highlight the current section in the rail nav
// ---------------------------------------------------------------
const sections = document.querySelectorAll(".page[id]");
const navLinks = document.querySelectorAll(".rail__link");

const setActive = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === id);
  });
};

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);
sections.forEach((section) => spyObserver.observe(section));

// ---------------------------------------------------------------
// Scroll reveal: fade + rise elements into view once
// ---------------------------------------------------------------
const revealEls = document.querySelectorAll(".reveal");
if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// ---------------------------------------------------------------
// Count-up numbers (hero stats)
// ---------------------------------------------------------------
function animateCount(el) {
  const target = parseInt(el.dataset.countTarget, 10) || 0;
  const pad = parseInt(el.dataset.pad, 10) || 0;
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(eased * target);
    el.textContent = String(value).padStart(pad, "0");
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countEls = document.querySelectorAll(".count-up");
if (prefersReducedMotion) {
  countEls.forEach((el) => {
    const target = parseInt(el.dataset.countTarget, 10) || 0;
    const pad = parseInt(el.dataset.pad, 10) || 0;
    el.textContent = String(target).padStart(pad, "0");
  });
} else {
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  countEls.forEach((el) => countObserver.observe(el));
}

// ---------------------------------------------------------------
// Text scramble on the hero headline (runs once on load)
// ---------------------------------------------------------------
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01#$%_";

function scrambleInto(el, finalText, delay) {
  const len = finalText.length;
  let frame = 0;
  const totalFrames = len * 3;

  setTimeout(() => {
    const interval = setInterval(() => {
      let output = "";
      const revealedCount = Math.floor((frame / totalFrames) * len);
      for (let i = 0; i < len; i++) {
        if (i < revealedCount) {
          output += finalText[i];
        } else if (finalText[i] === " ") {
          output += " ";
        } else {
          output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      el.textContent = output;
      frame++;
      if (frame > totalFrames) {
        el.textContent = finalText;
        clearInterval(interval);
      }
    }, 28);
  }, delay);
}

const scrambleLines = document.querySelectorAll(".scramble-line");
scrambleLines.forEach((el, i) => {
  const text = el.dataset.text || "";
  if (prefersReducedMotion) {
    el.textContent = text;
  } else {
    scrambleInto(el, text, i * 220);
  }
});

// ---------------------------------------------------------------
// Magnetic buttons: nudge toward cursor on hover
// ---------------------------------------------------------------
if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.18}px, ${relY * 0.3}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
}

// ---------------------------------------------------------------
// Cursor spotlight glow, confined to the hero section, desktop only
// ---------------------------------------------------------------
const spotlight = document.getElementById("spotlight");
const heroSection = document.getElementById("home");

if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches && spotlight && heroSection) {
  heroSection.addEventListener("mouseenter", () => spotlight.classList.add("is-active"));
  heroSection.addEventListener("mouseleave", () => spotlight.classList.remove("is-active"));
  heroSection.addEventListener("mousemove", (e) => {
    spotlight.style.setProperty("--x", `${e.clientX}px`);
    spotlight.style.setProperty("--y", `${e.clientY}px`);
  });
}
