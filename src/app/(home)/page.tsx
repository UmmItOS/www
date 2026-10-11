import { Suspense } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { YouTubePlayer } from '@/components/youtube-player';
import { getVersion } from '@/lib/version';

async function VersionText() {
  const version = await getVersion();
  return <>{version}</>;
}

const versionSkeleton = (
  <span className="inline-block h-3.5 w-11 rounded bg-current/30 blur-[2px] animate-pulse align-middle" />
);

const features = [
  {
    icon: 'mdi:arch',
    title: 'Built on Arch Linux',
    description: 'Rolling release, fully optimized. Uses Arch Linux as its foundation with an automated setup compatible with Arch and EndeavourOS.',
  },
  {
    icon: 'mdi:window-maximize',
    title: 'Hyprland + Quickshell',
    description: 'Dynamic tiling Wayland compositor paired with a custom Quickshell desktop shell: bar, launcher, notifications, lock screen and more in one integrated interface.',
  },
  {
    icon: 'mdi:rocket-launch',
    title: 'One-Command Setup',
    description: 'Single command installs everything. Modular — every step is optional and can be skipped individually.',
  },
  {
    icon: 'mdi:application-brackets',
    title: 'Curated Software Stack',
    description: 'Kitty, Zsh, Neovim, Yazi, Starship, Fastfetch, and the Quickshell shell. Pre-configured and ready to go out of the box.',
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
    href: '/docs/Installation',
    icon: 'mdi:download-outline',
    title: 'Installation',
    description: 'Get UmmItOS up and running',
  },
  {
    href: '/docs/configuration',
    icon: 'mdi:tune-vertical',
    title: 'Configuration',
    description: 'Customize your environment',
  },
  {
    href: '/docs/configuration/keybindings',
    icon: 'mdi:keyboard-outline',
    title: 'Keybindings',
    description: 'Master the shortcuts',
  },
  {
    href: '/docs/Packages',
    icon: 'mdi:package-variant-closed',
    title: 'Packages',
    description: 'Included software overview',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col bg-fd-background text-fd-foreground overflow-x-clip">
      {/* Hero Section */}
      <section className="relative flex flex-col justify-center py-24 md:py-32 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="hidden lg:block absolute -top-40 -right-24 w-[32rem] h-[32rem] bg-[#bb9af7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-fd-muted-foreground bg-fd-muted/50 border border-fd-border rounded-full">
              <Icon icon="mdi:arch" width={16} height={16} />
              Arch Linux
              <span className="w-1 h-1 rounded-full bg-fd-muted-foreground/30" />
              <span className="text-green-400 font-semibold">
                <Suspense fallback={versionSkeleton}><VersionText /></Suspense>
              </span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-8 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
              Built for power users<br />
              <span className="text-fd-muted-foreground/60">and Purple enthusiasts</span>
            </h1>
            <p className="text-base md:text-lg text-fd-muted-foreground mb-10 leading-relaxed">
              Hong Kong&apos;s first Linux distribution. A fully optimized Arch Linux experience that
              leverages modern tools to streamline your workflow and enhance your productivity.
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

          {/* Right: ummitfetch-style terminal */}
          <div className="relative">
            <div className="absolute -inset-1 bg-[#a78bfa]/10 rounded-2xl blur-2xl opacity-70 pointer-events-none" />
            <div className="relative rounded-xl border border-fd-border shadow-2xl overflow-hidden font-mono text-sm">
              <div className="p-5 leading-relaxed text-fd-muted-foreground">
                <div className="mb-3">
                  <span className="text-[#a78bfa]">❯</span>{' '}
                  <span className="text-fd-foreground">ummitfetch</span>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                  <pre className="text-[#a78bfa] text-[10px] leading-tight self-start">{`      /\\
     /  \\
    /    \\
   /      \\
  /   ,,   \\
 /   |  |   \\
/_-''    ''-_\\`}</pre>
                  <div>
                    <div><span className="text-[#a78bfa] font-semibold">ummit</span>@<span className="text-[#a78bfa] font-semibold">ummitos</span></div>
                    <div className="text-fd-border">───────────────</div>
                    <div><span className="text-fd-foreground">OS</span>       UmmItOS <Suspense fallback={versionSkeleton}><VersionText /></Suspense></div>
                    <div><span className="text-fd-foreground">Base</span>     Arch Linux</div>
                    <div><span className="text-fd-foreground">WM</span>       Hyprland</div>
                    <div><span className="text-fd-foreground">Shell</span>    zsh + Starship</div>
                    <div><span className="text-fd-foreground">Term</span>     kitty</div>
                    <div><span className="text-fd-foreground">Editor</span>   Neovim</div>
                    <div className="mt-2 flex gap-1">
                      {[0.2, 0.35, 0.5, 0.65, 0.8, 1].map((o) => (
                        <span key={o} className="w-4 h-3 rounded-sm bg-[#a78bfa]" style={{ opacity: o }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-[#a78bfa]">❯</span>{' '}
                  <span className="inline-block w-2 h-4 align-middle bg-fd-muted-foreground animate-pulse" />
                </div>
              </div>
              {/* Bottom status bar */}
              <div className="flex items-center gap-2 border-t border-fd-border px-3 py-1.5 text-xs">
                <span className="text-fd-foreground font-medium">ummit@ummitos</span>
                <span className="text-[#a78bfa]">~</span>
                <span className="ml-auto text-fd-muted-foreground">zsh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            What makes UmmItOS different
          </h2>
          <p className="text-fd-muted-foreground max-w-2xl mx-auto">
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
              <p className="text-sm text-fd-muted-foreground leading-relaxed">{feature.description}</p>
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
          <p className="text-fd-muted-foreground max-w-2xl mx-auto">
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
              <p className="text-sm text-fd-muted-foreground">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* One-Command Install */}
      <section className="py-16 md:py-24 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
              Get started in one command
            </h2>
            <p className="text-fd-muted-foreground max-w-2xl mx-auto">
              Works on any Arch Linux or EndeavourOS installation.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#a78bfa]/10 rounded-2xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity pointer-events-none" />
            <div className="relative rounded-xl border border-fd-border overflow-hidden text-fd-muted-foreground font-mono">
              <div className="px-4 py-3.5">
                <code className="text-sm md:text-base break-all">
                  <span className="text-[#a78bfa]">❯</span>{' '}
                  <span className="text-fd-foreground">bash</span>{' '}
                  <span className="text-fd-muted-foreground">&lt;(</span>curl
                  <span className="text-fd-muted-foreground"> -fsSL </span>
                  https://raw.githubusercontent.com/UmmItOS/UmmItOS/HEAD/setup.sh
                  <span className="text-fd-muted-foreground">)</span>
                </code>
              </div>
              <div className="flex items-center gap-2 border-t border-fd-border px-3 py-1.5 text-xs">
                <span className="text-fd-foreground font-medium">ummit@ummitos</span>
                <span className="text-[#a78bfa]">~</span>
                <span className="ml-auto text-fd-muted-foreground">zsh</span>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/docs/Installation"
              className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
            >
              <Icon icon="mdi:information-outline" width={16} height={16} />
              Learn more about the installation process
              <Icon icon="mdi:arrow-right" width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Software Stack */}
      <section className="py-16 md:py-24 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            Powered by modern tools
          </h2>
          <p className="text-fd-muted-foreground max-w-2xl mx-auto">
            A carefully curated stack of modern applications, pre-configured and ready to use.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: 'mdi:window-maximize', name: 'Hyprland' },
            { img: '/quickshell.svg', name: 'Quickshell' },
            { icon: 'mdi:console', name: 'Kitty' },
            { icon: 'simple-icons:zsh', name: 'Zsh' },
            { icon: 'simple-icons:neovim', name: 'Neovim' },
            { icon: 'mdi:file-tree', name: 'Yazi' },
            { icon: 'ph:rocket-launch', name: 'Starship' },
            { icon: 'mdi:information-outline', name: 'Fastfetch' },
            { icon: 'mdi:theme-light-dark', name: 'Orchis GTK' },
            { icon: 'mdi:palette-swatch-outline', name: 'Papirus Icons' },
            { icon: 'mdi:cursor-default-click', name: 'Bibata Cursor' },
            { icon: 'mdi:music-note-outline', name: 'Cava' },
          ].map((tool: { name: string; icon?: string; img?: string }) => (
            <div
              key={tool.name}
              className="flex items-center gap-3 p-4 rounded-xl border border-fd-border bg-fd-muted/20 hover:bg-fd-accent/10 hover:border-fd-accent-foreground/30 transition-all duration-300"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-fd-accent/20 text-fd-accent-foreground shrink-0">
                {tool.img ? (
                  <span
                    aria-hidden
                    className="w-5 h-5 bg-current"
                    style={{
                      maskImage: `url(${tool.img})`,
                      WebkitMaskImage: `url(${tool.img})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                ) : (
                  <Icon icon={tool.icon!} width={20} height={20} />
                )}
              </div>
              <span className="text-sm font-medium">{tool.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="py-16 md:py-24 px-4 mx-auto w-full max-w-[var(--fd-layout-width)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-normal mb-4" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
            See it in action
          </h2>
          <p className="text-fd-muted-foreground max-w-2xl mx-auto">
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
          <p className="text-fd-muted-foreground mb-10 max-w-xl mx-auto">
            Jump into the documentation or visit the GitHub repository to begin your UmmItOS journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/docs/Installation"
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
      <footer className="relative overflow-hidden border-t border-fd-border/60 px-4 pt-16 pb-10">
        {/* faint brand wordmark + glow for presence */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-4 select-none text-[9rem] font-semibold leading-none text-fd-foreground/[0.03] sm:text-[13rem]"
          style={{ fontFamily: 'var(--font-eb-garamond)' }}
        >
          UmmItOS
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#a78bfa]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-[var(--fd-layout-width)]">
          <div className="flex flex-col gap-12 md:flex-row md:justify-between">
            {/* brand */}
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <Icon icon="mdi:arch" width={28} height={28} className="text-[#a78bfa]" />
                <span className="text-2xl" style={{ fontFamily: 'var(--font-eb-garamond)' }}>
                  UmmItOS
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground">
                Hong Kong&apos;s first Linux distribution. A fully optimized Arch Linux and Hyprland
                setup, crafted since 2023.
              </p>
            </div>

            {/* link columns */}
            <div className="grid grid-cols-2 gap-10 text-sm sm:gap-20">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground/70">
                  Project
                </h3>
                <ul className="space-y-2.5">
                  {[
                    ['GitHub', 'https://github.com/UmmItOS/UmmItOS'],
                    ['Releases', 'https://github.com/UmmItOS/UmmItOS/releases'],
                    ['Issues', 'https://github.com/UmmItOS/UmmItOS/issues'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-fd-muted-foreground transition-colors hover:text-fd-foreground">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground/70">
                  Docs
                </h3>
                <ul className="space-y-2.5">
                  {[
                    ['Installation', '/docs/Installation'],
                    ['Configuration', '/docs/configuration'],
                    ['Changelog', '/docs/Changelog'],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="text-fd-muted-foreground transition-colors hover:text-fd-foreground">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* bottom bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-fd-border/60 pt-6 text-xs text-fd-muted-foreground sm:flex-row">
            <span>© 2023–{new Date().getFullYear()} UmmIt Kin · Since 2023</span>
            <a
              href="https://github.com/UmmItOS/UmmItOS/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-fd-foreground"
            >
              GPL-3.0 licensed
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
