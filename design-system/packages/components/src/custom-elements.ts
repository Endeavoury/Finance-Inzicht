import type { DsButton, DsButtonGroup, DsIconButton } from './components/button.js';
import type { DsIcon } from './components/icon.js';
import type {
  DsCheckbox,
  DsFormField,
  DsInput,
  DsSearchInput,
  DsSelect,
} from './components/forms.js';
import type {
  DsAvatar,
  DsBadge,
  DsCard,
  DsMetric,
  DsPanel,
  DsStatusBadge,
} from './components/display.js';
import type { DsAlert, DsEmptyState, DsLoadingState } from './components/feedback.js';
import type { DsDataTable } from './components/data-table.js';
import type { DsContainer, DsGrid, DsInline, DsPageHeader, DsStack } from './components/layout.js';
import type { DsAppShell, DsSidebar, DsSidebarItem } from './components/navigation.js';
import type { DsFilterBar, DsKpiGrid } from './components/patterns.js';

declare global {
  interface HTMLElementTagNameMap {
    'ds-icon': DsIcon;
    'ds-button': DsButton;
    'ds-icon-button': DsIconButton;
    'ds-button-group': DsButtonGroup;
    'ds-input': DsInput;
    'ds-search-input': DsSearchInput;
    'ds-select': DsSelect;
    'ds-checkbox': DsCheckbox;
    'ds-form-field': DsFormField;
    'ds-badge': DsBadge;
    'ds-status-badge': DsStatusBadge;
    'ds-avatar': DsAvatar;
    'ds-card': DsCard;
    'ds-panel': DsPanel;
    'ds-metric': DsMetric;
    'ds-alert': DsAlert;
    'ds-loading-state': DsLoadingState;
    'ds-empty-state': DsEmptyState;
    'ds-data-table': DsDataTable;
    'ds-stack': DsStack;
    'ds-inline': DsInline;
    'ds-grid': DsGrid;
    'ds-container': DsContainer;
    'ds-page-header': DsPageHeader;
    'ds-app-shell': DsAppShell;
    'ds-sidebar': DsSidebar;
    'ds-sidebar-item': DsSidebarItem;
    'ds-filter-bar': DsFilterBar;
    'ds-kpi-grid': DsKpiGrid;
  }
}

export {};
