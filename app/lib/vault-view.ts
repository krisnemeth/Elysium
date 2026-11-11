// How the vault lists every character: portrait cards or compact rows.
export type VaultView = 'grid' | 'list';

export const VAULT_VIEW_COOKIE = 'elysium-vault-view';

// 'auto' until the player chooses: List on phones, Grid elsewhere (plans/mobile.md).
export function toVaultView(saved: string | undefined): VaultView | 'auto' {
  return saved === 'list' || saved === 'grid' ? saved : 'auto';
}

// In the browser only.
export function rememberVaultView(view: VaultView) {
  document.cookie = `${VAULT_VIEW_COOKIE}=${view}; path=/; max-age=31536000; samesite=lax`;
}
