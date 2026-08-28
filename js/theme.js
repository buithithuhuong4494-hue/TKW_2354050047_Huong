export function initTheme() {
  const toggle = document.querySelector("[data-theme-toggle]");

  if (!toggle) return;

  const root = document.documentElement;

  function syncButton() {
    const dark = root.classList.contains("dark");

    toggle.setAttribute("aria-pressed", String(dark));

    const icon = toggle.querySelector("[aria-hidden='true']");

    if (icon) {
      icon.textContent = dark ? "☀" : "☾";
    }
  }

  toggle.addEventListener("click", () => {
    const dark = !root.classList.contains("dark");

    root.classList.toggle("dark", dark);

    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );

    syncButton();
  });

  syncButton();
}