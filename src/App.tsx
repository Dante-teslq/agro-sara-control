import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getPropriedade } from "@/db/database";
import Setup from "./pages/Setup";
import Dashboard from "./pages/Dashboard";
import Culturas from "./pages/Culturas";
import Safras from "./pages/Safras";
import Despesas from "./pages/Despesas";
import Vendas from "./pages/Vendas";
import Exportar from "./pages/Exportar";
import Configuracoes from "./pages/Configuracoes";
import Mais from "./pages/Mais";
import NotFound from "./pages/NotFound";

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [hasSetup, setHasSetup] = useState(false);

  useEffect(() => {
    getPropriedade().then((p) => {
      setHasSetup(!!p);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {!hasSetup ? (
            <>
              <Route path="/setup" element={<Setup />} />
              <Route path="*" element={<Navigate to="/setup" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/culturas" element={<Culturas />} />
              <Route path="/safras" element={<Safras />} />
              <Route path="/despesas" element={<Despesas />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/exportar" element={<Exportar />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/mais" element={<Mais />} />
              <Route path="/setup" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
