import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import EmptyState from "@/components/EmptyState";
import { getVendas, saveVenda, deleteVenda, getCulturas, genId } from "@/db/database";
import type { Venda, Cultura, CanalVenda } from "@/db/models";
import { formatBRL, formatDate, CANAL_LABELS, UNIDADE_LABELS, today } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Plus, Trash2 } from "lucide-react";

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [open, setOpen] = useState(false);

  const [data, setData] = useState(today);
  const [culturaId, setCulturaId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [unidade, setUnidade] = useState("kg");
  const [valorTotal, setValorTotal] = useState("");
  const [canal, setCanal] = useState<CanalVenda>("feira");

  const load = async () => {
    setVendas(await getVendas());
    setCulturas(await getCulturas());
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setData(today()); setCulturaId(""); setQuantidade(""); setUnidade("kg"); setValorTotal(""); setCanal("feira"); };

  // When cultura changes, set default unit
  const onCulturaChange = (id: string) => {
    setCulturaId(id);
    const c = culturas.find((c) => c.id === id);
    if (c) setUnidade(c.unidadePadrao);
  };

  const handleSave = async () => {
    const qtd = parseFloat(quantidade.replace(",", "."));
    const vt = parseFloat(valorTotal.replace(",", "."));
    if (!data || !culturaId || isNaN(qtd) || isNaN(vt) || qtd <= 0 || vt <= 0) return;
    await saveVenda({ id: genId(), data, culturaId, quantidade: qtd, unidade, valorTotal: vt, canal });
    setOpen(false); reset(); load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta venda?")) { await deleteVenda(id); load(); }
  };

  const sorted = [...vendas].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <Layout title="Vendas">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild>
            <Button className="h-12 gap-2"><Plus className="h-5 w-5" /> Nova Venda</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90dvh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nova Venda</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={data} onChange={(e) => setData(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Cultura</Label>
                <Select value={culturaId} onValueChange={onCulturaChange}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {culturas.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input type="text" inputMode="decimal" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="0" className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select value={unidade} onValueChange={setUnidade}>
                    <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(UNIDADE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Valor Total (R$)</Label>
                <Input type="text" inputMode="decimal" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} placeholder="0,00" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label>Canal de Venda</Label>
                <Select value={canal} onValueChange={(v) => setCanal(v as CanalVenda)}>
                  <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CANAL_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full h-12 text-base">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={<ShoppingCart className="h-12 w-12" />} title="Nenhuma venda" description="Registre suas vendas para acompanhar a receita" />
      ) : (
        <div className="space-y-3">
          {sorted.map((v) => (
            <div key={v.id} className="rounded-xl bg-card border border-border p-4 flex justify-between items-start">
              <div>
                <div className="font-semibold">{culturas.find((c) => c.id === v.culturaId)?.nome}</div>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-x-3">
                  <span>{formatDate(v.data)}</span>
                  <span>{v.quantidade} {v.unidade}</span>
                  <span>{CANAL_LABELS[v.canal]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-income whitespace-nowrap">{formatBRL(v.valorTotal)}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
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
