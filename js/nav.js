export function initNav() {
  // Tiết 2 sẽ làm
}


export function initHeaderOnScroll() {
  // Tiết 2 sẽ làm
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