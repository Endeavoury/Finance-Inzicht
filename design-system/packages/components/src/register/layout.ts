import { defineComponent } from '../core/ds-element.js';
import { DsContainer, DsGrid, DsInline, DsPageHeader, DsStack } from '../components/layout.js';
defineComponent('ds-stack', DsStack);
defineComponent('ds-inline', DsInline);
defineComponent('ds-grid', DsGrid);
defineComponent('ds-container', DsContainer);
defineComponent('ds-page-header', DsPageHeader);
export { DsContainer, DsGrid, DsInline, DsPageHeader, DsStack };
