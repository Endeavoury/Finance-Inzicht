# Component Gap Analysis and Roadmap

## Gap analysis

| Current UI pattern             |                       Usage | Proposed component/pattern                                                 | Priority | Notes                                                     |
| ------------------------------ | --------------------------: | -------------------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| Primary/secondary/text actions |                   Very high | `ds-button`, `ds-icon-button`, `ds-button-group`                           | P0       | Loading, disabled, destructive, compact                   |
| Labeled fields and validation  |                   Very high | `ds-form-field`, `ds-input`, `ds-select`, `ds-checkbox`, `ds-search-input` | P0       | Form-associated controls                                  |
| KPI cards and summaries        |                   Very high | `ds-metric`, `ds-kpi-grid`                                                 | P0       | Currency/value-agnostic slots                             |
| Content surfaces               |                   Very high | `ds-card`, `ds-panel`                                                      | P0       | Stable header/footer parts and slots                      |
| Dense result tables            |                   Very high | `ds-data-table`                                                            | P0       | Property-based rows/columns, sort/select events, overflow |
| Status/category labels         |                        High | `ds-badge`, `ds-status-badge`                                              | P0       | Semantic tones, not domain statuses                       |
| App navigation                 |                        High | `ds-app-shell`, `ds-sidebar`, `ds-sidebar-item`                            | P0       | Responsive desktop/mobile composition                     |
| Page title/actions             |                        High | `ds-page-header`                                                           | P0       | Eyebrow, description, action slot                         |
| Filter forms/toolbars          |                        High | `ds-filter-bar`                                                            | P0       | Composition, responsive collapse                          |
| Feedback and no-data states    |                        High | `ds-alert`, `ds-loading-state`, `ds-empty-state`                           | P0       | Live-region behavior where appropriate                    |
| User/profile identity          |                      Medium | `ds-avatar`                                                                | P0       | Initials/image/fallback                                   |
| Layout composition             |                        High | `ds-stack`, `ds-inline`, `ds-grid`, `ds-container`                         | P0       | Attribute-driven, no utility leakage                      |
| Period/category selection      |                      Medium | `ds-tabs`                                                                  | P1       | Roving tabindex and keyboard arrows                       |
| Expandable detail              |                      Medium | `ds-disclosure`                                                            | P1       | Native details semantics                                  |
| File import                    |                      Medium | `ds-drop-zone`                                                             | P1       | Native file input + drag state only                       |
| Property detail groups         |                      Medium | `ds-description-list`, `ds-key-value`                                      | P1       | Raw transaction/account detail                            |
| Progress indicators            |                      Medium | `ds-progress`, `ds-skeleton`                                               | P1       | Determinate/indeterminate/reduced motion                  |
| Temporary messages             |                   Low today | `ds-toast`, `ds-toast-region`                                              | P1       | Queue and live-region policy                              |
| Confirmation/modal detail      |             Not present yet | `ds-dialog`, `ds-drawer`                                                   | P1       | Native dialog/top layer, focus return                     |
| Menus                          |        Mobile overflow only | `ds-dropdown-menu`                                                         | P1       | Popover API + roving focus                                |
| Pagination                     | API supports it, UI minimal | `ds-pagination`                                                            | P1       | Table integration remains composition                     |
| Tooltips                       |                         Low | `ds-tooltip`                                                               | P2       | Supplemental only, never sole label                       |
| Radio/switch/textarea          |           Low in current UI | `ds-radio-group`, `ds-switch`, `ds-textarea`                               | P2       | Generic future-product additions                          |
| Breadcrumbs                    |                 Not present | `ds-breadcrumbs`                                                           | P2       | Add when hierarchy appears                                |

## Delivery roadmap

### P0 — Current core workflows

Foundations, layouts, actions, current form controls, badges/avatar, surfaces/metrics, feedback states, data table, application shell/navigation, page header, filter bar, and KPI grid. P0 includes Storybook dashboard, monthly overview, ledger, and settings/import compositions.

### P1 — Important secondary workflows

Tabs, disclosure, drop zone, description list, progress/skeleton, toast, dialog/drawer, dropdown menu, and pagination. Implement when the product migration reaches raw details, import workflow, or overlays.

### P2 — Generic expansion

Tooltip, textarea, radio group, switch, breadcrumbs, and other components without current-product demand. P2 must not delay package hardening or interoperability.
