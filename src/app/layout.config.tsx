import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Icon } from '@iconify/react';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Icon icon="mdi:arch" width={30} height={30} />
        UmmItOS
      </>
    ),
  },
  themeSwitch: { enabled: false },
  links: [],
};
