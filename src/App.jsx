import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
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
        <Route path="/" element={<Layout title="Dashboard"><Dashboard /></Layout>} />
        <Route path="/crm/clientes" element={<Layout title="Clientes"><Clientes /></Layout>} />
        <Route path="/crm/orcamentos" element={<Layout title="Orçamentos"><Orcamentos /></Layout>} />
        <Route path="/crm/fechamentos" element={<Layout title="Fechamentos"><Fechamentos /></Layout>} />
        <Route path="/calendario" element={<Layout title="Calendário"><Calendario /></Layout>} />
        <Route path="/aluguel" element={<Layout title="Controle de Aluguel"><ControleAluguel /></Layout>} />
        <Route path="/financeiro" element={<Layout title="Financeiro"><Financeiro /></Layout>} />
        <Route path="/equipe" element={<Layout title="Equipe"><Equipe /></Layout>} />
        <Route path="/extras" element={<Layout title="Extras"><Extras /></Layout>} />
      </Routes>
    </Router>
  );
}
