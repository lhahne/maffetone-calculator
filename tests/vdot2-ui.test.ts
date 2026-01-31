import { describe, it, expect, beforeEach } from "bun:test";
import "./setup";
import { setupVdot2Calculator } from "../src/scripts/vdot2-ui.js";

function renderVdot2Fixture() {
  document.body.innerHTML = `
    <div>
      <div id="distance-select">
        <button class="distance-btn bg-sky-500" data-distance="5k">5K</button>
        <button class="distance-btn bg-white/5" data-distance="10k">10K</button>
      </div>

      <input id="input-h" type="number" value="0" />
      <input id="input-m" type="number" value="20" />
      <input id="input-s" type="number" value="0" />

      <button id="unit-toggle"><span id="unit-label">km</span></button>

      <div id="result-card" class="hidden">
        <div id="result-vdot2">--</div>
      </div>

      <section id="training-paces-section" class="hidden">
        <div id="training-paces-container"></div>
      </section>

      <section id="race-predictions-section" class="hidden">
        <div id="race-predictions-container"></div>
      </section>
    </div>
  `;
}

describe("VDOT2 UI", () => {
  beforeEach(() => {
    renderVdot2Fixture();
  });

  it("reveals training and prediction sections after computing", () => {
    setupVdot2Calculator();

    const resultCard = document.getElementById("result-card");
    const trainingSection = document.getElementById("training-paces-section");
    const predictionsSection = document.getElementById("race-predictions-section");

    expect(resultCard?.classList.contains("hidden")).toBe(false);
    expect(trainingSection?.classList.contains("hidden")).toBe(false);
    expect(predictionsSection?.classList.contains("hidden")).toBe(false);
  });

  it("orders training paces from slowest to fastest", () => {
    setupVdot2Calculator();

    const labels = Array.from(document.querySelectorAll("#training-paces-container span"))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);

    expect(labels[0]).toBe("Easy");
    expect(labels[labels.length - 1]).toBe("Repetition");
  });

  it("hides sections when inputs are cleared", () => {
    setupVdot2Calculator();

    const minutesInput = document.getElementById("input-m") as HTMLInputElement;
    minutesInput.value = "0";
    minutesInput.dispatchEvent(new window.Event("input", { bubbles: true }));

    const resultCard = document.getElementById("result-card");
    const trainingSection = document.getElementById("training-paces-section");
    const predictionsSection = document.getElementById("race-predictions-section");

    expect(resultCard?.classList.contains("hidden")).toBe(true);
    expect(trainingSection?.classList.contains("hidden")).toBe(true);
    expect(predictionsSection?.classList.contains("hidden")).toBe(true);
  });
});
