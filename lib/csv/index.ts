/**
 * Minimal RFC 4180 CSV writer.
 *
 * Every value is quoted and every embedded quote is doubled, so commas,
 * quotation marks and newlines inside a question or answer cannot corrupt the
 * file. A leading `=`, `+`, `-` or `@` is prefixed with a single quote to stop
 * spreadsheets interpreting the cell as a formula.
 */

const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

export function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return '""';

  let text = value instanceof Date ? value.toISOString() : String(value);

  if (FORMULA_PREFIXES.some((prefix) => text.startsWith(prefix))) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function toCsvRow(values: readonly unknown[]): string {
  return `${values.map(escapeCsvValue).join(",")}\r\n`;
}

/** A UTF-8 BOM so Excel opens accented characters correctly. */
export const CSV_BOM = "﻿";
