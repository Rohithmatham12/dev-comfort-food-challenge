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
const comfortLabel = document.querySelector("[data-comfort-label]");
const comfortMeter = document.querySelector("[data-comfort-meter]");
const comfortMeterShell = document.querySelector("[data-comfort-meter-shell]");
const comfortNote = document.querySelector("[data-comfort-note]");
const summaryEta = document.querySelector("[data-summary-eta]");
const summaryTotal = document.querySelector("[data-summary-total]");
const toastButton = document.querySelector("[data-toast-button]");
const resetOrderButton = document.querySelector("[data-reset-order]");
const copyReceiptButton = document.querySelector("[data-copy-receipt]");
const toast = document.querySelector("[data-toast]");

let reservationTimer;
let loaderTimer;
let currentPickupCode = "";
let currentReceipt = "";

const garnishCopy = {
  "Ghee and curry leaves": "ghee and curry leaves",
  "Lemon and coriander": "lemon and coriander",
  "Extra papad": "extra papad",
};

const moodCopy = {
  rainy: {
    label: "Rainy day",
    note: "built for slow windows and crisp papad",
    comfort: "Slow warm",
    detail: "Best with the window cracked open and papad on the side.",
    eta: 12,
    meter: 82,
  },
  long: {
    label: "Long workday",
    note: "built to soften the edges of the day",
    comfort: "Deep reset",
    detail: "Best eaten without rushing, preferably before opening another tab.",
    eta: 10,
    meter: 74,
  },
  homesick: {
    label: "Homesick",
    note: "built for the first spoonful that feels familiar",
    comfort: "Full heart",
    detail: "Best with extra rasam poured around the rice like a small moat.",
    eta: 14,
    meter: 92,
  },
};

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function updateOrderSummary() {
  const data = new FormData(orderForm);
  const bowlSelect = orderForm.elements.bowl;
  const selectedBowl = bowlSelect.options[bowlSelect.selectedIndex];
  const bowl = selectedBowl.value;
  const price = Number(selectedBowl.dataset.price);
  const spice = data.get("spice");
  const mood = data.get("mood");
  const garnish = data.get("garnish");
  const comfort = moodCopy[mood];

  summaryBowl.textContent = bowl;
  summaryCopy.textContent = `${comfort.label} bowl: ${spice} spice with ${garnishCopy[garnish]}, ${comfort.note}.`;
  comfortLabel.textContent = comfort.comfort;
  comfortMeter.style.width = `${comfort.meter}%`;
  comfortMeterShell.setAttribute("aria-valuenow", String(comfort.meter));
  comfortMeterShell.setAttribute("aria-valuetext", `${comfort.comfort}, ${comfort.meter} percent`);
  comfortNote.textContent = comfort.detail;
  summaryEta.textContent = `${comfort.eta} minutes`;
  summaryTotal.textContent = `$${price}`;
  pickupMeta.textContent = `Pickup window: ${comfort.eta} minutes`;
  currentReceipt = `${bowl} - ${comfort.label}, ${spice} spice, ${garnishCopy[garnish]}. Ready in ${comfort.eta} minutes. Total: $${price}.`;
  resetReservationState();
}

function resetReservationState() {
  window.clearTimeout(reservationTimer);
  orderProgress.hidden = true;
  reservationSteam.hidden = true;
  toast.hidden = true;
  resetOrderButton.hidden = true;
  copyReceiptButton.hidden = true;
  toastButton.hidden = false;
  toastButton.disabled = false;
  toastButton.textContent = "Reserve pickup";
  toastButton.closest(".summary").setAttribute("aria-busy", "false");
  currentPickupCode = "";
}

function reservePickup() {
  const pickupCode = Math.floor(100 + Math.random() * 900);
  currentPickupCode = `RH-${pickupCode}`;

  toast.hidden = true;
  orderProgress.hidden = false;
  toastButton.disabled = true;
  toastButton.textContent = "Simmering...";
  toastButton.closest(".summary").setAttribute("aria-busy", "true");
  pickupMeta.textContent = "Tempering your order now";

  reservationTimer = window.setTimeout(() => {
    orderProgress.hidden = true;
    reservationSteam.hidden = false;
    toastButton.hidden = true;
    resetOrderButton.hidden = false;
    copyReceiptButton.hidden = false;
    pickupMeta.textContent = `Pickup code: ${currentPickupCode}`;
    toast.textContent = `Your rasam is resting under a lid. Pickup code ${currentPickupCode}.`;
    toastButton.closest(".summary").setAttribute("aria-busy", "false");
    toast.hidden = false;
  }, 1100);
}

async function copyPickupNote() {
  const note = `${currentReceipt} Pickup code: ${currentPickupCode}.`;

  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard unavailable");
    }

    await navigator.clipboard.writeText(note);
    copyReceiptButton.textContent = "Pickup note copied";
  } catch {
    copyReceiptButton.textContent = "Pickup note ready";
  }

  window.setTimeout(() => {
    copyReceiptButton.textContent = "Copy pickup note";
  }, 1400);
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
copyReceiptButton.addEventListener("click", copyPickupNote);
