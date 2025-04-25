# Card Game Word

A Next.js-based word card game that blends the mechanics of Wordle with Magic: The Gathering card game concepts. Built with React, TypeScript, and Next.js, the game challenges players to guess words inspired by Magic: The Gathering cards, leveraging real card data from the Scryfall API.

## Features

- Word guessing gameplay inspired by Wordle
- Magic: The Gathering card data integration via Scryfall API
- Virtual keyboard for intuitive input
- Visual feedback for correct/incorrect letter guesses
- Game state management and settings configuration
- Responsive design for various screen sizes
- Optimized API calls with error handling

## Project Structure

- **Frontend**: Next.js application with React components
- **Game Logic**: TypeScript utilities for game mechanics
- **API Integration**: Scryfall API for Magic: The Gathering card data

### Main Components

- `Game.tsx`: Main game component orchestrating game flow
- `Help.tsx`: Help/instructions component
- `Keyboard.tsx`: Virtual keyboard for input
- `LetterTile.tsx`: Individual letter tile component
- `Settings.tsx`: Game settings/configuration
- `WordRow.tsx`: Component for displaying a row of letter tiles

### Utilities

- `game.ts`: Core game logic and mechanics
- `scryfall.ts`: Integration with Scryfall API
- `words.ts`: Word processing and dictionary functionality

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
