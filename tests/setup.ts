/**
 * Shared test setup for React Testing Library with happy-dom.
 * Import this file in all UI tests to set up the DOM environment.
 */
import { Window } from "happy-dom";

const window = new Window();
globalThis.window = window as unknown as Window & typeof globalThis;
globalThis.document = window.document as unknown as Document;
globalThis.navigator = window.navigator as unknown as Navigator;
globalThis.HTMLElement = window.HTMLElement as unknown as typeof HTMLElement;
