const state = {
  dogName: "Milo",
  temperature: 88,
  humidity: 58,
  pavement: "warm",
  duration: 20,
  dogSize: "medium",
  shortNose: false,
  senior: false,
  darkCoat: false,
};

const el = {
  name: document.querySelector("#dog-name"),
  temp: document.querySelector("#temperature"),
  tempLabel: document.querySelector("[data-temp-label]"),
  humidity: document.querySelector("#humidity"),
  humidityLabel: document.querySelector("[data-humidity-label]"),
  pavement: document.querySelector("#pavement"),
  duration: document.querySelector("#duration"),
  size: [...document.querySelectorAll('input[name="dog-size"]')],
  shortNose: document.querySelector("#short-nose"),
  senior: document.querySelector("#senior"),
  darkCoat: document.querySelector("#dark-coat"),
  pill: document.querySelector("[data-risk-pill]"),
  title: document.querySelector("[data-result-title]"),
  copy: document.querySelector("[data-result-copy]"),
  score: document.querySelector("[data-score]"),
  ring: document.querySelector("[data-score-ring]"),
  walkWindow: document.querySelector("[data-walk-window]"),
  pawCheck: document.querySelector("[data-paw-check]"),
  list: document.querySelector("[data-plan-list]"),
  copyPlan: document.querySelector("[data-copy-plan]"),
  copyStatus: document.querySelector("[data-copy-status]"),
  aiButton: document.querySelector("[data-ai-button]"),
  aiOutput: document.querySelector("[data-ai-output]"),
  geminiKey: document.querySelector("#gemini-key"),
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateScore() {
  let score = 0;
  score += (state.temperature - 55) * 1.45;
  score += Math.max(0, state.humidity - 35) * 0.28;
  score += Number(state.duration) * 0.45;

  if (state.pavement === "warm") score += 11;
  if (state.pavement === "hot") score += 25;
  if (state.dogSize === "small") score += 6;
  if (state.dogSize === "large") score += 4;
  if (state.shortNose) score += 15;
  if (state.senior) score += 14;
  if (state.darkCoat) score += 8;

  return Math.round(clamp(score, 4, 100));
}

function getLevel(score) {
  if (score < 42) return "safe";
  if (score < 72) return "moderate";
  return "high";
}

function makePlan(score, level) {
  const name = state.dogName || "Your dog";
  const plans = [];

  if (level === "safe") {
    plans.push(`Walk plan: ${state.duration} minutes is reasonable if ${name} is relaxed.`);
    plans.push("Bring water anyway. Dog Days weather changes quickly.");
    plans.push("Choose a route with shade breaks, even if the score is green.");
  } else if (level === "moderate") {
    plans.push(`Shorten the route for ${name}: aim for 10 to 15 minutes and sniff breaks.`);
    plans.push("Carry water and pause before panting turns heavy.");
    plans.push("Use grass, dirt, or shade instead of long pavement stretches.");
  } else {
    plans.push(`Skip the long walk for ${name}. Choose a potty break plus indoor enrichment.`);
    plans.push("Try a towel treat roll, frozen lick mat, scent boxes, or gentle training reps.");
    plans.push("If you must go out, wait until pavement cools and keep it under 10 minutes.");
  }

  if (state.shortNose) plans.push("Short-nosed dogs can overheat faster, so lower the walk intensity.");
  if (state.senior) plans.push("Senior, puppy, or recovering dogs need extra recovery time.");
  if (state.pavement === "hot") plans.push("Paw rule: if your palm cannot stay on the ground, paws should not either.");

  return plans;
}

function render() {
  state.dogName = el.name.value.trim() || "Your dog";
  state.temperature = Number(el.temp.value);
  state.humidity = Number(el.humidity.value);
  state.pavement = el.pavement.value;
  state.duration = Number(el.duration.value);
  state.dogSize = el.size.find((item) => item.checked)?.value || "medium";
  state.shortNose = el.shortNose.checked;
  state.senior = el.senior.checked;
  state.darkCoat = el.darkCoat.checked;

  el.tempLabel.textContent = state.temperature;
  el.humidityLabel.textContent = state.humidity;

  const score = calculateScore();
  const level = getLevel(score);
  const name = state.dogName;
  const levelLabel = level === "safe" ? "Low" : level === "moderate" ? "Moderate" : "High";
  const plan = makePlan(score, level);

  el.pill.textContent = levelLabel;
  el.pill.className = `risk-pill ${level === "safe" ? "safe" : level === "high" ? "high" : ""}`;
  el.title.textContent =
    level === "safe"
      ? `${name} has a green-light walk.`
      : level === "moderate"
        ? `${name} needs a slower, shaded walk.`
        : `${name} needs a cooler backup plan.`;
  el.copy.textContent =
    level === "safe"
      ? "Still watch for panting, pace changes, and hot ground."
      : level === "moderate"
        ? "Keep the route short, bring water, and choose shade when possible."
        : "The safest win is a short potty loop and a fun indoor plan.";
  el.score.textContent = score;
  el.ring.style.setProperty("--score", score);
  el.ring.setAttribute("aria-valuenow", String(score));

  el.walkWindow.textContent =
    level === "safe"
      ? "Best window: morning or evening"
      : level === "moderate"
        ? "Best window: after sunset"
        : "Best window: tomorrow morning";
  el.pawCheck.textContent =
    state.pavement === "hot"
      ? "Pavement check: too hot means no exposed paws."
      : "Pavement check: hold your palm down for 7 seconds.";

  el.list.replaceChildren(
    ...plan.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );
}

function currentPlanText() {
  return [
    `PawPace plan for ${state.dogName}`,
    `Weather: ${state.temperature}°F, ${state.humidity}% humidity, ${state.pavement} pavement`,
    ...makePlan(calculateScore(), getLevel(calculateScore())),
  ].join("\n");
}

async function copyPlan() {
  try {
    await navigator.clipboard.writeText(currentPlanText());
    el.copyStatus.textContent = "Copied the walk plan.";
  } catch {
    el.copyStatus.textContent = "Copy failed. You can still select the plan manually.";
  }
}

async function generateAiPlan() {
  const key = el.geminiKey.value.trim();
  if (!key) {
    el.aiOutput.textContent =
      "Add a Google AI Studio API key to generate a custom plan. The rule-based PawPace plan is already complete without a key.";
    return;
  }

  el.aiButton.disabled = true;
  el.aiOutput.textContent = "Asking Google AI for a dog-safe enrichment plan...";

  const prompt = `Create a concise, friendly dog enrichment plan for ${state.dogName}.
Weather risk score: ${calculateScore()}/100.
Temperature: ${state.temperature}F. Humidity: ${state.humidity}%.
Pavement: ${state.pavement}. Planned walk: ${state.duration} minutes.
Dog size: ${state.dogSize}. Short-nosed: ${state.shortNose}. Senior/puppy/recovering: ${state.senior}. Thick or dark coat: ${state.darkCoat}.
Give 4 numbered actions, include safety cautions, and avoid veterinary diagnosis.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!response.ok) throw new Error(`Google AI request failed: ${response.status}`);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    el.aiOutput.textContent = text || "Google AI responded, but no plan text was returned.";
  } catch (error) {
    el.aiOutput.textContent = `${error.message}\n\nFallback idea:\n${currentPlanText()}`;
  } finally {
    el.aiButton.disabled = false;
  }
}

document.querySelectorAll("input, select").forEach((input) => {
  input.addEventListener("input", render);
  input.addEventListener("change", render);
});
el.copyPlan.addEventListener("click", copyPlan);
el.aiButton.addEventListener("click", generateAiPlan);

render();
