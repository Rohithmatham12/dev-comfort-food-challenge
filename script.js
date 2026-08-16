const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const loader = document.querySelector("[data-loader]");
const orderForm = document.querySelector("[data-order-form]");
const summaryBowl = document.querySelector("[data-summary-bowl]");
const summaryCopy = document.querySelector("[data-summary-copy]");
const toastButton = document.querySelector("[data-toast-button]");
const toast = document.querySelector("[data-toast]");

const garnishCopy = {
  "Ghee and curry leaves": "ghee and curry leaves",
  "Lemon and coriander": "lemon and coriander",
  "Extra papad": "extra papad",
};

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function updateOrderSummary() {
  const data = new FormData(orderForm);
  const bowl = data.get("bowl");
  const spice = data.get("spice");
  const garnish = data.get("garnish");

  summaryBowl.textContent = bowl;
  summaryCopy.textContent = `${capitalize(spice)} spice with ${garnishCopy[garnish]}. Ready in 12 minutes.`;
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function hideLoader() {
  if (!loader) {
    return;
  }

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
  }, 650);
}

if (document.readyState === "complete") {
  hideLoader();
} else {
  window.addEventListener("load", hideLoader, { once: true });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

orderForm.addEventListener("change", updateOrderSummary);
updateOrderSummary();

toastButton.addEventListener("click", () => {
  toast.hidden = false;
  toastButton.textContent = "Pickup reserved";
  toastButton.disabled = true;
});
