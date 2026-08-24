# Current Product UI Inventory

## Product areas

| Area                | Current patterns                                                                                                                                         | Reusable classification                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Authentication      | centered sign-in card, labeled inputs, password state, inline error, primary submit                                                                      | Components + authentication business feature                                             |
| Application frame   | collapsible desktop sidebar, sticky top bar, profile control, language select, online/offline status, mobile bottom navigation and overflow menu         | App-shell pattern + navigation components                                                |
| Dashboard           | period segmented control, primary/secondary KPIs, bar/line/donut charts, legends, ranked lists, heatmap, accounts, unavailable-data notice               | Metrics, panels, status, layout primitives; charts remain application adapters initially |
| Monthly overview    | month navigation, six-metric summary, daily bars, progress ring, spending calendar, category bars, expandable categorized transactions, transfer summary | Page header, KPI grid, panels, progress, disclosure, table/list patterns                 |
| Year overview       | year navigation, monthly comparison, selectable month list, category tabs/chips, category heat matrix, annual detail groups                              | Page header, KPI grid, tabs/chips, data display patterns                                 |
| Ledger              | dense filter form, result count, responsive financial table, status/category badges, inline category editor, feedback                                    | Filter bar, form controls, data table, badge, alert                                      |
| Raw transactions    | search toolbar, expandable table rows, property groups, source JSON disclosure                                                                           | Search, data table, description list, disclosure                                         |
| Accounts            | responsive settings cards, labeled text/select controls, balance summary, save action                                                                    | Settings pattern, card, form field, button                                               |
| Imports             | drag-and-drop upload zone, busy state, success/error feedback, history table with statuses                                                               | Drop zone (P1), alert, loading state, data table, badge                                  |
| User administration | compact create-user form, role select, active status, action table                                                                                       | Form controls, status badge, data table                                                  |

## Interaction inventory

- Click and Enter activation for dashboard metrics and chart points.
- Single-selection navigation, period segmentation, category chips, calendar days, and table rows.
- Expand/collapse disclosures for category groups and raw detail.
- Form submission, filter apply/clear, dependent selects, checkbox opt-in, and inline editing.
- Drag/drop plus file input for imports.
- Sticky desktop header, collapsible sidebar, mobile bottom navigation, and responsive overflow menu.
- Loading, empty, error, success, offline, syncing, disabled, selected, hover, focus-visible, and negative-value states.
- Dense horizontal overflow for tables/charts and single-column/mobile card transformations.

## Classification boundary

| Classification   | Belongs in design system                                                         | Stays in product                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Primitive        | stack, inline, grid, container, divider, icon                                    | —                                                                                                                                |
| Component        | button, input, select, checkbox, badge, avatar, panel, metric, alert, data table | —                                                                                                                                |
| Pattern          | app shell, page header, filter bar, KPI grid, settings section, status summary   | Configuration and data mapping                                                                                                   |
| Business feature | —                                                                                | authentication, CAMT upload processing, categorization rules, finance calculations, account masking, API/offline synchronization |

## Responsive requirements

- Desktop: fixed/collapsible sidebar, sticky toolbar, multi-column KPI and analytics grids, dense tables.
- Tablet: full-width analytics panels, reduced column counts, horizontally scrollable comparison controls.
- Mobile: bottom navigation, two-column compact metric matrix, single-column panels, scroll containers that do not create page overflow, touch targets of at least 40–44px.
- Content stress: long localized labels, large/negative currency values, long counterparty/reference strings, empty data, and 12-month datasets.
