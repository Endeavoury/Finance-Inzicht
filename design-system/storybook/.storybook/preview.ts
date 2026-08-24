import type { Decorator, Preview } from '@storybook/web-components-vite';
import { html } from 'lit';
import '@finance-inzicht/design-system';
import '@finance-inzicht/design-system/styles.css';

const withTheme: Decorator = (story, context) => {
  const theme = String(context.globals['theme'] ?? 'system');
  document.documentElement.dataset['dsTheme'] = theme;
  return html`<div
    data-ds-theme=${theme}
    style="min-height:100%;color:var(--ds-color-text-primary);background:var(--ds-color-bg-canvas);padding:1.5rem"
  >
    ${story()}
  </div>`;
};
const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Design-system theme',
      defaultValue: 'system',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'system', title: 'System' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'error' },
    viewport: {
      options: {
        mobile: { name: 'Mobile', styles: { width: '390px', height: '844px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        laptop: { name: 'Laptop', styles: { width: '1280px', height: '800px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '1000px' } },
        wide: { name: 'Wide desktop', styles: { width: '1920px', height: '1080px' } },
      },
    },
  },
};
export default preview;
