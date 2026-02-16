import Link from 'next/link';
import { Icon } from '@iconify/react';
import { YouTubePlayer } from '@/components/youtube-player';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-fd-background text-fd-foreground">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col justify-center py-24 md:py-32 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <Icon icon="mdi:arch" className="text-fd-foreground flex-shrink-0" width={56} height={56} />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight" style={{ fontFamily: "'Bitcount Grid Double', monospace" }}>
              UmmItOS
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-fd-muted-foreground max-w-2xl mb-12 leading-relaxed">
            A minimal, blazing-fast Arch Linux distribution crafted for power users and enthusiasts.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center px-10 py-3.5 bg-fd-foreground text-fd-background font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg"
            >
              Read Documentation
            </Link>
            <a
              href="https://github.com/UmmItOS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 border-2 border-fd-border text-fd-foreground font-semibold rounded-full hover:bg-fd-accent hover:border-fd-accent-foreground transition-all"
            >
              <Icon icon="mdi:github" width={20} height={20} />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Video/Preview Section */}
      <section className="pb-24 md:pb-32 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-fd-border">
            <YouTubePlayer videoId="kd0elrqV0O0" title="UmmItOS Demo" />
          </div>
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