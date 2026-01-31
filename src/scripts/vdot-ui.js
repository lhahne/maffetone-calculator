import {
  calculateVDOT,
  calculateTrainingPaces,
  calculateRacePredictions,
  raceDistances,
  trainingZones,
  secondsToMMSS,
  secondsToHHMMSS,
  hmsToSeconds
} from "./vdot-calculator.js";

export function setupVdotCalculator() {
  const distanceSelect = document.getElementById("distance-select");
  const inputH = document.getElementById("input-h");
  const inputM = document.getElementById("input-m");
  const inputS = document.getElementById("input-s");
  const unitToggle = document.getElementById("unit-toggle");
  const resultVdot = document.getElementById("result-vdot");
  const resultCard = document.getElementById("result-card");
  const trainingPacesContainer = document.getElementById("training-paces-container");
  const trainingPacesSection = document.getElementById("training-paces-section");
  const racePredictionsContainer = document.getElementById("race-predictions-container");
  const racePredictionsSection = document.getElementById("race-predictions-section");

  if (!distanceSelect || !inputH || !inputM || !inputS || !resultVdot || !resultCard) return;

  let currentUnit = "km";

  function getSelectedDistance() {
    const selected = Array.from(document.querySelectorAll(".distance-btn")).find(
      (btn) => btn.classList.contains("bg-sky-500")
    );
    if (!selected) return null;

    const distance = raceDistances.find((d) => d.id === selected.dataset.distance);
    return distance ? distance.meters : null;
  }

  function updateTime() {
    const distanceMeters = getSelectedDistance();
    const timeSeconds = hmsToSeconds(inputH.value, inputM.value, inputS.value);
    const timeMinutes = timeSeconds / 60;

    if (!distanceMeters || !timeMinutes || timeMinutes <= 0) {
      resultCard.classList.add("hidden");
      if (trainingPacesSection) trainingPacesSection.classList.add("hidden");
      if (racePredictionsSection) racePredictionsSection.classList.add("hidden");
      return;
    }

    const vdot = calculateVDOT(distanceMeters, timeMinutes);

    if (!vdot) {
      resultCard.classList.add("hidden");
      if (trainingPacesSection) trainingPacesSection.classList.add("hidden");
      if (racePredictionsSection) racePredictionsSection.classList.add("hidden");
      return;
    }

    resultCard.classList.remove("hidden");
    resultVdot.textContent = vdot.toFixed(1);

    updateTrainingPaces(vdot, currentUnit);
    updateRacePredictions(vdot);
  }

  function updateTrainingPaces(vdot, unit) {
    if (!trainingPacesContainer) return;

    const paces = calculateTrainingPaces(vdot, unit);

    if (!paces) {
      if (trainingPacesSection) trainingPacesSection.classList.add("hidden");
      return;
    }

    trainingPacesContainer.innerHTML = trainingZones
      .map((zone) => {
        const pace = paces[zone.id];
        if (!pace) return "";

        return `
          <div class="flex justify-between items-center border-b border-white/10 pb-4 last:border-0">
            <div>
              <span class="text-lg font-semibold text-white">${pace.label}</span>
              <p class="text-sm text-slate-400">${pace.description}</p>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-sky-300">${pace.minPace} - ${pace.maxPace}</div>
              <div class="text-sm text-slate-400">min/${unit}</div>
            </div>
          </div>
        `;
      })
      .join("");

    if (trainingPacesSection) trainingPacesSection.classList.remove("hidden");
  }

  function updateRacePredictions(vdot) {
    if (!racePredictionsContainer) return;

    const predictions = calculateRacePredictions(vdot);

    if (!predictions) {
      if (racePredictionsSection) racePredictionsSection.classList.add("hidden");
      return;
    }

    racePredictionsContainer.innerHTML = raceDistances
      .map((race) => {
        const pred = predictions[race.id];
        if (!pred) return "";

        return `
          <div class="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
            <span class="text-base text-white">${pred.label}</span>
            <span class="text-base font-semibold text-slate-300">${pred.timeFormatted}</span>
          </div>
        `;
      })
      .join("");

    if (racePredictionsSection) racePredictionsSection.classList.remove("hidden");
  }

  function updateUnitToggle() {
    const unitLabel = document.getElementById("unit-label");
    if (unitLabel) {
      unitLabel.textContent = currentUnit === "km" ? "km" : "mile";
    }

    const vdotText = resultVdot.textContent;
    if (vdotText && vdotText !== "--") {
      const vdot = parseFloat(vdotText);
      updateTrainingPaces(vdot, currentUnit);
    }
  }

  document.querySelectorAll(".distance-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".distance-btn").forEach((b) => {
        b.classList.remove("bg-sky-500");
        b.classList.add("bg-white/5", "hover:bg-white/10");
      });
      btn.classList.remove("bg-white/5", "hover:bg-white/10");
      btn.classList.add("bg-sky-500");
      updateTime();
    });
  });

  [inputH, inputM, inputS].forEach((input) => {
    input.addEventListener("input", updateTime);
  });

  if (unitToggle) {
    unitToggle.addEventListener("click", () => {
      currentUnit = currentUnit === "km" ? "mile" : "km";
      updateUnitToggle();
    });
  }

  updateTime();
}
