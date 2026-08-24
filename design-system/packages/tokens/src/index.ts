export type TokenGroup =
  | 'color'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'elevation'
  | 'motion'
  | 'breakpoint'
  | 'zIndex'
  | 'icon'
  | 'density';
export interface DesignToken {
  name: string;
  value: string;
  group: TokenGroup;
  description: string;
}

export const tokens: readonly DesignToken[] = [
  {
    name: '--ds-color-bg-canvas',
    value: 'semantic',
    group: 'color',
    description: 'Application canvas',
  },
  {
    name: '--ds-color-bg-surface',
    value: 'semantic',
    group: 'color',
    description: 'Default component surface',
  },
  {
    name: '--ds-color-bg-elevated',
    value: 'semantic',
    group: 'color',
    description: 'Raised and overlay surface',
  },
  {
    name: '--ds-color-text-primary',
    value: 'semantic',
    group: 'color',
    description: 'Primary content',
  },
  {
    name: '--ds-color-text-secondary',
    value: 'semantic',
    group: 'color',
    description: 'Supporting content',
  },
  {
    name: '--ds-color-text-muted',
    value: 'semantic',
    group: 'color',
    description: 'Low-emphasis metadata',
  },
  {
    name: '--ds-color-border-default',
    value: 'semantic',
    group: 'color',
    description: 'Default boundary',
  },
  {
    name: '--ds-color-accent-primary',
    value: 'semantic',
    group: 'color',
    description: 'Primary interactive accent',
  },
  ...Array.from({ length: 8 }, (_, index) => ({
    name: `--ds-space-${index + 1}`,
    value: `${(index + 1) * 4}px`,
    group: 'spacing' as const,
    description: `Spacing step ${index + 1}`,
  })),
  { name: '--ds-radius-sm', value: '4px', group: 'radius', description: 'Compact radius' },
  { name: '--ds-radius-md', value: '7px', group: 'radius', description: 'Default radius' },
  { name: '--ds-radius-lg', value: '10px', group: 'radius', description: 'Large surface radius' },
  {
    name: '--ds-duration-fast',
    value: '120ms',
    group: 'motion',
    description: 'Immediate feedback',
  },
  {
    name: '--ds-duration-normal',
    value: '180ms',
    group: 'motion',
    description: 'Default transition',
  },
  {
    name: '--ds-breakpoint-mobile',
    value: '390px',
    group: 'breakpoint',
    description: 'Mobile review viewport',
  },
  {
    name: '--ds-breakpoint-tablet',
    value: '768px',
    group: 'breakpoint',
    description: 'Tablet review viewport',
  },
  {
    name: '--ds-breakpoint-desktop',
    value: '1440px',
    group: 'breakpoint',
    description: 'Desktop review viewport',
  },
] as const;

export const themes = ['light', 'dark', 'system'] as const;
export type DsTheme = (typeof themes)[number];
