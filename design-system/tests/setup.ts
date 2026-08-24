import '@finance-inzicht/design-system';
import { afterEach } from 'vitest';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

if (!HTMLElement.prototype.attachInternals) {
  Object.defineProperty(HTMLElement.prototype, 'attachInternals', {
    configurable: true,
    value() {
      return {
        form: null,
        labels: null,
        validity: { valid: true },
        validationMessage: '',
        willValidate: true,
        checkValidity: () => true,
        reportValidity: () => true,
        setFormValue: () => undefined,
        setValidity: () => undefined,
      };
    },
  });
}

afterEach(() => {
  document.body.replaceChildren();
  document.documentElement.removeAttribute('data-ds-theme');
});
