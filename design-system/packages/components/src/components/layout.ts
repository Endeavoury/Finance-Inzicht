import { css, html, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles } from '@finance-inzicht/styles';
import { DsElement } from '../core/ds-element.js';

const gaps = css`
  :host([gap='0']) {
    --gap: var(--ds-space-0);
  }
  :host([gap='1']) {
    --gap: var(--ds-space-1);
  }
  :host([gap='2']) {
    --gap: var(--ds-space-2);
  }
  :host([gap='3']) {
    --gap: var(--ds-space-3);
  }
  :host([gap='4']) {
    --gap: var(--ds-space-4);
  }
  :host([gap='5']) {
    --gap: var(--ds-space-5);
  }
  :host([gap='6']) {
    --gap: var(--ds-space-6);
  }
  :host([gap='8']) {
    --gap: var(--ds-space-8);
  }
`;
export class DsStack extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    gaps,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--gap, var(--ds-space-4));
      }
      :host([align='start']) {
        align-items: flex-start;
      }
      :host([align='center']) {
        align-items: center;
      }
      :host([align='end']) {
        align-items: flex-end;
      }
      :host([align='stretch']) {
        align-items: stretch;
      }
    `,
  ];
  @property({ reflect: true }) gap = '4';
  @property({ reflect: true }) align: 'start' | 'center' | 'end' | 'stretch' = 'stretch';
  protected override render() {
    return html`<slot></slot>`;
  }
}
export class DsInline extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    gaps,
    css`
      :host {
        display: flex;
        align-items: center;
        gap: var(--gap, var(--ds-space-3));
        flex-wrap: wrap;
      }
      :host([align='start']) {
        align-items: flex-start;
      }
      :host([align='end']) {
        align-items: flex-end;
      }
      :host([justify='start']) {
        justify-content: flex-start;
      }
      :host([justify='center']) {
        justify-content: center;
      }
      :host([justify='end']) {
        justify-content: flex-end;
      }
      :host([justify='between']) {
        justify-content: space-between;
      }
      :host([wrap='false']) {
        flex-wrap: nowrap;
      }
    `,
  ];
  @property({ reflect: true }) gap = '3';
  @property({ reflect: true }) align: 'start' | 'center' | 'end' = 'center';
  @property({ reflect: true }) justify: 'start' | 'center' | 'end' | 'between' = 'start';
  @property({ type: Boolean, reflect: true }) wrap = true;
  protected override render() {
    return html`<slot></slot>`;
  }
}
export class DsGrid extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    gaps,
    css`
      :host {
        display: grid;
        grid-template-columns: repeat(var(--columns, 3), minmax(0, 1fr));
        gap: var(--gap, var(--ds-space-4));
      }
      :host([columns='1']) {
        --columns: 1;
      }
      :host([columns='2']) {
        --columns: 2;
      }
      :host([columns='3']) {
        --columns: 3;
      }
      :host([columns='4']) {
        --columns: 4;
      }
      :host([columns='6']) {
        --columns: 6;
      }
      @media (max-width: 900px) {
        :host([responsive]) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 600px) {
        :host([responsive]) {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
  @property({ reflect: true }) columns = '3';
  @property({ reflect: true }) gap = '4';
  @property({ type: Boolean, reflect: true }) responsive = true;
  protected override render() {
    return html`<slot></slot>`;
  }
}
export class DsContainer extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
        width: min(100% - 2.5rem, var(--container, 92rem));
        margin-inline: auto;
      }
      :host([size='narrow']) {
        --container: 48rem;
      }
      :host([size='wide']) {
        --container: 108rem;
      }
      :host([flush]) {
        width: 100%;
      }
    `,
  ];
  @property({ reflect: true }) size: 'narrow' | 'normal' | 'wide' = 'normal';
  @property({ type: Boolean, reflect: true }) flush = false;
  protected override render() {
    return html`<slot></slot>`;
  }
}

export class DsPageHeader extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-6);
        padding: var(--ds-space-2) 0 var(--ds-space-5);
      }
      .copy {
        min-width: 0;
      }
      h1 {
        margin: 0.375rem 0 0;
        font-size: clamp(var(--ds-font-size-2xl), 2.3vw, var(--ds-font-size-3xl));
        font-weight: var(--ds-font-weight-semibold);
        letter-spacing: var(--ds-letter-spacing-tight);
        line-height: var(--ds-line-height-tight);
      }
      p {
        max-width: 48rem;
        margin: 0.4375rem 0 0;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-md);
      }
      .actions {
        flex: 0 0 auto;
      }
      @media (max-width: 640px) {
        .header {
          display: grid;
          align-items: start;
        }
        .actions {
          width: 100%;
        }
      }
    `,
  ];
  @property() eyebrow = '';
  @property() heading = '';
  @property() description = '';
  protected override render() {
    return html`<header class="header" part="header">
      <div class="copy">
        <p class="eyebrow">${this.eyebrow}</p>
        <h1 part="heading">${this.heading}</h1>
        <p part="description">${this.description}</p>
      </div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </header>`;
  }
}
