import Link from 'next/link';
import { Icon } from '@iconify/react';
import { YouTubePlayer } from '@/components/youtube-player';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-fd-background text-fd-foreground">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col justify-center py-20 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-normal leading-tight">
            <Icon icon="mdi:arch" className="inline-block mr-2" width={75} height={75} /> UmmItOS
          </h1>
          <p className="text-lg md:text-xl text-fd-muted-foreground max-w-2xl mb-10">
            UmmItOS — a minimal, blazing-fast Arch Linux setup crafted for power users and enthusiasts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-8 py-3 bg-fd-foreground text-fd-background font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              Read Documentation
            </Link>
            <a
              href="https://github.com/UmmItKin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 border border-fd-border text-fd-foreground font-medium rounded-full hover:bg-fd-accent transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Video/Preview Section */}
      <section className="pb-20 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="max-w-4xl mx-auto">
          <YouTubePlayer videoId="kd0elrqV0O0" title="UmmItOS Demo" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-fd-border">
        <div className="mx-auto max-w-[var(--fd-layout-width)] text-center text-fd-muted-foreground text-sm">
          © {new Date().getFullYear()} UmmIt Kin. All rights reserved.
        </div>
      </footer>
    </main>
  );
}