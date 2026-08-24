import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@finance-inzicht/design-system';

export const FINANCE_INZICHT_CUSTOM_ELEMENTS_SCHEMA = CUSTOM_ELEMENTS_SCHEMA;
export const DESIGN_SYSTEM_SCHEMAS = [FINANCE_INZICHT_CUSTOM_ELEMENTS_SCHEMA] as const;
export function registerDesignSystem(): void {
  // Importing this package registers the same Web Components used by every consumer.
}
