// How the vault lists every character: portrait cards or compact rows.
export type VaultView = 'grid' | 'list';

export const VAULT_VIEW_COOKIE = 'elysium-vault-view';

export function toVaultView(saved: string | undefined): VaultView {
  return saved === 'list' ? 'list' : 'grid';
}

// In the browser only.
export function rememberVaultView(view: VaultView) {
  document.cookie = `${VAULT_VIEW_COOKIE}=${view}; path=/; max-age=31536000; samesite=lax`;
}
