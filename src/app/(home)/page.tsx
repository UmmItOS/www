import Link from 'next/link';
import { Icon } from '@iconify/react';
import { YouTubePlayer } from '@/components/youtube-player';

const features = [
  {
    icon: 'mdi:arch',
    title: 'Built on Arch Linux',
    description: 'Rolling release, fully optimized. Uses Arch Linux as its foundation with an automated setup compatible with Arch and EndeavourOS.',
  },
  {
    icon: 'mdi:window-maximize',
    title: 'Hyprland Window Manager',
    description: 'Dynamic tiling Wayland compositor pre-configured with the full Hyprland ecosystem: Hyprlock, Hypridle, Hyprshot, and more.',
  },
  {
    icon: 'mdi:rocket-launch',
    title: 'One-Command Setup',
    description: 'Single command installs everything. Modular — every step is optional and can be skipped individually.',
  },
  {
    icon: 'mdi:application-brackets',
    title: 'Curated Software Stack',
    description: 'Kitty, Nushell, Neovim, Waybar, Rofi, Yazi, Starship, and Swww. Pre-configured and ready to go out of the box.',
  },
  {
    icon: 'mdi:chip',
    title: 'Hardware Auto-Detection',
    description: 'Automatically detects AMD GPUs for Mesa/Vulkan drivers and laptop hardware for brightness and media controls.',
  },
  {
    icon: 'mdi:wrench-cog',
    title: 'Post-Install Configurator',
    description: 'Interactive script that guides you through final system configuration with a settings inspector mode.',
  },
];

const quickLinks = [
  {
    href: '/docs/ummitos-main/Installation',
    icon: 'mdi:download-outline',
    title: 'Installation',
    description: 'Get UmmItOS up and running',
  },
  {
    href: '/docs/ummitos-main/configuration',
    icon: 'mdi:tune-vertical',
    title: 'Configuration',
    description: 'Customize your environment',
  },
  {
    href: '/docs/ummitos-main/configuration/keybindings',
    icon: 'mdi:keyboard-outline',
    title: 'Keybindings',
    description: 'Master the shortcuts',
  },
  {
    href: '/docs/ummitos-main/Packages',
    icon: 'mdi:package-variant-closed',
    title: 'Packages',
    description: 'Included software overview',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-fd-background text-fd-foreground">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center py-32 md:py-40 px-4 mx-auto w-full max-w-[var(--fd-layout-width)] overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-fd-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-fd-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-fd-muted-foreground bg-fd-muted/50 border border-fd-border rounded-full">
            <Icon icon="mdi:arch" width={16} height={16} />
            Arch Linux based distribution
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal mb-8 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            Built for power users<br />
            <span className="text-fd-muted-foreground/60">and Purple enthusiasts</span>
          </h1>
          <p className="text-base md:text-lg text-fd-muted-foreground/80 max-w-3xl mb-12 leading-relaxed">
            The fully optimized Linux distribution that leverages modern tools to streamline your workflow and enhance your productivity.
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

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            What makes UmmItOS different
          </h2>
          <p className="text-fd-muted-foreground/80 max-w-2xl mx-auto">
            A distribution designed from the ground up for efficiency, aesthetics, and modern workflows.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-fd-border bg-fd-muted/20 hover:bg-fd-accent/10 hover:border-fd-accent-foreground/30 transition-all duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-fd-accent/20 text-fd-accent-foreground mb-4 group-hover:scale-110 transition-transform">
                <Icon icon={feature.icon} width={22} height={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-fd-muted-foreground/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 md:py-24 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            Explore the documentation
          </h2>
          <p className="text-fd-muted-foreground/80 max-w-2xl mx-auto">
            Everything you need to get started with UmmItOS.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="group flex flex-col items-center text-center p-8 rounded-2xl border border-fd-border bg-fd-muted/20 hover:bg-fd-accent/10 hover:border-fd-accent-foreground/30 transition-all duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-fd-accent/20 text-fd-accent-foreground mb-4 group-hover:scale-110 transition-transform">
                <Icon icon={link.icon} width={28} height={28} />
              </div>
              <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
              <p className="text-sm text-fd-muted-foreground/70">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="py-16 md:py-24 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            See it in action
          </h2>
          <p className="text-fd-muted-foreground/80 max-w-2xl mx-auto">
            A quick walkthrough of the UmmItOS desktop experience.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-fd-border">
            <YouTubePlayer videoId="kd0elrqV0O0" title="UmmItOS Demo" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal mb-6" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            Ready to get started?
          </h2>
          <p className="text-fd-muted-foreground/80 mb-10 max-w-xl mx-auto">
            Jump into the documentation or visit the GitHub repository to begin your UmmItOS journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs/ummitos-main/Installation"
              className="inline-flex items-center justify-center px-10 py-3.5 bg-fd-foreground text-fd-background font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-lg"
            >
              <Icon icon="mdi:download-outline" width={20} height={20} className="mr-2" />
              Install UmmItOS
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 border-2 border-fd-border text-fd-foreground font-semibold rounded-full hover:bg-fd-accent hover:border-fd-accent-foreground transition-all"
            >
              <Icon icon="mdi:book-open-outline" width={20} height={20} />
              Browse Docs
            </Link>
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
