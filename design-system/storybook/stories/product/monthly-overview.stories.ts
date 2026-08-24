import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { productHeader, productSidebar, productStyles } from './product-fixtures.js';
const meta: Meta = {
  title: 'Current Product/Monthly Overview',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
export const August2026: StoryObj = {
  globals: { theme: 'dark' },
  render: () =>
    html`${productStyles}
      <div class="product">
        <ds-app-shell
          >${productSidebar()}${productHeader('Monthly overview')}<ds-page-header
            eyebrow="Monthly overview"
            heading="August 2026"
            description="Every incoming and outgoing movement, grouped by category."
            ><ds-button-group slot="actions"
              ><ds-icon-button label="Previous"
                ><ds-icon name="chevron-left"></ds-icon></ds-icon-button
              ><ds-button variant="secondary">2026-08</ds-button
              ><ds-icon-button label="Next"
                ><ds-icon name="chevron-right"></ds-icon></ds-icon-button></ds-button-group
          ></ds-page-header>
          <div class="content">
            <ds-kpi-grid columns="6"
              ><ds-metric
                label="Income"
                value="€6,200"
                tone="success"
                detail="External cash"
              ></ds-metric
              ><ds-metric
                label="Expenses"
                value="€3,441"
                tone="danger"
                detail="External spending"
              ></ds-metric
              ><ds-metric
                label="Savings"
                value="+€2,759"
                tone="warning"
                detail="Net result"
              ></ds-metric
              ><ds-metric label="Transfers" value="€1,250" detail="Own accounts"></ds-metric
              ><ds-metric
                label="Transactions"
                value="21"
                tone="accent"
                detail="Aug 1–31"
              ></ds-metric
              ><ds-metric
                label="Savings rate"
                value="44.5%"
                tone="info"
                detail="Monthly rhythm"
              ></ds-metric
            ></ds-kpi-grid>
            <div class="split">
              <ds-panel eyebrow="Daily spending" heading="Spending through the month"
                ><div class="chart">
                  ${[90, 8, 12, 10, 15, 18, 11, 9, 13, 16, 11, 18, 14, 10, 17, 7].map((height) => html`<div class="chart-group"><i class="bar out" style=${`height:${height}%`}></i></div>`)}
                </div></ds-panel
              ><ds-panel eyebrow="Spending calendar" heading="August 2026"
                ><div class="calendar">
                  ${Array.from({ length: 31 }, (_, i) => html`<span class="day ${[0, 7, 17, 22].includes(i) ? 'hot' : ''}">${i + 1}</span>`)}
                </div></ds-panel
              >
            </div>
            <ds-panel eyebrow="Categories" heading="Spending by category"
              ><div class="category-list">
                ${[
                  ['Housing', '€1,650'],
                  ['Food', '€958'],
                  ['Transportation', '€254'],
                  ['Utilities', '€188'],
                  ['Shopping', '€174'],
                  ['Health', '€156'],
                ].map(
                  (row) =>
                    html`<div class="category"><strong>${row[0]}</strong><b>${row[1]}</b></div>`,
                )}
              </div></ds-panel
            >
          </div></ds-app-shell
        >
      </div>`,
};
