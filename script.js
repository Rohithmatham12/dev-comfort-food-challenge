const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const loader = document.querySelector("[data-loader]");
const orderForm = document.querySelector("[data-order-form]");
const summaryBowl = document.querySelector("[data-summary-bowl]");
const summaryCopy = document.querySelector("[data-summary-copy]");
const pickupMeta = document.querySelector("[data-pickup-meta]");
const orderProgress = document.querySelector("[data-order-progress]");
const reservationSteam = document.querySelector("[data-reservation-steam]");
const toastButton = document.querySelector("[data-toast-button]");
const resetOrderButton = document.querySelector("[data-reset-order]");
const toast = document.querySelector("[data-toast]");

let reservationTimer;
let loaderTimer;

const garnishCopy = {
  "Ghee and curry leaves": "ghee and curry leaves",
  "Lemon and coriander": "lemon and coriander",
  "Extra papad": "extra papad",
};

const moodCopy = {
  rainy: {
    label: "Rainy day",
    note: "built for slow windows and crisp papad",
  },
  long: {
    label: "Long workday",
    note: "built to soften the edges of the day",
  },
  homesick: {
    label: "Homesick",
    note: "built for the first spoonful that feels familiar",
  },
};

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function updateOrderSummary() {
  const data = new FormData(orderForm);
  const bowl = data.get("bowl");
  const spice = data.get("spice");
  const mood = data.get("mood");
  const garnish = data.get("garnish");
  const comfort = moodCopy[mood];

  summaryBowl.textContent = bowl;
  summaryCopy.textContent = `${comfort.label} bowl: ${spice} spice with ${garnishCopy[garnish]}, ${comfort.note}.`;
  pickupMeta.textContent = "Pickup window: 12 minutes";
  resetReservationState();
}

function capitalize(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function resetReservationState() {
  window.clearTimeout(reservationTimer);
  orderProgress.hidden = true;
  reservationSteam.hidden = true;
  toast.hidden = true;
  resetOrderButton.hidden = true;
  toastButton.hidden = false;
  toastButton.disabled = false;
  toastButton.textContent = "Reserve pickup";
}

function reservePickup() {
  const pickupCode = Math.floor(100 + Math.random() * 900);

  toast.hidden = true;
  orderProgress.hidden = false;
  toastButton.disabled = true;
  toastButton.textContent = "Simmering...";
  pickupMeta.textContent = "Tempering your order now";

  reservationTimer = window.setTimeout(() => {
    orderProgress.hidden = true;
    reservationSteam.hidden = false;
    toastButton.hidden = true;
    resetOrderButton.hidden = false;
    pickupMeta.textContent = `Pickup code: RH-${pickupCode}`;
    toast.textContent = `Your rasam is resting under a lid. Pickup code RH-${pickupCode}.`;
    toast.hidden = false;
  }, 1100);
}

function showLoaderIfStillLoading() {
  if (!loader) {
    return;
  }

  loader.hidden = false;
  loader.classList.remove("is-hidden");
}

function hideLoader() {
  if (!loader) {
    return;
  }

  window.clearTimeout(loaderTimer);
  if (loader.hidden) {
    return;
  }

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    window.setTimeout(() => {
      loader.hidden = true;
    }, 420);
  }, 220);
}

if (document.readyState !== "complete") {
  loaderTimer = window.setTimeout(showLoaderIfStillLoading, 350);
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

toastButton.addEventListener("click", reservePickup);
resetOrderButton.addEventListener("click", () => {
  resetReservationState();
  orderForm.querySelector("select, input").focus();
});
