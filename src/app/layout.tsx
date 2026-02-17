import '@/app/global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { Icon } from '@iconify/react';

const inter = Inter({
  subsets: ['latin'],
});

const ebGaramond = localFont({
  src: [
    {
      path: '../../public/fonts/EB_Garamond/static/EBGaramond-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/EB_Garamond/static/EBGaramond-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/EB_Garamond/static/EBGaramond-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/EB_Garamond/static/EBGaramond-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-eb-garamond',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${ebGaramond.variable}`} suppressHydrationWarning>
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
