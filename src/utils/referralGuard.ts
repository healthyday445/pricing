/**
 * Referral Fraud Guard
 *
 * Tracks how many times a user registers via a specific ?ref= link
 * using localStorage. After MAX_REFERRAL_USES (default 5) successful
 * registrations from the same browser, the ?ref= param is stripped
 * so the referral no longer counts.
 */

const STORAGE_KEY = 'hd_ref_usage';
const MAX_REFERRAL_USES = 5;

interface RefUsageMap {
  [refCode: string]: number;
}

/** Read the current usage map from localStorage */
function getUsageMap(): RefUsageMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Save the usage map back to localStorage */
function saveUsageMap(map: RefUsageMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage full or blocked — silently ignore
  }
}

/**
 * Call this on page load. If the current ?ref= code has been used
 * MAX_REFERRAL_USES or more times, strips the ref param and redirects
 * to the plain URL so the referral doesn't count.
 *
 * Returns `true` if the page is about to redirect (caller should stop rendering).
 */
export function enforceReferralLimit(): boolean {
  const url = new URL(window.location.href);
  const ref = url.searchParams.get('ref');

  if (!ref) return false; // no ref param — nothing to guard

  const map = getUsageMap();
  const count = map[ref] ?? 0;

  if (count >= MAX_REFERRAL_USES) {
    // Strip the ref param and redirect
    url.searchParams.delete('ref');
    window.location.replace(url.toString());
    return true; // redirect in progress
  }

  return false;
}

/**
 * Call this AFTER a successful registration to increment the usage
 * counter for the current ?ref= code.
 */
export function recordReferralUse(): void {
  const url = new URL(window.location.href);
  const ref = url.searchParams.get('ref');

  if (!ref) return;

  const map = getUsageMap();
  map[ref] = (map[ref] ?? 0) + 1;
  saveUsageMap(map);
}
