import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles } from '@finance-inzicht/styles';
import { DsElement } from '../core/ds-element.js';

export interface DsActivateDetail {
  value: string;
}
export class DsSidebarItem extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: block;
      }
      .item {
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--ds-space-3);
        width: 100%;
        min-height: 2.5rem;
        padding: 0 var(--ds-space-3);
        border: 1px solid transparent;
        border-radius: var(--ds-radius-md);
        background: transparent;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-md);
        font-weight: var(--ds-font-weight-medium);
        text-decoration: none;
        cursor: pointer;
        text-align: left;
      }
      .item::before {
        content: '';
        position: absolute;
        left: -1px;
        top: 0.5rem;
        bottom: 0.5rem;
        width: 2px;
        border-radius: 2px;
        background: transparent;
      }
      .item:hover {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
      :host([active]) .item {
        background: var(--ds-color-bg-selected);
        border-color: var(--ds-color-border-default);
        color: var(--ds-color-text-primary);
      }
      :host([active]) .item::before {
        background: var(--ds-color-accent-primary);
      }
      .icon {
        display: inline-flex;
        width: var(--ds-icon-md);
        height: var(--ds-icon-md);
        flex: 0 0 auto;
      }
      .label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      @media (max-width: 680px) {
        .item {
          min-height: 3.25rem;
          flex-direction: column;
          justify-content: center;
          gap: var(--ds-space-1);
          padding: var(--ds-space-1);
          font-size: 0.625rem;
        }
        .item::before {
          inset: auto 0.75rem 0;
          height: 2px;
          width: auto;
        }
      }
    `,
  ];
  @property() value = '';
  @property() href = '';
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean }) disabled = false;
  private activate(event: Event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.emit<DsActivateDetail>('ds-activate', { value: this.value });
  }
  protected override render() {
    const content = html`<span class="icon"><slot name="icon"></slot></span
      ><span class="label"><slot></slot></span>`;
    return this.href
      ? html`<a
          class="item"
          part="item"
          href=${this.href}
          aria-current=${this.active ? 'page' : nothing}
          aria-disabled=${this.disabled ? 'true' : nothing}
          @click=${this.activate}
          >${content}</a
        >`
      : html`<button
          class="item"
          part="item"
          type="button"
          ?disabled=${this.disabled}
          aria-current=${this.active ? 'page' : nothing}
          @click=${this.activate}
        >
          ${content}
        </button>`;
  }
}

export class DsSidebar extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 14.5rem;
        height: 100%;
        padding: var(--ds-space-4);
        border-right: 1px solid var(--ds-color-border-subtle);
        background: var(--ds-color-bg-surface-subtle);
      }
      .brand {
        padding: var(--ds-space-2) var(--ds-space-2) var(--ds-space-6);
      }
      nav {
        display: grid;
        gap: var(--ds-space-1);
      }
      .footer {
        margin-top: auto;
        padding-top: var(--ds-space-4);
      }
      @media (max-width: 680px) {
        :host {
          position: fixed;
          z-index: var(--ds-z-sticky);
          inset: auto 0 0;
          width: auto;
          height: auto;
          padding: var(--ds-space-2) max(var(--ds-space-2), env(safe-area-inset-right))
            calc(var(--ds-space-2) + env(safe-area-inset-bottom))
            max(var(--ds-space-2), env(safe-area-inset-left));
          border-top: 1px solid var(--ds-color-border-default);
          border-right: 0;
          background: color-mix(in srgb, var(--ds-color-bg-surface-subtle) 94%, transparent);
          backdrop-filter: blur(16px);
        }
        .brand,
        .footer {
          display: none;
        }
        nav {
          display: flex;
          justify-content: space-around;
          gap: var(--ds-space-1);
        }
        ::slotted(ds-sidebar-item) {
          flex: 1;
          min-width: 0;
          max-width: 6rem;
        }
      }
    `,
  ];
  @property() label = 'Primary navigation';
  protected override render() {
    return html`<div class="brand" part="brand"><slot name="brand"></slot></div>
      <nav part="navigation" aria-label=${this.label}><slot></slot></nav>
      <div class="footer" part="footer"><slot name="footer"></slot></div>`;
  }
}

export class DsAppShell extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        min-height: 100dvh;
        background: var(--ds-color-bg-canvas);
      }
      .sidebar {
        position: sticky;
        top: 0;
        height: 100dvh;
      }
      .workspace {
        min-width: 0;
      }
      .header {
        position: sticky;
        top: 0;
        z-index: var(--ds-z-sticky);
        min-height: 4.5rem;
        border-bottom: 1px solid var(--ds-color-border-subtle);
        background: color-mix(in srgb, var(--ds-color-bg-surface-subtle) 92%, transparent);
        backdrop-filter: blur(16px);
      }
      .main {
        min-width: 0;
        padding: var(--ds-space-6);
      }
      @media (max-width: 680px) {
        :host {
          display: block;
        }
        .sidebar {
          position: static;
          height: 0;
        }
        .header {
          min-height: 4rem;
        }
        .main {
          padding: var(--ds-space-4) var(--ds-space-3) calc(5rem + env(safe-area-inset-bottom));
        }
      }
    `,
  ];
  protected override render() {
    return html`<aside class="sidebar" part="sidebar"><slot name="sidebar"></slot></aside>
      <section class="workspace">
        <header class="header" part="header"><slot name="header"></slot></header>
        <main class="main" part="main"><slot></slot></main>
      </section>`;
  }
}
