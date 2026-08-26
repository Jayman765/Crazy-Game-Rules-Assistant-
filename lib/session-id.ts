/**
 * Anonymous session identifier.
 *
 * Generated fresh in the browser each visit, held only in client state, and
 * sent to the API purely so related questions can be grouped together in the
 * admin logs. It carries no personal information and is not persisted.
 */
export function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback for the rare browser/context where `randomUUID` is unavailable
  // (e.g. a plain-HTTP origin). Still cryptographically random.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}
