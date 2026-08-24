import { defineComponent } from '../core/ds-element.js';
import {
  DsAvatar,
  DsBadge,
  DsCard,
  DsMetric,
  DsPanel,
  DsStatusBadge,
} from '../components/display.js';
defineComponent('ds-badge', DsBadge);
defineComponent('ds-status-badge', DsStatusBadge);
defineComponent('ds-avatar', DsAvatar);
defineComponent('ds-card', DsCard);
defineComponent('ds-panel', DsPanel);
defineComponent('ds-metric', DsMetric);
export { DsAvatar, DsBadge, DsCard, DsMetric, DsPanel, DsStatusBadge };
