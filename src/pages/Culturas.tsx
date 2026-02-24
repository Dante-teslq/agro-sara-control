import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import EmptyState from "@/components/EmptyState";
import { getCulturas, saveCultura, deleteCultura, genId } from "@/db/database";
import type { Cultura } from "@/db/models";
import { UNIDADE_LABELS } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Leaf, Plus, Pencil, Trash2 } from "lucide-react";

export default function Culturas() {
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Cultura | null>(null);
  const [nome, setNome] = useState("");
  const [unidade, setUnidade] = useState<Cultura["unidadePadrao"]>("kg");

  const load = async () => setCulturas(await getCulturas());
  useEffect(() => { load(); }, []);

  const reset = () => { setNome(""); setUnidade("kg"); setEditing(null); };

  const handleOpen = (c?: Cultura) => {
    if (c) { setEditing(c); setNome(c.nome); setUnidade(c.unidadePadrao); }
    else reset();
    setOpen(true);
  };

  const handleSave = async () => {
    if (!nome.trim()) return;
    await saveCultura({ id: editing?.id || genId(), nome: nome.trim(), unidadePadrao: unidade });
    setOpen(false);
    reset();
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta cultura?")) {
      await deleteCultura(id);
      load();
    }
  };

  return (
    <Layout title="Culturas">
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()} className="h-12 gap-2">
              <Plus className="h-5 w-5" /> Nova Cultura
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Cultura" : "Nova Cultura"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Nome da Cultura</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Milho" className="h-12 text-base" />
              </div>
              <div className="space-y-2">
                <Label>Unidade Padrão</Label>
                <Select value={unidade} onValueChange={(v) => setUnidade(v as Cultura["unidadePadrao"])}>
                  <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(UNIDADE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full h-12 text-base">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {culturas.length === 0 ? (
        <EmptyState
          icon={<Leaf className="h-12 w-12" />}
          title="Nenhuma cultura cadastrada"
          description="Cadastre suas culturas para organizar despesas e vendas"
        />
      ) : (
        <div className="space-y-3">
          {culturas.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-xl bg-card border border-border p-4">
              <div>
                <div className="font-semibold">{c.nome}</div>
                <div className="text-sm text-muted-foreground">{UNIDADE_LABELS[c.unidadePadrao]}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleOpen(c)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
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
