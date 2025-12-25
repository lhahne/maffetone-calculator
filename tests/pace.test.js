import { convertPaceToKm, convertPaceToMiles } from "../src/pace-calculator.js";

// Helper function to assert equality
function assertEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(`FAIL: ${message}`);
    console.error(`  Expected: ${JSON.stringify(expected)}`);
    console.error(`  Actual:   ${JSON.stringify(actual)}`);
    process.exit(1);
  } else {
    console.log(`PASS: ${message}`);
  }
}

// Test cases
console.log("Running pace calculator tests...");

// 1. Test convertPaceToKm
// 10:00 min/mile should be ~6:13 min/km
// 10 min/mile = 10 / 1.609344 = 6.213711922 min/km
// 0.213711922 * 60 = 12.82 sec -> 13 sec
// Actually, let's check with precision.
// 10 min = 600 sec.
// 600 / 1.609344 = 372.8227 sec
// 372.8227 / 60 = 6 min 12.82 sec -> 6:13
assertEqual(convertPaceToKm(10, 0), { minutes: 6, seconds: 13 }, "10:00 min/mile -> 6:13 min/km");

// 6:00 min/mile -> 3:44 min/km
// 360 sec / 1.609344 = 223.69 sec
// 223.69 / 60 = 3 min 43.69 sec -> 3:44
assertEqual(convertPaceToKm(6, 0), { minutes: 3, seconds: 44 }, "6:00 min/mile -> 3:44 min/km");

// 8:30 min/mile -> 5:17 min/km
// 8.5 * 60 = 510 sec
// 510 / 1.609344 = 316.899 sec
// 316.899 / 60 = 5 min 16.899 sec -> 5:17
assertEqual(convertPaceToKm(8, 30), { minutes: 5, seconds: 17 }, "8:30 min/mile -> 5:17 min/km");


// 2. Test convertPaceToMiles
// 5:00 min/km -> 8:03 min/mile
// 300 sec * 1.609344 = 482.8032 sec
// 482.8032 / 60 = 8 min 2.8032 sec -> 8:03
assertEqual(convertPaceToMiles(5, 0), { minutes: 8, seconds: 3 }, "5:00 min/km -> 8:03 min/mile");

// 4:00 min/km -> 6:26 min/mile
// 240 sec * 1.609344 = 386.24256 sec
// 386.24256 / 60 = 6 min 26.24 sec -> 6:26
assertEqual(convertPaceToMiles(4, 0), { minutes: 6, seconds: 26 }, "4:00 min/km -> 6:26 min/mile");

// Edge cases
assertEqual(convertPaceToKm(0, 0), { minutes: 0, seconds: 0 }, "0:00 min/mile -> 0:00 min/km");
assertEqual(convertPaceToMiles(0, 0), { minutes: 0, seconds: 0 }, "0:00 min/km -> 0:00 min/mile");

console.log("All tests passed!");
