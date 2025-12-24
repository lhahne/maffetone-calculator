import {
  adjustmentOptions,
  calculateMaffetoneRange,
  formatRange,
} from "./calculator.js";

const ageInput = document.querySelector("#age");
const form = document.querySelector("#calculator-form");
const resultCard = document.querySelector("#result");
const resultRange = document.querySelector("#result-range");
const resultBase = document.querySelector("#result-base");
const resultNote = document.querySelector("#result-note");
const adjustmentRadios = document.querySelectorAll("input[name='adjustment']");

function getSelectedAdjustment() {
  const selected = Array.from(adjustmentRadios).find((radio) => radio.checked);
  return selected ? Number(selected.value) : 0;
}

function updateResults() {
  const age = Number(ageInput.value);
  const adjustment = getSelectedAdjustment();
  const range = calculateMaffetoneRange(age, adjustment);

  if (!range) {
    resultCard.classList.add("hidden");
    resultNote.textContent = "Enter a valid age to see your range.";
    return;
  }

  resultCard.classList.remove("hidden");
  resultRange.textContent = formatRange(range);
  resultBase.textContent = `${Math.round(range.base)} bpm`;

  const adjustmentLabel = adjustmentOptions.find(
    (option) => option.adjustment === adjustment,
  )?.label;
  resultNote.textContent = adjustmentLabel
    ? `Adjustment: ${adjustmentLabel}`
    : "";
}

form.addEventListener("input", updateResults);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateResults();
});

updateResults();
