import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getDespesas, getVendas, getCulturas } from "@/db/database";
import type { Despesa, Venda, Cultura } from "@/db/models";
import { formatBRL, today } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, Wallet, Leaf } from "lucide-react";

export default function Dashboard() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 10);
  });
  const [dataFim, setDataFim] = useState(today);

  useEffect(() => {
    Promise.all([getDespesas(), getVendas(), getCulturas()]).then(([d, v, c]) => {
      setDespesas(d);
      setVendas(v);
      setCulturas(c);
    });
  }, []);

  const filteredDespesas = despesas.filter((d) => d.data >= dataInicio && d.data <= dataFim);
  const filteredVendas = vendas.filter((v) => v.data >= dataInicio && v.data <= dataFim);

  const totalDespesas = filteredDespesas.reduce((s, d) => s + d.valor, 0);
  const totalVendas = filteredVendas.reduce((s, v) => s + v.valorTotal, 0);
  const saldo = totalVendas - totalDespesas;

  // Resumo por cultura
  const resumoCulturas = culturas.map((c) => {
    const despC = filteredDespesas.filter((d) => d.culturaId === c.id).reduce((s, d) => s + d.valor, 0);
    const venC = filteredVendas.filter((v) => v.culturaId === c.id).reduce((s, v) => s + v.valorTotal, 0);
    return { nome: c.nome, despesas: despC, vendas: venC, saldo: venC - despC };
  }).filter((r) => r.despesas > 0 || r.vendas > 0);

  return (
    <Layout title="Dashboard">
      {/* Filtro de período */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Data Início</Label>
          <Input type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="h-11" />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Data Fim</Label>
          <Input type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="h-11" />
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <SummaryCard
          icon={<TrendingDown className="h-5 w-5" />}
          label="Despesas"
          value={formatBRL(totalDespesas)}
          variant="expense"
        />
        <SummaryCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Vendas"
          value={formatBRL(totalVendas)}
          variant="income"
        />
        <SummaryCard
          icon={<Wallet className="h-5 w-5" />}
          label="Saldo"
          value={formatBRL(saldo)}
          variant={saldo >= 0 ? "income" : "expense"}
        />
      </div>

      {/* Resumo por cultura */}
      {resumoCulturas.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            Resumo por Cultura
          </h2>
          <div className="space-y-2">
            {resumoCulturas.map((r) => (
              <div key={r.nome} className="rounded-lg bg-card border border-border p-4">
                <div className="font-semibold mb-2">{r.nome}</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Despesas</span>
                    <div className="font-medium text-expense">{formatBRL(r.despesas)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vendas</span>
                    <div className="font-medium text-income">{formatBRL(r.vendas)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Saldo</span>
                    <div className={`font-medium ${r.saldo >= 0 ? "text-income" : "text-expense"}`}>
                      {formatBRL(r.saldo)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {despesas.length === 0 && vendas.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Wallet className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Nenhum registro ainda</p>
          <p className="text-sm mt-1">Cadastre culturas, despesas e vendas para ver o resumo aqui.</p>
        </div>
      )}
    </Layout>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant: "income" | "expense";
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${
        variant === "income" ? "bg-success/10 text-income" : "bg-destructive/10 text-expense"
      }`}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}
