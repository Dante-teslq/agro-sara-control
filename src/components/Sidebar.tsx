import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Leaf, Sprout, DollarSign, ShoppingCart, Download, Settings } from "lucide-react";

const sideItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/culturas", icon: Leaf, label: "Culturas" },
  { to: "/safras", icon: Sprout, label: "Safras" },
  { to: "/despesas", icon: DollarSign, label: "Despesas" },
  { to: "/vendas", icon: ShoppingCart, label: "Vendas" },
  { to: "/exportar", icon: Download, label: "Exportar" },
  { to: "/configuracoes", icon: Settings, label: "Configurações" },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex md:w-56 lg:w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/icons/icon-192.png" alt="AgroGestão" className="h-9 w-9 rounded-lg" />
        <span className="text-lg font-bold tracking-tight">AgroGestão</span>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {sideItems.map(({ to, icon: Icon, label }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
