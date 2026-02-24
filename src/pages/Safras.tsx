import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import EmptyState from "@/components/EmptyState";
import { getSafras, saveSafra, deleteSafra, getCulturas, genId } from "@/db/database";
import type { Safra, Cultura } from "@/db/models";
import { formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sprout, Plus, Trash2 } from "lucide-react";

export default function Safras() {
  const [safras, setSafras] = useState<Safra[]>([]);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [open, setOpen] = useState(false);
  const [culturaId, setCulturaId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [obs, setObs] = useState("");

  const load = async () => {
    setSafras(await getSafras());
    setCulturas(await getCulturas());
  };
  useEffect(() => { load(); }, []);

  const reset = () => { setCulturaId(""); setDataInicio(""); setDataFim(""); setObs(""); };

  const handleSave = async () => {
    if (!culturaId || !dataInicio) return;
    await saveSafra({ id: genId(), culturaId, dataInicio, dataFim: dataFim || undefined, observacoes: obs || undefined });
    setOpen(false);
    reset();
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Excluir esta safra?")) { await deleteSafra(id); load(); }
  };

  const culturaNome = (id: string) => culturas.find((c) => c.id === id)?.nome || "—";

  return (
    <Layout title="Safras">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild>
            <Button className="h-12 gap-2"><Plus className="h-5 w-5" /> Nova Safra</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Safra</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Cultura</Label>
                <Select value={culturaId} onValueChange={setCulturaId}>
                  <SelectTrigger className="h-12 text-base"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {culturas.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Data de Término (opcional)</Label>
                <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Anotações sobre a safra..." />
              </div>
              <Button onClick={handleSave} className="w-full h-12 text-base">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {safras.length === 0 ? (
        <EmptyState icon={<Sprout className="h-12 w-12" />} title="Nenhuma safra" description="Crie safras vinculadas às suas culturas" />
      ) : (
        <div className="space-y-3">
          {safras.map((s) => (
            <div key={s.id} className="rounded-xl bg-card border border-border p-4 flex justify-between items-start">
              <div>
                <div className="font-semibold">{culturaNome(s.culturaId)}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(s.dataInicio)}{s.dataFim ? ` — ${formatDate(s.dataFim)}` : " — em andamento"}
                </div>
                {s.observacoes && <p className="text-sm mt-1 text-muted-foreground">{s.observacoes}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
