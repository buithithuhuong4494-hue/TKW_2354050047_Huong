export function initPricing() {
  const root = document.querySelector("[data-pricing]");

  if (!root) return;

  const toggle = root.querySelector("[data-pricing-toggle]");
  const prices = root.querySelectorAll("[data-price]");
  const periods = root.querySelectorAll("[data-price-period]");

  if (!toggle || !prices.length) return;

  const dong = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

  function updatePrices(yearly) {
    prices.forEach((price) => {
      const value = yearly
        ? Number(price.dataset.yearly)
        : Number(price.dataset.monthly);

      if (value === 0) {
        price.textContent = "Miễn phí";
        return;
      }

      price.textContent = dong.format(value);
    });

    periods.forEach((period) => {
      period.textContent = yearly
        ? "/ năm"
        : "/ tháng";
    });

    toggle.setAttribute(
      "aria-checked",
      String(yearly)
    );

  }

  toggle.addEventListener("click", () => {
    const yearly =
      toggle.getAttribute("aria-checked") !== "true";

    updatePrices(yearly);
  });

  updatePrices(false);
}