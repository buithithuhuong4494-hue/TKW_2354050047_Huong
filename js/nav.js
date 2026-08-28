export function initNav() {
  const header = document.querySelector("header");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");

  if (!header || !toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Đóng menu" : "Mở menu"
    );
    document.body.classList.toggle("overflow-hidden", open);
  }

  toggle.addEventListener("click", () => {
    const open =
      toggle.getAttribute("aria-expanded") !== "true";

    setOpen(open);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (!isOpen) return;

    setOpen(false);
    toggle.focus();
  });

  document.addEventListener("click", (event) => {
    const isOpen =
      toggle.getAttribute("aria-expanded") === "true";

    if (!isOpen) return;

    if (header.contains(event.target)) return;

    setOpen(false);
  });

  const desktop = window.matchMedia("(min-width: 1024px)");

  desktop.addEventListener("change", (event) => {
    if (event.matches) {
      setOpen(false);
    }
  });
}


export function initHeaderOnScroll() {
  const header = document.querySelector("header");
  const sentinel = document.getElementById("nav-sentinel");

  if (!header || !sentinel) return;

  const observer = new IntersectionObserver(([entry]) => {
    const scrolled = !entry.isIntersecting;

    header.classList.toggle("shadow-sm", scrolled);
  });

  observer.observe(sentinel);
}

export function initToTop() {
  const button = document.querySelector("[data-to-top]");

  if (!button) return;

  function updateVisibility() {
    const show = window.scrollY > 400;

    button.classList.toggle("hidden", !show);
  }

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("scroll", updateVisibility);

  updateVisibility();
}