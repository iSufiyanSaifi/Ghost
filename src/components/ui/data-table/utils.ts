import type { DataTableDateComparisonOperator } from "./types"

const DATE_OPERATORS = ["$gte", "$lte", "$gt", "$lt"]

function isDateComparisonOperator(value: unknown): value is DataTableDateComparisonOperator {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false
  const entries = Object.entries(value as Record<string, unknown>)
  return (
    DATE_OPERATORS.some((op) => op in value) &&
    entries.every(([key, val]) => DATE_OPERATORS.includes(key) && (typeof val === "string" || val === undefined))
  )
}

function isEmptyFilterValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
}

/** True when focus is in a text field, where single-key shortcuts must not fire. */
function isEditableElementFocused() {
  const el = typeof document === "undefined" ? null : document.activeElement
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    (el instanceof HTMLElement && el.isContentEditable)
  )
}

/** ₹ with Indian (lakh) grouping, e.g. ₹1,24,580. Whole rupees unless `fractionDigits` is given. */
function formatDataTableCurrency(value: number, fractionDigits = 0) {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`
}

/** DD/MM/YYYY, adding HH:MM (24-hour) when `withTime` is set. */
function formatDataTableDate(value: Date | string | number, withTime = false) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
  return withTime ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}` : day
}

export {
  formatDataTableCurrency,
  formatDataTableDate,
  isDateComparisonOperator,
  isEditableElementFocused,
  isEmptyFilterValue,
}
