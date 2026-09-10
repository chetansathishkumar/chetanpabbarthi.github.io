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

// Close mobile nav after choosing a link
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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
);

sections.forEach((section) => observer.observe(section));
