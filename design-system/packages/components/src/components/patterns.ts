import { css, html, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles, surfaceStyles } from '@finance-inzicht/styles';
import { DsElement } from '../core/ds-element.js';

export class DsFilterBar extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
      }
      .bar {
        display: flex;
        align-items: flex-end;
        gap: var(--ds-space-3);
        padding: var(--ds-space-4);
        background: var(--ds-color-bg-surface-subtle);
      }
      .fields {
        display: grid;
        grid-template-columns: repeat(var(--columns, 4), minmax(8rem, 1fr));
        gap: var(--ds-space-3);
        min-width: 0;
        flex: 1;
      }
      .actions {
        display: flex;
        gap: var(--ds-space-2);
        flex: 0 0 auto;
      }
      @media (max-width: 900px) {
        .bar {
          display: grid;
        }
        .fields {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .actions {
          justify-content: flex-end;
        }
      }
      @media (max-width: 560px) {
        .fields {
          grid-template-columns: 1fr;
        }
        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
      }
    `,
  ];
  @property({ type: Number }) columns = 4;
  protected override updated() {
    this.style.setProperty('--columns', String(Math.max(1, Math.min(6, this.columns))));
  }
  protected override render() {
    return html`<section class="bar surface" part="bar" aria-label="Filters">
      <div class="fields" part="fields"><slot></slot></div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </section>`;
  }
}

export class DsKpiGrid extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: grid;
        grid-template-columns: repeat(var(--columns, 4), minmax(0, 1fr));
        gap: var(--ds-space-3);
      }
      @media (max-width: 1100px) {
        :host {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
      @media (max-width: 760px) {
        :host {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 380px) {
        :host {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
  @property({ type: Number }) columns = 4;
  protected override updated() {
    this.style.setProperty('--columns', String(Math.max(1, Math.min(6, this.columns))));
  }
  protected override render() {
    return html`<slot></slot>`;
  }
}
