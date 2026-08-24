import { defineComponent } from '../core/ds-element.js';
import { DsIcon } from '../components/icon.js';
import { DsAppShell, DsSidebar, DsSidebarItem } from '../components/navigation.js';
defineComponent('ds-icon', DsIcon);
defineComponent('ds-app-shell', DsAppShell);
defineComponent('ds-sidebar', DsSidebar);
defineComponent('ds-sidebar-item', DsSidebarItem);
export { DsIcon, DsAppShell, DsSidebar, DsSidebarItem };
