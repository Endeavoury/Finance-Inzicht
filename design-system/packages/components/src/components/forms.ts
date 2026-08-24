import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property, query } from 'lit/decorators.js';
import { formFoundationStyles, foundationStyles } from '@finance-inzicht/styles';
import { DsElement, type DsSize } from '../core/ds-element.js';

export interface DsValueChangeDetail {
  value: string;
}
export interface DsCheckedChangeDetail {
  checked: boolean;
  value: string;
}
export interface DsSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const fieldSpecificStyles = css`
  :host {
    display: block;
    min-width: 0;
  }
  .control-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .control-wrap > input,
  .control-wrap > select {
    width: 100%;
  }
  input,
  select {
    height: var(--ds-control-height-md);
    padding: 0 var(--ds-space-3);
    font-size: var(--ds-font-size-md);
  }
  :host([size='small']) input,
  :host([size='small']) select {
    height: var(--ds-control-height-sm);
    font-size: var(--ds-font-size-sm);
  }
  :host([size='large']) input,
  :host([size='large']) select {
    height: var(--ds-control-height-lg);
    font-size: var(--ds-font-size-lg);
  }
  input::placeholder {
    color: var(--ds-color-text-muted);
  }
  .invalid {
    border-color: var(--ds-color-danger) !important;
  }
  .prefix,
  .suffix {
    position: absolute;
    display: inline-flex;
    color: var(--ds-color-text-muted);
    pointer-events: none;
  }
  .prefix {
    left: var(--ds-space-3);
  }
  .suffix {
    right: var(--ds-space-3);
  }
  .has-prefix {
    padding-left: calc(var(--ds-space-3) + var(--ds-icon-md) + var(--ds-space-2));
  }
  .has-suffix {
    padding-right: calc(var(--ds-space-3) + var(--ds-icon-md) + var(--ds-space-2));
  }
  ::slotted([slot='prefix']),
  ::slotted([slot='suffix']) {
    width: var(--ds-icon-md);
    height: var(--ds-icon-md);
  }
`;

export class DsInput extends DsElement {
  static formAssociated = true;
  static override styles: CSSResultGroup = [formFoundationStyles, fieldSpecificStyles];
  readonly internals: ElementInternals;
  @query('input') protected control!: HTMLInputElement;
  @property() label = '';
  @property() name = '';
  @property() value = '';
  @property() type = 'text';
  @property() placeholder = '';
  @property() autocomplete = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Number }) minlength?: number;
  @property({ type: Number }) maxlength?: number;
  @property() helpText = '';
  @property() error = '';
  @property({ reflect: true }) size: DsSize = 'medium';
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  override focus(options?: FocusOptions) {
    this.control?.focus(options);
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
    this.syncForm();
  }
  checkValidity() {
    return this.control?.checkValidity() ?? true;
  }
  reportValidity() {
    return this.control?.reportValidity() ?? true;
  }
  protected syncForm() {
    this.internals.setFormValue(this.disabled ? null : this.value);
    if (this.control) {
      const validity = this.control.validity;
      this.internals.setValidity(
        validity,
        validity.valid ? '' : this.control.validationMessage,
        this.control,
      );
    }
  }
  private onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.syncForm();
    this.emit<DsValueChangeDetail>('ds-input', { value: this.value });
  }
  private onChange() {
    this.syncForm();
    this.emit<DsValueChangeDetail>('ds-change', { value: this.value });
  }
  protected override updated() {
    this.syncForm();
  }
  protected override render() {
    const helpId = 'help',
      errorId = 'error',
      described = this.error ? errorId : this.helpText ? helpId : nothing;
    return html`<label class="field"
      ><span class="label" part="label"
        >${this.label}${this.required ? html` <span class="required" aria-hidden="true">*</span>` : nothing}</span
      ><span class="control-wrap"
        ><span class="prefix"><slot name="prefix"></slot></span
        ><input
          part="control"
          class="control ${this.querySelector('[slot=prefix]') ? 'has-prefix' : ''} ${this.querySelector('[slot=suffix]') ? 'has-suffix' : ''} ${this.error ? 'invalid' : ''}"
          .value=${this.value}
          type=${this.type}
          name=${this.name}
          placeholder=${this.placeholder}
          autocomplete=${this.autocomplete || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          ?readonly=${this.readonly}
          minlength=${this.minlength ?? nothing}
          maxlength=${this.maxlength ?? nothing}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${described}
          @input=${this.onInput}
          @change=${this.onChange} /><span class="suffix"><slot name="suffix"></slot></span></span
      >${this.error ? html`<p id=${errorId} class="error" part="error">${this.error}</p>` : this.helpText ? html`<p id=${helpId} class="help" part="help">${this.helpText}</p>` : nothing}</label
    >`;
  }
}

export class DsSearchInput extends DsInput {
  override type = 'search';
  @property({ attribute: 'clear-label' }) clearLabel = 'Clear search';
  private clear() {
    this.value = '';
    this.syncForm();
    this.emit<DsValueChangeDetail>('ds-input', { value: '' });
    this.emit<DsValueChangeDetail>('ds-change', { value: '' });
    this.focus();
  }
  protected override render() {
    return html`<label class="field"
      ><span class="label" part="label">${this.label}</span
      ><span class="control-wrap"
        ><span class="prefix" aria-hidden="true"><slot name="prefix">⌕</slot></span
        ><input
          part="control"
          class="control has-prefix has-suffix ${this.error ? 'invalid' : ''}"
          .value=${this.value}
          type="search"
          name=${this.name}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-label=${this.label || this.placeholder}
          @input=${(event: Event) => this.onSearchInput(event)}
          @change=${() => this.onSearchChange()}
        /><button
          class="clear"
          type="button"
          ?hidden=${!this.value}
          aria-label=${this.clearLabel}
          @click=${this.clear}
        >
          ×
        </button></span
      >${this.error ? html`<p class="error" part="error">${this.error}</p>` : this.helpText ? html`<p class="help" part="help">${this.helpText}</p>` : nothing}</label
    >`;
  }
  private onSearchInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.syncForm();
    this.emit<DsValueChangeDetail>('ds-input', { value: this.value });
  }
  private onSearchChange() {
    this.syncForm();
    this.emit<DsValueChangeDetail>('ds-change', { value: this.value });
  }
  static override styles: CSSResultGroup = [
    DsInput.styles,
    css`
      .clear {
        position: absolute;
        right: var(--ds-space-2);
        display: grid;
        place-items: center;
        width: 1.75rem;
        height: 1.75rem;
        border: 0;
        border-radius: var(--ds-radius-sm);
        background: transparent;
        color: var(--ds-color-text-muted);
        cursor: pointer;
      }
      .clear:hover {
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-primary);
      }
      .clear[hidden] {
        display: none;
      }
    `,
  ];
}

export class DsSelect extends DsElement {
  static formAssociated = true;
  static override styles: CSSResultGroup = [
    formFoundationStyles,
    fieldSpecificStyles,
    css`
      select {
        appearance: none;
        padding-right: 2.25rem;
      }
      .chevron {
        position: absolute;
        right: var(--ds-space-3);
        pointer-events: none;
        color: var(--ds-color-text-muted);
      }
    `,
  ];
  readonly internals: ElementInternals;
  @query('select') protected control!: HTMLSelectElement;
  @property() label = '';
  @property() name = '';
  @property() value = '';
  @property() placeholder = '';
  @property({ attribute: false }) options: DsSelectOption[] = [];
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property() helpText = '';
  @property() error = '';
  @property({ reflect: true }) size: DsSize = 'medium';
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  override focus(options?: FocusOptions) {
    this.control?.focus(options);
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  formResetCallback() {
    this.value = this.getAttribute('value') ?? '';
    this.syncForm();
  }
  protected override updated() {
    this.syncForm();
  }
  private syncForm() {
    this.internals.setFormValue(this.disabled ? null : this.value);
    if (this.control)
      this.internals.setValidity(
        this.control.validity,
        this.control.validationMessage,
        this.control,
      );
  }
  private changed(event: Event) {
    this.value = (event.target as HTMLSelectElement).value;
    this.syncForm();
    this.emit<DsValueChangeDetail>('ds-change', { value: this.value });
  }
  protected override render() {
    return html`<label class="field"
      ><span class="label" part="label"
        >${this.label}${this.required ? html` <span class="required">*</span>` : nothing}</span
      ><span class="control-wrap"
        ><select
          part="control"
          class="control ${this.error ? 'invalid' : ''}"
          .value=${this.value}
          name=${this.name}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-invalid=${this.error ? 'true' : 'false'}
          @change=${this.changed}
        >
          ${this.placeholder ? html`<option value="" disabled>${this.placeholder}</option>` : nothing}${this.options.map((option) => html`<option value=${option.value} ?disabled=${option.disabled} ?selected=${option.value === this.value}>${option.label}</option>`)}</select
        ><span class="chevron" aria-hidden="true">⌄</span></span
      >${this.error ? html`<p class="error" part="error">${this.error}</p>` : this.helpText ? html`<p class="help" part="help">${this.helpText}</p>` : nothing}</label
    >`;
  }
}

export class DsCheckbox extends DsElement {
  static formAssociated = true;
  static override styles: CSSResultGroup = [
    formFoundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      .wrap {
        display: inline-grid;
        grid-template-columns: 1.125rem minmax(0, 1fr);
        gap: var(--ds-space-2);
        align-items: start;
        color: var(--ds-color-text-primary);
        font-size: var(--ds-font-size-md);
        cursor: pointer;
      }
      .box {
        display: grid;
        place-items: center;
        width: 1.125rem;
        height: 1.125rem;
        margin-top: 0.1rem;
        border: 1px solid var(--ds-color-border-strong);
        border-radius: var(--ds-radius-sm);
        background: var(--ds-color-bg-surface);
        color: var(--ds-color-text-inverse);
        transition:
          background var(--ds-duration-fast),
          border-color var(--ds-duration-fast);
      }
      input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }
      .checked {
        background: var(--ds-color-accent-primary);
        border-color: var(--ds-color-accent-primary);
      }
      .mark {
        font-size: 0.75rem;
        line-height: 1;
      }
      .help {
        grid-column: 2;
      }
      .disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `,
  ];
  readonly internals: ElementInternals;
  @property() name = '';
  @property() value = 'on';
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property() helpText = '';
  constructor() {
    super();
    this.internals = this.attachInternals();
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  formResetCallback() {
    this.checked = this.hasAttribute('checked');
    this.syncForm();
  }
  private syncForm() {
    this.internals.setFormValue(this.checked && !this.disabled ? this.value : null);
    this.internals.setValidity(
      this.required && !this.checked ? { valueMissing: true } : {},
      this.required && !this.checked ? 'Select this option' : '',
    );
  }
  private toggle() {
    this.checked = !this.checked;
    this.indeterminate = false;
    this.syncForm();
    this.emit<DsCheckedChangeDetail>('ds-change', { checked: this.checked, value: this.value });
  }
  private keydown(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }
  protected override updated() {
    this.syncForm();
  }
  protected override render() {
    return html`<label
      class="wrap ${this.disabled ? 'disabled' : ''}"
      @click=${(event: Event) => {
        event.preventDefault();
        if (!this.disabled) this.toggle();
      }}
      ><input
        type="checkbox"
        .checked=${this.checked}
        ?disabled=${this.disabled}
        tabindex="-1"
      /><span
        class="box ${this.checked || this.indeterminate ? 'checked' : ''}"
        part="control"
        role="checkbox"
        tabindex=${this.disabled ? -1 : 0}
        aria-labelledby="label"
        aria-checked=${this.indeterminate ? 'mixed' : String(this.checked)}
        aria-disabled=${String(this.disabled)}
        @keydown=${this.keydown}
        ><span class="mark" aria-hidden="true"
          >${this.indeterminate ? '−' : this.checked ? '✓' : ''}</span
        ></span
      ><span id="label" part="label"><slot></slot></span
      >${this.helpText ? html`<span class="help">${this.helpText}</span>` : nothing}</label
    >`;
  }
}

export class DsFormField extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: grid;
        gap: var(--ds-space-2);
      }
      .label {
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-semibold);
        cursor: default;
      }
      .help {
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
      }
      .error {
        color: var(--ds-color-danger);
        font-size: var(--ds-font-size-xs);
      }
    `,
  ];
  @property() label = '';
  @property() helpText = '';
  @property() error = '';
  @property({ type: Boolean }) required = false;
  private focusControl() {
    (
      this.querySelector(
        'ds-input,ds-select,ds-checkbox,input,select,textarea',
      ) as HTMLElement | null
    )?.focus();
  }
  protected override render() {
    return html`<span class="label" part="label" @click=${this.focusControl}
        ><slot name="label">${this.label}</slot
        >${this.required ? html` <span aria-hidden="true">*</span>` : nothing}</span
      ><slot></slot
      >${this.error ? html`<span class="error" part="error">${this.error}</span>` : this.helpText ? html`<span class="help" part="help">${this.helpText}</span>` : nothing}`;
  }
}
