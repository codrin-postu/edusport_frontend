# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend application for EduSport, a skating school website. The project uses TypeScript, Tailwind CSS 4, and is containerized with Docker for development.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (uses --turbopack flag)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `docker-compose up --build` - Start development environment in Docker
- `docker-compose down` - Stop Docker containers

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/blocks/` - Large UI sections (Header, Footer)
- `src/components/` - Reusable UI components
- `src/utils/` - Utility functions and constants

### Component Organization
- All components have index.ts files for clean imports
- Components use TypeScript interfaces for props
- Styling uses Tailwind CSS with a utility-first approach
- Custom utility function `cn()` combines clsx and tailwind-merge for conditional classes

### Key Architectural Patterns
- Components follow a variant-based design system (Link, Text components)
- Constants are centralized in `src/utils/constants.tsx`
- Style constants for layout dimensions in `src/utils/style-constants.tsx`
- Root layout includes fixed Header and Footer around page content

## Code Style

### ESLint Configuration
- Uses Next.js recommended rules plus TypeScript
- Enforces double quotes, semicolons, 2-space indentation
- Strict spacing and formatting rules

### Prettier Configuration
- 2-space indentation, double quotes, semicolons required
- Trailing commas in multiline structures
- 80 character line width

## TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled
- Next.js plugin configured

## Docker Development
- Uses Node.js 24.6 Alpine image
- Development server runs on port 3000
- Hot reloading enabled with volume mounting
- Named volumes for node_modules and .next cache

## Current State
The application has basic Header and Footer components implemented with placeholder content. The main page is currently empty and ready for content development.
- Make sure to add "use client" to components which are using useState
- Use /components/blocks when adding new reusable blocks and also rememember to follow the directory/file/component naming already existing
- use "use client" directive if using any hooks/state