import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";
import Entrar from "../pages/Entrar.jsx";
import Cadastro from "../pages/Cadastro_inical.jsx";
import Cadastro_resto from "../pages/Cadastro.jsx";
import ChatPage from "../pages/chat/ChatPage.jsx";
import Historia from "../pages/Historia.jsx";

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
        <Route path="/historia" element={<Historia /> } />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;