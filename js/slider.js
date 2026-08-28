export function initSlider() {
  const root = document.querySelector("[data-slider]");

  if (!root) return;

  const track = root.querySelector("[data-slider-track]");
  const slides = Array.from(root.querySelectorAll("[data-slide]"));
  const prevButton = root.querySelector("[data-slider-prev]");
  const nextButton = root.querySelector("[data-slider-next]");
  const dotsRoot = root.querySelector("[data-slider-dots]");

  if (
    !track ||
    !slides.length ||
    !prevButton ||
    !nextButton ||
    !dotsRoot
  ) {
    return;
  }

  let index = 0;
  let timer = null;

  function go(next) {
    index = (next + slides.length) % slides.length;

    track.style.transform = `translateX(-${index * 100}%)`;

    slides.forEach((slide, i) => {
      slide.toggleAttribute("inert", i !== index);
    });

    const dots = dotsRoot.querySelectorAll("button");

    dots.forEach((dot, i) => {
      const active = i === index;

      dot.setAttribute("aria-current", active ? "true" : "false");

      dot.classList.toggle("bg-brand-600", active);
      dot.classList.toggle("bg-line", !active);
    });
  }

  function createDots() {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className =
        "h-2.5 w-2.5 rounded-full bg-line transition-colors";

      dot.setAttribute(
        "aria-label",
        `Xem cảm nhận ${i + 1}`
      );

      dot.addEventListener("click", () => {
        go(i);
      });

      dotsRoot.append(dot);
    });
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();

    timer = setInterval(() => {
      go(index + 1);
    }, 5000);
  }

  prevButton.addEventListener("click", () => {
    go(index - 1);
  });

  nextButton.addEventListener("click", () => {
    go(index + 1);
  });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);

  root.addEventListener("focusin", stop);

  root.addEventListener("focusout", (event) => {
    if (!root.contains(event.relatedTarget)) {
      start();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  createDots();
  go(0);
  start();
}