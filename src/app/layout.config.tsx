import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Icon } from '@iconify/react';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Icon icon="mdi:arch" width={30} height={30} />
        UmmItOS
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [],
};
