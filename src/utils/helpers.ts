import { Despesa, Venda } from "@/db/models";

/** Format number as BRL currency */
export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Format date string YYYY-MM-DD to DD/MM/YYYY */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

/** Get today as YYYY-MM-DD */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Category labels */
export const CATEGORIA_LABELS: Record<string, string> = {
  sementes: "Sementes",
  adubo: "Adubo",
  defensivo: "Defensivo",
  combustivel: "Combustível",
  mao_de_obra: "Mão de Obra",
  manutencao: "Manutenção",
  outros: "Outros",
};

export const CANAL_LABELS: Record<string, string> = {
  feira: "Feira",
  atravessador: "Atravessador",
  cooperativa: "Cooperativa",
  outros: "Outros",
};

export const UNIDADE_LABELS: Record<string, string> = {
  kg: "Quilograma (kg)",
  saco: "Saco",
  unidade: "Unidade",
  caixa: "Caixa",
};

/** Convert array of objects to CSV string */
export function toCSV(rows: Record<string, unknown>[], headers: { key: string; label: string }[]): string {
  const headerLine = headers.map((h) => h.label).join(";");
  const lines = rows.map((row) =>
    headers.map((h) => {
      const val = row[h.key];
      if (typeof val === "number") return val.toString().replace(".", ",");
      return `"${String(val ?? "")}"`;
    }).join(";")
  );
  return [headerLine, ...lines].join("\n");
}

/** Trigger file download in browser */
export function downloadFile(content: string, filename: string, type = "text/csv;charset=utf-8;") {
  const blob = new Blob(["\uFEFF" + content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
