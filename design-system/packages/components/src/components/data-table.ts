import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles, spinnerStyles } from '@finance-inzicht/styles';
import { DsElement, type DsDensity } from '../core/ds-element.js';

export interface DsTableColumn<Row extends Record<string, unknown> = Record<string, unknown>> {
  key: keyof Row | string;
  label: string;
  align?: 'start' | 'center' | 'end';
  sortable?: boolean;
  width?: string;
  format?: (value: unknown, row: Row) => unknown;
}
export interface DsSortDetail {
  key: string;
  direction: 'ascending' | 'descending';
}
export interface DsRowSelectDetail<Row = Record<string, unknown>> {
  row: Row;
  index: number;
  key: string;
}

export class DsDataTable extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    spinnerStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .frame {
        position: relative;
        max-width: 100%;
        overflow: auto;
        border: 1px solid var(--ds-color-border-default);
        border-top-color: var(--ds-color-border-highlight);
        border-radius: var(--ds-radius-lg);
        background: var(--ds-gradient-surface, var(--ds-color-bg-surface));
        box-shadow: var(--ds-shadow-panel);
      }
      table {
        width: 100%;
        min-width: 38rem;
        border-collapse: collapse;
        font-size: var(--ds-font-size-md);
        font-variant-numeric: tabular-nums;
      }
      caption {
        padding: var(--ds-space-3);
        text-align: left;
        font-weight: var(--ds-font-weight-semibold);
      }
      th,
      td {
        padding: 0.8125rem var(--ds-space-4);
        border-bottom: 1px solid var(--ds-color-border-subtle);
        text-align: left;
        vertical-align: middle;
      }
      th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: color-mix(in srgb, var(--ds-color-bg-elevated) 72%, var(--ds-color-bg-surface));
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-semibold);
        letter-spacing: 0.085em;
        text-transform: uppercase;
      }
      tbody tr:last-child td {
        border-bottom: 0;
      }
      tbody tr {
        transition: background var(--ds-duration-fast);
      }
      tbody tr[data-interactive] {
        cursor: pointer;
      }
      tbody tr[data-interactive]:hover,
      tbody tr[data-selected] {
        background: color-mix(in srgb, var(--ds-color-bg-selected) 72%, transparent);
      }
      tbody tr[data-selected] td:first-child {
        box-shadow: inset 2px 0 var(--ds-color-accent-primary);
      }
      tbody tr[data-interactive]:focus-visible {
        outline: 2px solid var(--ds-color-focus);
        outline-offset: -2px;
      }
      .end {
        text-align: right;
      }
      .center {
        text-align: center;
      }
      .sort {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-1);
        width: 100%;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        cursor: pointer;
      }
      .sort.end {
        justify-content: flex-end;
      }
      .sort.center {
        justify-content: center;
      }
      .indicator {
        font-size: 0.75rem;
      }
      .empty {
        padding: var(--ds-space-8);
        text-align: center;
        color: var(--ds-color-text-muted);
      }
      .busy {
        position: absolute;
        inset: 0;
        z-index: 2;
        display: grid;
        place-items: center;
        background: color-mix(in srgb, var(--ds-color-bg-surface) 82%, transparent);
        backdrop-filter: blur(2px);
      }
      :host([density='compact']) th,
      :host([density='compact']) td {
        padding: var(--ds-space-2) var(--ds-space-3);
        font-size: var(--ds-font-size-sm);
      }
    `,
  ];
  @property({ attribute: false }) columns: DsTableColumn[] = [];
  @property({ attribute: false }) rows: Record<string, unknown>[] = [];
  @property() caption = '';
  @property() emptyMessage = 'No results';
  @property() rowKey = 'id';
  @property() selectedKey = '';
  @property({ type: Boolean }) selectable = false;
  @property({ type: Boolean }) busy = false;
  @property({ reflect: true }) density: DsDensity = 'comfortable';
  @property({ attribute: 'sort-key' }) sortKey = '';
  @property({ attribute: 'sort-direction' }) sortDirection: 'ascending' | 'descending' =
    'ascending';
  private sort(column: DsTableColumn) {
    if (!column.sortable) return;
    const key = String(column.key);
    this.sortDirection =
      this.sortKey === key && this.sortDirection === 'ascending' ? 'descending' : 'ascending';
    this.sortKey = key;
    this.emit<DsSortDetail>('ds-sort', { key, direction: this.sortDirection });
  }
  private sortedRows() {
    if (!this.sortKey) return this.rows;
    const direction = this.sortDirection === 'ascending' ? 1 : -1,
      key = this.sortKey;
    return [...this.rows].sort(
      (left, right) =>
        String(left[key] ?? '').localeCompare(String(right[key] ?? ''), undefined, {
          numeric: true,
          sensitivity: 'base',
        }) * direction,
    );
  }
  private select(row: Record<string, unknown>, index: number) {
    if (!this.selectable) return;
    const key = String(row[this.rowKey] ?? index);
    this.selectedKey = key;
    this.emit<DsRowSelectDetail>('ds-row-select', { row, index, key });
  }
  private rowKeydown(event: KeyboardEvent, row: Record<string, unknown>, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(row, index);
    }
  }
  protected override render() {
    const rows = this.sortedRows();
    return html`<div class="frame" part="frame">
      <table part="table">
        ${
          this.caption
            ? html`<caption>
                ${this.caption}
              </caption>`
            : nothing
        }
        <thead>
          <tr>
            ${this.columns.map((column) => html`<th class=${column.align ?? 'start'} style=${column.width ? `width:${column.width}` : nothing} aria-sort=${this.sortKey === String(column.key) ? this.sortDirection : column.sortable ? 'none' : nothing}>${column.sortable ? html`<button class="sort ${column.align ?? 'start'}" type="button" @click=${() => this.sort(column)}>${column.label}<span class="indicator" aria-hidden="true">${this.sortKey === String(column.key) ? (this.sortDirection === 'ascending' ? '↑' : '↓') : '↕'}</span></button>` : column.label}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${
            rows.length
              ? rows.map(
                  (row, index) =>
                    html`<tr
                      data-interactive=${this.selectable ? true : nothing}
                      data-selected=${String(row[this.rowKey] ?? index) === this.selectedKey ? true : nothing}
                      tabindex=${this.selectable ? '0' : nothing}
                      @click=${() => this.select(row, index)}
                      @keydown=${(event: KeyboardEvent) => this.rowKeydown(event, row, index)}
                    >
                      ${this.columns.map((column) => {
                        const value = row[String(column.key)],
                          formatted = column.format?.(value, row) ?? value ?? '—';
                        return html`<td class=${column.align ?? 'start'}>${formatted}</td>`;
                      })}
                    </tr>`,
                )
              : html`<tr>
                  <td class="empty" colspan=${Math.max(1, this.columns.length)}>
                    ${this.emptyMessage}
                  </td>
                </tr>`
          }
        </tbody>
      </table>
      ${this.busy ? html`<div class="busy" role="status" aria-label="Loading"><span class="spinner"></span></div>` : nothing}
    </div>`;
  }
}
