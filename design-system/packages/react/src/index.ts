import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import '@finance-inzicht/design-system';
import {
  DsAlert,
  DsAppShell,
  DsAvatar,
  DsBadge,
  DsButton,
  DsButtonGroup,
  DsCard,
  DsCheckbox,
  DsContainer,
  DsDataTable,
  DsEmptyState,
  DsFilterBar,
  DsFormField,
  DsGrid,
  DsIcon,
  DsIconButton,
  DsInline,
  DsInput,
  DsKpiGrid,
  DsLoadingState,
  DsMetric,
  DsPageHeader,
  DsPanel,
  DsSearchInput,
  DsSelect,
  DsSidebar,
  DsSidebarItem,
  DsStack,
  DsStatusBadge,
  type DsActivateDetail,
  type DsCheckedChangeDetail,
  type DsRowSelectDetail,
  type DsSortDetail,
  type DsValueChangeDetail,
} from '@finance-inzicht/design-system';

const component = <ElementClass extends HTMLElement>(
  tagName: string,
  elementClass: { new (): ElementClass },
) => createComponent<ElementClass>({ tagName, elementClass, react: React });
export const Icon = component('ds-icon', DsIcon);
export const Button = component('ds-button', DsButton);
export const IconButton = component('ds-icon-button', DsIconButton);
export const ButtonGroup = component('ds-button-group', DsButtonGroup);
export const Input = createComponent({
  tagName: 'ds-input',
  elementClass: DsInput,
  react: React,
  events: {
    onDsInput: 'ds-input' as EventName<CustomEvent<DsValueChangeDetail>>,
    onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>>,
  },
});
export const SearchInput = createComponent({
  tagName: 'ds-search-input',
  elementClass: DsSearchInput,
  react: React,
  events: {
    onDsInput: 'ds-input' as EventName<CustomEvent<DsValueChangeDetail>>,
    onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>>,
  },
});
export const Select = createComponent({
  tagName: 'ds-select',
  elementClass: DsSelect,
  react: React,
  events: { onDsChange: 'ds-change' as EventName<CustomEvent<DsValueChangeDetail>> },
});
export const Checkbox = createComponent({
  tagName: 'ds-checkbox',
  elementClass: DsCheckbox,
  react: React,
  events: { onDsChange: 'ds-change' as EventName<CustomEvent<DsCheckedChangeDetail>> },
});
export const FormField = component('ds-form-field', DsFormField);
export const Badge = component('ds-badge', DsBadge);
export const StatusBadge = component('ds-status-badge', DsStatusBadge);
export const Avatar = component('ds-avatar', DsAvatar);
export const Card = component('ds-card', DsCard);
export const Panel = component('ds-panel', DsPanel);
export const Metric = component('ds-metric', DsMetric);
export const Alert = createComponent({
  tagName: 'ds-alert',
  elementClass: DsAlert,
  react: React,
  events: { onDsDismiss: 'ds-dismiss' as EventName<CustomEvent<void>> },
});
export const LoadingState = component('ds-loading-state', DsLoadingState);
export const EmptyState = component('ds-empty-state', DsEmptyState);
export const DataTable = createComponent({
  tagName: 'ds-data-table',
  elementClass: DsDataTable,
  react: React,
  events: {
    onDsSort: 'ds-sort' as EventName<CustomEvent<DsSortDetail>>,
    onDsRowSelect: 'ds-row-select' as EventName<CustomEvent<DsRowSelectDetail>>,
  },
});
export const Stack = component('ds-stack', DsStack);
export const Inline = component('ds-inline', DsInline);
export const Grid = component('ds-grid', DsGrid);
export const Container = component('ds-container', DsContainer);
export const PageHeader = component('ds-page-header', DsPageHeader);
export const AppShell = component('ds-app-shell', DsAppShell);
export const Sidebar = component('ds-sidebar', DsSidebar);
export const SidebarItem = createComponent({
  tagName: 'ds-sidebar-item',
  elementClass: DsSidebarItem,
  react: React,
  events: { onDsActivate: 'ds-activate' as EventName<CustomEvent<DsActivateDetail>> },
});
export const FilterBar = component('ds-filter-bar', DsFilterBar);
export const KpiGrid = component('ds-kpi-grid', DsKpiGrid);
