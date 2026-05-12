import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";
import Entrar from "../pages/Entrar.jsx";
import Cadastro from "../pages/Cadastro_inical.jsx";
import Cadastro_resto from "../pages/Cadastro.jsx";
import ChatPage from "../pages/chat/ChatPage.jsx";
import Sobre from "../pages/Sobre.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Metas from "../pages/Metas.jsx";
import MetaForm from "../pages/MetaForm.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Inicio />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro_resto" element={<Cadastro_resto />} />
        <Route path="/cadastre_aqui" element={<Cadastro />} />
        <Route path="/yeBOT" element={ <ChatPage />} />
        <Route path="/sobre" element={<Sobre /> } />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/metas" element={<Metas />} />
        <Route path="/metas/nova" element={<MetaForm />} />
        <Route path="/metas/:id/editar" element={<MetaForm />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;