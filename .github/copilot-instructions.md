# Card Game Word - Copilot Instructions

## Project Overview
This project is a Next.js-based word card game, combining elements of Wordle with Magic: The Gathering card game concepts. The application is built with React, TypeScript, and Next.js.

## Project Structure
- **Frontend**: Next.js application with React components
- **Game Logic**: TypeScript utilities for game mechanics
- **API Integration**: Scryfall API for Magic: The Gathering card data

## Current Components
- `Game.tsx`: Main game component orchestrating game flow
- `Help.tsx`: Help/instructions component
- `Keyboard.tsx`: Virtual keyboard for input
- `LetterTile.tsx`: Individual letter tile component
- `Settings.tsx`: Game settings/configuration
- `WordRow.tsx`: Component for displaying a row of letter tiles

## Utilities
- `game.ts`: Core game logic and mechanics
- `scryfall.ts`: Integration with Scryfall API
- `words.ts`: Word processing and dictionary functionality

## Development History
- Initial project setup with Next.js and TypeScript
- Created basic UI components for the game interface
- Implemented core game mechanics
- Added Scryfall API integration for Magic: The Gathering card data

## Current Features
- Word guessing gameplay
- Virtual keyboard interface
- Game state management
- Visual feedback for correct/incorrect letters
- Settings configuration

## Planned Features
- [Add future planned features here]

## Technical Considerations
- Maintain TypeScript type safety across the codebase
- Follow React best practices for component design
- Ensure responsive design for different screen sizes
- Optimize API calls to Scryfall to prevent rate limiting

## API Integration Notes
- Scryfall API is used for retrieving Magic: The Gathering card data
- Consider caching mechanisms for frequently accessed card data
- Handle API errors gracefully with user feedback

---

## Development Log
- **2025-04-10**: Created Copilot instructions file for maintaining project context

[Add future development entries here with dates and descriptions of changes]