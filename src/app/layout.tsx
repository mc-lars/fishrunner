// src/app/layout.tsx

import type { ReactNode } from 'react';

export const metadata = {
  title: 'Fishrunner',
  description: 'Help the fish escape from the hamster!',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}