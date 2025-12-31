import { describe, it, expect, afterEach, beforeAll } from "bun:test";
import { render, cleanup, fireEvent, screen } from "@testing-library/react";
import { Navigation } from "../src/components/Navigation";
import React from "react";
import { Window } from "happy-dom";

const window = new Window();
globalThis.window = window as any;
globalThis.document = window.document as any;
globalThis.navigator = window.navigator as any;
globalThis.HTMLElement = window.HTMLElement as any;

describe("Navigation", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  it("should add hamburger button to the DOM", () => {
    const { getByRole } = render(React.createElement(Navigation));
    const btn = getByRole("button", { name: /Toggle Menu/i });
    expect(btn).toBeTruthy();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("should have nav menu initially closed", () => {
    const { container } = render(React.createElement(Navigation));
    const menu = container.querySelector(".-translate-x-full");
    expect(menu).toBeTruthy();
  });

  it("should toggle menu when button is clicked", () => {
    const { getByRole, container, getByText } = render(React.createElement(Navigation));
    const btn = getByRole("button", { name: /Toggle Menu/i });

    // Initially closed - menu should have -translate-x-full
    let menu = container.querySelector(".-translate-x-full");
    expect(menu).toBeTruthy();

    // Click to open
    fireEvent.click(btn);
    menu = container.querySelector(".translate-x-0");
    expect(menu).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");

    // Click to close
    fireEvent.click(btn);
    menu = container.querySelector(".-translate-x-full");
    expect(menu).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
  });

  it("should close menu when a link is clicked", () => {
    const { getByRole, container, getByText } = render(React.createElement(Navigation));
    const btn = getByRole("button", { name: /Toggle Menu/i });

    // Open menu
    fireEvent.click(btn);
    let menu = container.querySelector(".translate-x-0");
    expect(menu).toBeTruthy();

    // Click link
    const link = getByText("Maffetone Calculator");
    fireEvent.click(link);

    menu = container.querySelector(".-translate-x-full");
    expect(menu).toBeTruthy();
  });
});
