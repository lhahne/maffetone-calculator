# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A collection of running training calculators built with Astro, React, and Tailwind CSS, deployed to Cloudflare Pages. The app provides multiple calculators for endurance athletes: Maffetone 180 Formula, Pace Calculator, Riegel Race Pace Estimator, Magic Mile, VDOT, and Karvonen heart rate calculators.

## Development Commands

### Essential Commands
```bash
# Install dependencies
bun install

# Start dev server (default: http://localhost:4321)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run all tests
bun test

# Run specific test file
bun test tests/calculator.test.ts
```

## Architecture

### Project Structure

**Pages** (`src/pages/*.astro`)
- Each calculator has its own route (e.g., `/`, `/pace`, `/riegel`, `/magic-mile`, `/vdot`, `/karvonen`)
- Pages are minimal Astro files that import the Layout and hydrate the corresponding React calculator component with `client:load`

**Calculator Components** (`src/components/calculators/*Calculator.tsx`)
- Each calculator is a self-contained React component
- All use the `CalculatorLayout` component for consistent UI structure
- Calculator components compose three main sections:
  - `form`: Input fields using reusable UI components (Input, Radio, Checkbox)
  - `results`: Calculated output displayed in a Card
  - `info`: Optional usage instructions and reference links

**Calculator Logic** (`src/scripts/*-calculator.ts`)
- Pure functions separated from UI components
- Each calculator exports typed interfaces and calculation functions
- Logic files are independently testable and framework-agnostic

**UI Components** (`src/components/ui/`)
- Reusable components: `Card`, `Input`, `Radio`, `Checkbox`, `CalculatorLayout`
- Styled with Tailwind CSS classes
- All designed for the dark theme with glassmorphism effects

**Layout** (`src/layouts/Layout.astro`)
- Single layout used by all pages
- Includes Navigation component, ViewTransitions for SPA-like navigation
- Defines global styles and background gradient effects

### Key Design Patterns

**Separation of Concerns**
- Calculator logic lives in `/scripts` as pure functions
- React components in `/components/calculators` handle UI and state
- Astro pages wire everything together with minimal code

**Component Composition**
- All calculators follow the same pattern: import CalculatorLayout, define form/results/info sections
- UI components (Input, Radio, etc.) handle styling and accessibility consistently

**Testing Strategy**
- Unit tests for calculator logic functions (e.g., `tests/calculator.test.ts`)
- Component tests using React Testing Library with happy-dom
- Tests import `./setup.ts` to configure the DOM environment
- E2E tests directory exists but is currently empty

## Deployment

Configured for Cloudflare Pages deployment via `astro.config.ts` with the `@astrojs/cloudflare` adapter. Output mode is set to "server" for SSR. Wrangler configuration in `wrangler.jsonc` specifies Node.js compatibility and asset handling.

## Adding a New Calculator

1. Create calculator logic in `src/scripts/your-calculator.ts` with typed interfaces and pure functions
2. Create React component in `src/components/calculators/YourCalculator.tsx` using `CalculatorLayout`
3. Create page at `src/pages/your-calculator.astro` that imports Layout and hydrates your component
4. Add calculator to navigation links in `src/components/Navigation.tsx`
5. Write unit tests in `tests/your-calculator.test.ts` for logic functions
6. Write component tests for the UI (import `./setup.ts` for DOM environment)
