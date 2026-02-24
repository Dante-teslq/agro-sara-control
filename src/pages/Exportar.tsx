import { useRef } from "react";
import Layout from "@/components/Layout";
import { exportAllData, importAllData, getDespesas, getVendas, getCulturas } from "@/db/database";
import { toCSV, downloadFile, CATEGORIA_LABELS, CANAL_LABELS } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileSpreadsheet, Database } from "lucide-react";
import { toast } from "sonner";

export default function Exportar() {
  const fileRef = useRef<HTMLInputElement>(null);

  const exportCSVDespesas = async () => {
    const despesas = await getDespesas();
    const culturas = await getCulturas();
    const rows = despesas.map((d) => ({
      ...d,
      categoriaLabel: CATEGORIA_LABELS[d.categoria],
      culturaNome: culturas.find((c) => c.id === d.culturaId)?.nome || "",
    }));
    const csv = toCSV(rows, [
      { key: "data", label: "Data" },
      { key: "categoriaLabel", label: "Categoria" },
      { key: "descricao", label: "Descrição" },
      { key: "valor", label: "Valor" },
      { key: "culturaNome", label: "Cultura" },
    ]);
    downloadFile(csv, "despesas.csv");
    toast.success("Despesas exportadas!");
  };

  const exportCSVVendas = async () => {
    const vendas = await getVendas();
    const culturas = await getCulturas();
    const rows = vendas.map((v) => ({
      ...v,
      canalLabel: CANAL_LABELS[v.canal],
      culturaNome: culturas.find((c) => c.id === v.culturaId)?.nome || "",
    }));
    const csv = toCSV(rows, [
      { key: "data", label: "Data" },
      { key: "culturaNome", label: "Cultura" },
      { key: "quantidade", label: "Quantidade" },
      { key: "unidade", label: "Unidade" },
      { key: "valorTotal", label: "Valor Total" },
      { key: "canalLabel", label: "Canal" },
    ]);
    downloadFile(csv, "vendas.csv");
    toast.success("Vendas exportadas!");
  };

  const exportBackup = async () => {
    const data = await exportAllData();
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, "agrogestao-backup.json", "application/json");
    toast.success("Backup criado!");
  };

  const importBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!confirm("Isso substituirá todos os dados atuais. Continuar?")) return;
      await importAllData(data);
      toast.success("Dados restaurados com sucesso!");
      window.location.reload();
    } catch {
      toast.error("Erro ao ler o arquivo. Verifique se é um backup válido.");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Layout title="Exportar / Backup">
      <div className="space-y-4 max-w-md">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Exportar CSV</h2>
          <Button variant="outline" className="w-full h-12 justify-start gap-3 text-base" onClick={exportCSVDespesas}>
            <FileSpreadsheet className="h-5 w-5" /> Exportar Despesas (CSV)
          </Button>
          <Button variant="outline" className="w-full h-12 justify-start gap-3 text-base" onClick={exportCSVVendas}>
            <FileSpreadsheet className="h-5 w-5" /> Exportar Vendas (CSV)
          </Button>
        </section>

        <section className="space-y-3 pt-4 border-t border-border">
          <h2 className="text-lg font-semibold">Backup Completo</h2>
          <Button variant="outline" className="w-full h-12 justify-start gap-3 text-base" onClick={exportBackup}>
            <Download className="h-5 w-5" /> Fazer Backup (JSON)
          </Button>
          <Button variant="outline" className="w-full h-12 justify-start gap-3 text-base" onClick={() => fileRef.current?.click()}>
            <Upload className="h-5 w-5" /> Restaurar Backup
          </Button>
          <input ref={fileRef} type="file" accept=".json" onChange={importBackup} className="hidden" />
        </section>
      </div>
    </Layout>
  );
}
