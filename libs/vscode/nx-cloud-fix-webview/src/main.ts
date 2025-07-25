import { html, LitElement, TemplateResult, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { NxCloudFixMessage } from '@nx-console/shared-types';
import type { WebviewApi } from 'vscode-webview';
import '@nx-console/shared-ui-components';
import './nx-cloud-fix-component';
import type { NxCloudFixData } from './nx-cloud-fix-component';

@customElement('root-nx-cloud-fix-element')
export class Root extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
  }

  protected override createRenderRoot(): Element | ShadowRoot {
    return this;
  }

  private vscodeApi: WebviewApi<undefined> = acquireVsCodeApi();

  override connectedCallback() {
    super.connectedCallback();
    // Listen for messages from the extension
    window.addEventListener('message', (event) => {
      if (event.data.type === 'update-details') {
        globalThis.fixDetails = event.data.details as NxCloudFixData;
        this.requestUpdate();
      }
    });
  }

  override render(): TemplateResult {
    return html`
      <nx-cloud-fix-component
        .details=${globalThis.fixDetails as NxCloudFixData}
        .onApply=${() => this.handleApply()}
        .onApplyLocally=${() => this.handleApplyLocally()}
        .onReject=${() => this.handleReject()}
        .onShowDiff=${() => this.handleShowDiff()}
      ></nx-cloud-fix-component>
    `;
  }

  private handleApply() {
    this.vscodeApi.postMessage({ type: 'apply' } as NxCloudFixMessage);
  }

  private handleApplyLocally() {
    this.vscodeApi.postMessage({
      type: 'apply-locally',
    } as NxCloudFixMessage);
  }

  private handleReject() {
    this.vscodeApi.postMessage({ type: 'reject' } as NxCloudFixMessage);
  }

  private handleShowDiff() {
    this.vscodeApi.postMessage({ type: 'show-diff' } as NxCloudFixMessage);
  }
}
