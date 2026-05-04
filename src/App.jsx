import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/crm/Clientes';
import { Orcamentos } from './pages/crm/Orcamentos';
import { Fechamentos } from './pages/crm/Fechamentos';
import { Calendario } from './pages/calendario/Calendario';
import { ControleAluguel } from './pages/aluguel/ControleAluguel';
import { Financeiro } from './pages/financeiro/Financeiro';
import { Equipe } from './pages/equipe/Equipe';
import { Extras } from './pages/extras/Extras';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crm/clientes" element={<Clientes />} />
        <Route path="/crm/orcamentos" element={<Orcamentos />} />
        <Route path="/crm/fechamentos" element={<Fechamentos />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/aluguel" element={<ControleAluguel />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/extras" element={<Extras />} />
      </Routes>
    </Router>
  );
}
