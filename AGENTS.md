# AGENTS.md

## Project Overview

Maffetone Calculator - an Astro web application for calculating MAF (Maximum Aerobic Function) heart rate zones.

## Tech Stack

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Testing**: Bun test with happy-dom and Testing Library
- **Package Manager**: Bun

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun test` | Run tests |

## Project Structure

```
src/
├── components/   # Reusable UI components
├── layouts/      # Page layouts
├── pages/        # Astro pages (file-based routing)
├── scripts/      # Client-side scripts
public/           # Static assets
tests/            # Test files
```

## Code Conventions

- Use TypeScript for type safety
- Follow Astro component conventions (`.astro` files)
- Use Tailwind CSS utility classes for styling
- Write tests using Testing Library patterns
