import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Sprout, Download, Settings, Leaf } from "lucide-react";

/** "Mais" page – mobile catch-all for items not in bottom nav */
export default function Mais() {
  const items = [
    { to: "/safras", icon: Sprout, label: "Safras", desc: "Gerencie períodos de plantio" },
    { to: "/exportar", icon: Download, label: "Exportar / Backup", desc: "CSV e backup dos dados" },
    { to: "/configuracoes", icon: Settings, label: "Configurações", desc: "Dados da propriedade" },
  ];

  return (
    <Layout title="Mais">
      <div className="space-y-3">
        {items.map(({ to, icon: Icon, label, desc }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-4 rounded-xl bg-card border border-border p-4 active:scale-[0.98] transition-transform"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{label}</div>
              <div className="text-sm text-muted-foreground">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
