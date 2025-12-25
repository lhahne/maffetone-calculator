import { describe, it, expect, beforeEach, afterEach, beforeAll } from "bun:test";
import { Window } from "happy-dom";
import { initNav } from "../src/nav.js";

describe("Navigation", () => {
  beforeAll(() => {
    const window = new Window();
    globalThis.window = window;
    globalThis.document = window.document;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should add hamburger button to the DOM", () => {
    initNav();
    const btn = document.getElementById("nav-toggle");
    expect(btn).toBeTruthy();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("should add nav menu to the DOM", () => {
    initNav();
    const menu = document.getElementById("nav-menu");
    expect(menu).toBeTruthy();
    expect(menu.classList.contains("translate-x-full")).toBe(true);
  });

  it("should toggle menu when button is clicked", () => {
    initNav();
    const btn = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");

    // Initially closed
    expect(menu.classList.contains("translate-x-full")).toBe(true);
    expect(menu.classList.contains("translate-x-0")).toBe(false);

    // Click to open
    btn.click();
    expect(menu.classList.contains("translate-x-full")).toBe(false);
    expect(menu.classList.contains("translate-x-0")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");

    // Click to close
    btn.click();
    expect(menu.classList.contains("translate-x-full")).toBe(true);
    expect(menu.classList.contains("translate-x-0")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("should close menu when a link is clicked", () => {
    initNav();
    const btn = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    const link = menu.querySelector("a");

    // Open menu
    btn.click();
    expect(menu.classList.contains("translate-x-0")).toBe(true);

    // Click link
    link.click();
    expect(menu.classList.contains("translate-x-full")).toBe(true);
    expect(menu.classList.contains("translate-x-0")).toBe(false);
  });
});
