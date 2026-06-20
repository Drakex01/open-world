/**
 * AuthHeaderWidget — CYBERSPACE Edition.
 * No sign-in / sign-up needed. Shows only a settings button if provided.
 */

import { setTrustedHtml, trustedHtml } from '@/utils/dom-utils';
import { t } from '@/services/i18n';

export class AuthHeaderWidget {
  private container: HTMLElement;
  private onSettingsClick?: () => void;

  constructor(_onSignInClick?: () => void, onSettingsClick?: () => void) {
    this.onSettingsClick = onSettingsClick;
    this.container = document.createElement('div');
    this.container.className = 'auth-header-widget';

    if (this.onSettingsClick) {
      const settingsBtn = document.createElement('button');
      settingsBtn.className = 'auth-settings-btn';
      settingsBtn.type = 'button';
      settingsBtn.setAttribute('aria-label', t('auth.settings'));
      settingsBtn.title = t('auth.settings');
      setTrustedHtml(settingsBtn, trustedHtml(SETTINGS_ICON, 'legacy direct innerHTML migration'));
      settingsBtn.addEventListener('click', () => this.onSettingsClick?.());
      this.container.appendChild(settingsBtn);
    }
  }

  public getElement(): HTMLElement {
    return this.container;
  }

  public destroy(): void {
    // Nothing to tear down
  }
}

const SETTINGS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
