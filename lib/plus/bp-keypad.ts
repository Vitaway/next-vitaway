/** BP keypad rules (BL-003 BP picker fix), same as Flutter lib/utils/health_classifiers.dart. No imports, so node --test can load it. */

/**
 * Adds one keypad digit to a BP field (BL-003 BP picker fix, same as Flutter bpKeypadAppend).
 * No leading zero, at most 3 digits, never above `max`; a refused key leaves the digits unchanged.
 */
export function bpKeypadAppend(current: string, key: string, max: number): string {
  if (!/^[0-9]$/.test(key)) return current;
  if (current.length >= 3) return current;
  if (current === "" && key === "0") return current;
  const next = current + key;
  if (Number.parseInt(next, 10) > max) return current;
  return next;
}

/** True when no further digit could keep the field valid, so focus moves on (95, 80, 72 advance; 12 waits). */
export function bpFieldComplete(digits: string, max: number): boolean {
  if (!digits) return false;
  if (digits.length >= 3) return true;
  return Number.parseInt(digits, 10) * 10 > max;
}
