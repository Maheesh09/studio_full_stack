// src/lib/date.ts
export const fmtDateTime = (v?: string | null) =>
  v ? new Date(v).toLocaleString() : "-";
