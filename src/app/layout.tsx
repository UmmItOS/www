import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            hotKey: [
              {
                display: (
                  <span className="inline-flex items-center gap-0.5 h-6">
                    <Icon 
                      icon="nonicons:vim-16" 
                      width={10} 
                      height={10}
                    />
                  </span>
                ),
                key: '/', // Vim-style search hotkey
              },
            ],
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
