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
  location: "Austin",
  weatherSource: "manual",
  uvIndex: null,
};

const el = {
  name: document.querySelector("#dog-name"),
  location: document.querySelector("#location"),
  weatherButton: document.querySelector("[data-weather-button]"),
  weatherStatus: document.querySelector("[data-weather-status]"),
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
  heatBar: document.querySelector("[data-heat-bar]"),
  pawBar: document.querySelector("[data-paw-bar]"),
  hydrationBar: document.querySelector("[data-hydration-bar]"),
  reportButton: document.querySelector("[data-report-button]"),
  fallbackReport: document.querySelector("[data-fallback-report]"),
  downloadReport: document.querySelector("[data-download-report]"),
  reportStatus: document.querySelector("[data-report-status]"),
  reportHeading: document.querySelector("[data-report-heading]"),
  reportNote: document.querySelector("[data-report-note]"),
  reportRisk: document.querySelector("[data-report-risk]"),
  reportWindow: document.querySelector("[data-report-window]"),
  reportTreat: document.querySelector("[data-report-treat]"),
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

function calculateBreakdown() {
  const heat = clamp(
    (state.temperature - 55) * 1.55 +
      Math.max(0, state.humidity - 40) * 0.32 +
      (state.shortNose ? 12 : 0) +
      (state.senior ? 10 : 0) +
      (state.darkCoat ? 7 : 0) +
      (state.uvIndex ? state.uvIndex * 1.3 : 0),
    0,
    100,
  );
  const paw =
    state.pavement === "hot"
      ? 92
      : state.pavement === "warm"
        ? clamp(42 + (state.temperature - 80) * 1.35, 20, 82)
        : clamp((state.temperature - 72) * 0.85, 6, 42);
  const hydration = clamp(Number(state.duration) * 1.25 + Math.max(0, state.temperature - 75), 10, 100);

  return {
    heat: Math.round(heat),
    paw: Math.round(paw),
    hydration: Math.round(hydration),
  };
}

function getLevel(score) {
  if (score < 42) return "safe";
  if (score < 72) return "moderate";
  return "high";
}

function levelColor(level) {
  if (level === "safe") return "var(--safe)";
  if (level === "high") return "var(--hot)";
  return "var(--warm)";
}

function makePlan(score, level) {
  const name = state.dogName || "Your dog";
  const plans = [];

  if (level === "safe") {
    plans.push(`${state.duration} min ok`);
    plans.push("Bring water");
    plans.push("Use shade breaks");
  } else if (level === "moderate") {
    plans.push("10-15 min max");
    plans.push("Water break");
    plans.push("Grass over pavement");
  } else {
    plans.push("Potty loop only");
    plans.push("Indoor puzzle");
    plans.push("Wait for cool ground");
  }

  if (state.shortNose) plans.push("Extra heat caution");
  if (state.senior) plans.push("More recovery");
  if (state.pavement === "hot") plans.push("No bare paws");

  return plans;
}

function render() {
  state.dogName = el.name.value.trim() || "Your dog";
  state.location = el.location.value.trim() || "your area";
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
  const breakdown = calculateBreakdown();

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
  el.ring.style.setProperty("--risk-color", levelColor(level));
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

  el.heatBar.style.setProperty("--bar", breakdown.heat);
  el.heatBar.textContent = `Heat load ${breakdown.heat}%`;
  el.pawBar.style.setProperty("--bar", breakdown.paw);
  el.pawBar.textContent = `Paw risk ${breakdown.paw}%`;
  el.hydrationBar.style.setProperty("--bar", breakdown.hydration);
  el.hydrationBar.textContent = `Hydration need ${breakdown.hydration}%`;

  el.list.replaceChildren(
    ...plan.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );

  renderFallbackReport();
}

function currentPlanText() {
  const uvText = state.uvIndex === null ? "UV unavailable" : `UV ${state.uvIndex}`;
  return [
    `PawPace plan for ${state.dogName}`,
    `Weather: ${state.temperature}°F, ${state.humidity}% humidity, ${uvText}, ${state.pavement} pavement`,
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
Location/weather source: ${state.location}, ${state.weatherSource}. Temperature: ${state.temperature}F. Humidity: ${state.humidity}%. UV index: ${state.uvIndex ?? "unknown"}.
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

async function useLiveWeather() {
  const location = el.location.value.trim();
  if (!location) {
    el.weatherStatus.textContent = "Add a city first.";
    return;
  }

  el.weatherButton.disabled = true;
  el.weatherStatus.textContent = "Looking up live weather...";

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) throw new Error("Location lookup failed.");
    const geoData = await geoResponse.json();
    const place = geoData.results?.[0];
    if (!place) throw new Error("Location not found.");

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,uv_index&temperature_unit=fahrenheit&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) throw new Error("Weather lookup failed.");
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    if (!current) throw new Error("No current weather returned.");

    const temp = Math.round(current.temperature_2m);
    const humidity = Math.round(current.relative_humidity_2m);
    state.uvIndex = Number.isFinite(current.uv_index) ? Math.round(current.uv_index * 10) / 10 : null;
    state.weatherSource = `${place.name}${place.admin1 ? `, ${place.admin1}` : ""}`;

    el.temp.value = clamp(temp, Number(el.temp.min), Number(el.temp.max));
    el.humidity.value = clamp(humidity, Number(el.humidity.min), Number(el.humidity.max));
    el.weatherStatus.textContent = `Live: ${state.weatherSource}, ${temp}°F, ${humidity}% humidity${state.uvIndex === null ? "" : `, UV ${state.uvIndex}`}`;
    render();
  } catch (error) {
    el.weatherStatus.textContent = `${error.message} Manual sliders still work.`;
  } finally {
    el.weatherButton.disabled = false;
  }
}

function reportDetails() {
  const score = calculateScore();
  const level = getLevel(score);
  const levelLabel = level === "safe" ? "low" : level === "moderate" ? "medium" : "high";
  const rating = level === "safe" ? 9 : level === "moderate" ? 6 : 3;
  const window =
    level === "safe" ? "morning or evening" : level === "moderate" ? "after sunset" : "tomorrow morning";
  const treat =
    level === "safe"
      ? "shade sniff walk"
      : level === "moderate"
        ? "puzzle toy"
        : "frozen lick mat";
  const note =
    level === "safe"
      ? `I vote yes, but bring water and let me sniff the shady parts. My paws like careful humans.`
      : level === "moderate"
        ? `Today was a ${rating}/10 walk day, buddy. Pavement felt spicy, so make it short, shady, and full of water breaks. Also I want a ${treat}.`
        : `I love walks, but this is a ${rating}/10 outside day. Quick potty trip, then indoor games where my paws do not sizzle.`;

  return { score, level, levelLabel, rating, window, treat, note };
}

function renderFallbackReport() {
  const details = reportDetails();
  el.reportHeading.textContent = `${state.dogName} rates this plan ${details.rating}/10 tail wags.`;
  el.reportNote.textContent = details.note;
  el.reportRisk.textContent = `${details.levelLabel} risk (${details.score}/100)`;
  el.reportWindow.textContent = details.window;
  el.reportTreat.textContent = details.treat;
}

async function generateDogReport() {
  const key = el.geminiKey.value.trim();
  if (!key) {
    renderFallbackReport();
    el.reportStatus.textContent =
      "No Google AI key found, so I used the rule-based dog report. Add a key above for the custom version.";
    return;
  }

  el.reportButton.disabled = true;
  el.reportStatus.textContent = "Asking Google AI to write the dog report card...";

  const details = reportDetails();
  const prompt = `Write a short, charming first-person dog walk report card.
Dog: ${state.dogName}
Risk score: ${details.score}/100 (${details.levelLabel})
Temperature: ${state.temperature}F
Humidity: ${state.humidity}%
UV index: ${state.uvIndex ?? "unknown"}
Pavement: ${state.pavement}
Walk length: ${state.duration} minutes
Best time: ${details.window}
Dog profile: ${state.dogSize}, short-nosed=${state.shortNose}, senior/puppy/recovering=${state.senior}, thick/dark coat=${state.darkCoat}
Return exactly 3 lines:
1. A headline with a /10 tail-wag rating.
2. A dog-perspective note under 32 words.
3. A dog request under 8 words.
Do not mention diagnosis or veterinary certainty.`;

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
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const lines = text
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    if (lines[0]) el.reportHeading.textContent = lines[0];
    if (lines[1]) el.reportNote.textContent = lines[1];
    if (lines[2]) el.reportTreat.textContent = lines[2];
    el.reportRisk.textContent = `${details.levelLabel} risk (${details.score}/100)`;
    el.reportWindow.textContent = details.window;
    el.reportStatus.textContent = "Google AI report card ready. Download or screenshot it.";
  } catch (error) {
    renderFallbackReport();
    el.reportStatus.textContent = `${error.message} I restored the rule-based report card.`;
  } finally {
    el.reportButton.disabled = false;
  }
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const words = text.split(" ");
  let line = "";
  let lines = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, y);
      y += lineHeight;
      lines += 1;
      line = word;
      if (lines >= maxLines - 1) break;
    } else {
      line = testLine;
    }
  }

  if (line && lines < maxLines) context.fillText(line, x, y);
}

function downloadReportImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 675;
  const ctx = canvas.getContext("2d");
  const details = reportDetails();

  ctx.fillStyle = "#fff9ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#f1f8ef");
  gradient.addColorStop(1, "#ffe3b6");
  ctx.fillStyle = gradient;
  ctx.fillRect(36, 36, canvas.width - 72, canvas.height - 72);

  ctx.fillStyle = "#316f4a";
  ctx.beginPath();
  ctx.arc(980, 178, 86, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffba43";
  ctx.beginPath();
  ctx.arc(948, 148, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#19201d";
  ctx.font = "900 34px system-ui, sans-serif";
  ctx.fillText("PawPace Report Card", 96, 120);
  ctx.font = "900 64px system-ui, sans-serif";
  wrapCanvasText(ctx, el.reportHeading.textContent, 96, 220, 760, 72, 2);

  ctx.font = "500 34px system-ui, sans-serif";
  ctx.fillStyle = "#445048";
  wrapCanvasText(ctx, el.reportNote.textContent, 96, 360, 850, 44, 4);

  ctx.fillStyle = levelColor(details.level);
  ctx.beginPath();
  ctx.roundRect(96, 520, 250, 70, 34);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 28px system-ui, sans-serif";
  ctx.fillText(el.reportRisk.textContent, 122, 565);

  ctx.fillStyle = "#19201d";
  ctx.font = "800 26px system-ui, sans-serif";
  ctx.fillText(`Best time: ${el.reportWindow.textContent}`, 390, 548);
  ctx.fillText(`Dog request: ${el.reportTreat.textContent}`, 390, 586);

  const link = document.createElement("a");
  link.download = "pawpace-report-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  el.reportStatus.textContent = "Downloaded the report card image.";
}

document.querySelectorAll("input, select").forEach((input) => {
  input.addEventListener("input", render);
  input.addEventListener("change", render);
});
el.copyPlan?.addEventListener("click", copyPlan);
el.aiButton.addEventListener("click", generateAiPlan);
el.weatherButton.addEventListener("click", useLiveWeather);
el.reportButton.addEventListener("click", generateDogReport);
el.fallbackReport.addEventListener("click", () => {
  renderFallbackReport();
  el.reportStatus.textContent = "Rule-based dog report card refreshed.";
});
el.downloadReport.addEventListener("click", downloadReportImage);

render();
