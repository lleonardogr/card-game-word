'use client';

import { Game } from '@/components/Game';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8">
      <Game />
    </div>
  );
}
