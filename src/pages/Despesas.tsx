import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import EmptyState from "@/components/EmptyState";
import { getDespesas, saveDespesa, deleteDespesa, getCulturas, getSafras, genId } from "@/db/database";
import type { Despesa, Cultura, Safra, CategoriaDespesa } from "@/db/models";
import { formatBRL, formatDate, CATEGORIA_LABELS, today } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, Plus, Trash2 } from "lucide-react";

export default function Despesas() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [safras, setSafras] = useState<Safra[]>([]);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState(today);
  const [categoria, setCategoria] = useState<CategoriaDespesa>("outros");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [culturaId, setCulturaId] = useState("");
  const [safraId, setSafraId] = useState("");

  const load = async () => {
    setDespesas(await getDespesas());
    setCulturas(await getCulturas());
    setSafras(await getSafras());
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setData(today()); setCategoria("outros"); setDescricao(""); setValor(""); setCulturaId(""); setSafraId(""); };

  const handleSave = async () => {
    const v = parseFloat(valor.replace(",", "."));
    if (!data || !descricao.trim() || isNaN(v) || v <= 0) return;
    await saveDespesa({
      id: genId(), data, categoria, descricao: descricao.trim(), valor: v,
      culturaId: culturaId || undefined, safraId: safraId || undefined,
    });
    setOpen(false); reset(); load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta despesa?")) { await deleteDespesa(id); load(); }
  };

  const sorted = [...despesas].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <Layout title="Despesas">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild>
            <Button className="h-12 gap-2"><Plus className="h-5 w-5" /> Nova Despesa</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nova Despesa</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={categoria} onValueChange={(v) => setCategoria(v as CategoriaDespesa)}>
                  <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORIA_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Saco de adubo NPK" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input type="text" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label>Cultura (opcional)</Label>
                <Select value={culturaId} onValueChange={setCulturaId}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Nenhuma" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {culturas.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Safra (opcional)</Label>
                <Select value={safraId} onValueChange={setSafraId}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Nenhuma" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {safras.map((s) => {
                      const cn = culturas.find((c) => c.id === s.culturaId)?.nome || "";
                      return <SelectItem key={s.id} value={s.id}>{cn} — {formatDate(s.dataInicio)}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full h-12 text-base">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={<DollarSign className="h-12 w-12" />} title="Nenhuma despesa" description="Registre seus gastos da propriedade" />
      ) : (
        <div className="space-y-3">
          {sorted.map((d) => (
            <div key={d.id} className="rounded-xl bg-card border border-border p-4 flex justify-between items-start">
              <div>
                <div className="font-semibold">{d.descricao}</div>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3">
                  <span>{formatDate(d.data)}</span>
                  <span>{CATEGORIA_LABELS[d.categoria]}</span>
                  {d.culturaId && <span>{culturas.find((c) => c.id === d.culturaId)?.nome}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-expense whitespace-nowrap">{formatBRL(d.valor)}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
