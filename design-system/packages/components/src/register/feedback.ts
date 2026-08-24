import { defineComponent } from '../core/ds-element.js';
import { DsAlert, DsEmptyState, DsLoadingState } from '../components/feedback.js';
defineComponent('ds-alert', DsAlert);
defineComponent('ds-empty-state', DsEmptyState);
defineComponent('ds-loading-state', DsLoadingState);
export { DsAlert, DsEmptyState, DsLoadingState };
