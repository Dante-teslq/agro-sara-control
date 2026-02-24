import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getPropriedade, savePropriedade } from "@/db/database";
import type { Propriedade } from "@/db/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings } from "lucide-react";

export default function Configuracoes() {
  const [prop, setProp] = useState<Propriedade | null>(null);
  const [nome, setNome] = useState("");
  const [produtor, setProdutor] = useState("");

  useEffect(() => {
    getPropriedade().then((p) => {
      if (p) { setProp(p); setNome(p.nomePropriedade); setProdutor(p.nomeProdutor); }
    });
  }, []);

  const handleSave = async () => {
    if (!prop || !nome.trim() || !produtor.trim()) return;
    await savePropriedade({ ...prop, nomePropriedade: nome.trim(), nomeProdutor: produtor.trim() });
    toast.success("Configurações salvas!");
  };

  return (
    <Layout title="Configurações">
      <div className="max-w-md space-y-4">
        <div className="space-y-2">
          <Label>Nome da Propriedade</Label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} className="h-12 text-base" />
        </div>
        <div className="space-y-2">
          <Label>Nome do Produtor</Label>
          <Input value={produtor} onChange={(e) => setProdutor(e.target.value)} className="h-12 text-base" />
        </div>
        <Button onClick={handleSave} className="h-12 text-base">Salvar</Button>

        <div className="pt-6 border-t border-border text-sm text-muted-foreground">
          <p>AgroGestão Simples v1.0</p>
          <p>Dados armazenados localmente no seu dispositivo.</p>
        </div>
      </div>
    </Layout>
  );
}
