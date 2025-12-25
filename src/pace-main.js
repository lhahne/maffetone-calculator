import { convertPaceToKm, convertPaceToMiles } from "./pace-calculator.js";
import { initNav } from "./nav.js";

initNav();

const mileMinInput = document.getElementById("mile-min");
const mileSecInput = document.getElementById("mile-sec");
const kmMinInput = document.getElementById("km-min");
const kmSecInput = document.getElementById("km-sec");
const form = document.getElementById("pace-form");

// Prevent form submission
form.addEventListener("submit", (e) => e.preventDefault());

let isUpdating = false;

function updateKm() {
  if (isUpdating) return;
  isUpdating = true;

  const min = mileMinInput.value;
  const sec = mileSecInput.value;

  const result = convertPaceToKm(min, sec);

  kmMinInput.value = result.minutes;
  kmSecInput.value = result.seconds < 10 ? "0" + result.seconds : result.seconds;

  isUpdating = false;
}

function updateMiles() {
  if (isUpdating) return;
  isUpdating = true;

  const min = kmMinInput.value;
  const sec = kmSecInput.value;

  const result = convertPaceToMiles(min, sec);

  mileMinInput.value = result.minutes;
  mileSecInput.value = result.seconds < 10 ? "0" + result.seconds : result.seconds;

  isUpdating = false;
}

[mileMinInput, mileSecInput].forEach(input => {
  input.addEventListener("input", updateKm);
});

[kmMinInput, kmSecInput].forEach(input => {
  input.addEventListener("input", updateMiles);
});
