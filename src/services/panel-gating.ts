/**
 * Panel gating — CYBERSPACE Edition.
 * Everything is free and available to all users. No sign-in, no Pro tier.
 */

import type { AuthSession } from './auth-state';

export enum PanelGateReason {
  NONE = 'none',
  ANONYMOUS = 'anonymous',
  FREE_TIER = 'free_tier',
}

/**
 * Always returns true — all content is free on CYBERSPACE.
 */
export function hasPremiumAccess(_authState?: AuthSession): boolean {
  return true;
}

/**
 * Always returns NONE — no panels are ever gated.
 */
export function getPanelGateReason(
  _authState: AuthSession,
  _isPremium: boolean,
): PanelGateReason {
  return PanelGateReason.NONE;
}
