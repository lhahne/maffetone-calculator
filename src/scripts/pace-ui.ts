import { convertPaceToKm, convertPaceToMiles } from "./pace-calculator";

export function setupPaceCalculator(container: Document | HTMLElement = document) {
    const mileMinInput = container.querySelector("#mile-min") as HTMLInputElement | null;
    const mileSecInput = container.querySelector("#mile-sec") as HTMLInputElement | null;
    const kmMinInput = container.querySelector("#km-min") as HTMLInputElement | null;
    const kmSecInput = container.querySelector("#km-sec") as HTMLInputElement | null;
    const form = container.querySelector("#pace-form") as HTMLFormElement | null;

    if (!mileMinInput || !mileSecInput || !kmMinInput || !kmSecInput || !form) return;

    form.addEventListener("submit", (e) => e.preventDefault());

    let isUpdating = false;

    function updateKm() {
        if (isUpdating) return;
        isUpdating = true;

        const min = Number(mileMinInput!.value);
        const sec = Number(mileSecInput!.value);

        const result = convertPaceToKm(min, sec);

        kmMinInput!.value = result.minutes.toString();
        kmSecInput!.value = result.seconds < 10 ? "0" + result.seconds : result.seconds.toString();

        isUpdating = false;
    }

    function updateMiles() {
        if (isUpdating) return;
        isUpdating = true;

        const min = Number(kmMinInput!.value);
        const sec = Number(kmSecInput!.value);

        const result = convertPaceToMiles(min, sec);

        mileMinInput!.value = result.minutes.toString();
        mileSecInput!.value = result.seconds < 10 ? "0" + result.seconds : result.seconds.toString();

        isUpdating = false;
    }

    [mileMinInput, mileSecInput].forEach(input => {
        input!.addEventListener("input", updateKm);
    });

    [kmMinInput, kmSecInput].forEach(input => {
        input!.addEventListener("input", updateMiles);
    });
}
