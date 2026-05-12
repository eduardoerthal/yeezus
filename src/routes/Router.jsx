import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";
import Entrar from "../pages/Entrar.jsx";
import Cadastro from "../pages/Cadastro_inical.jsx";
import Cadastro_resto from "../pages/Cadastro.jsx";
import ChatPage from "../pages/chat/ChatPage.jsx";
import Sobre from "../pages/Sobre.jsx";
import Relatorios from "../pages/Relatorios.jsx";
import Planejamento from "../pages/Planejamento.jsx";
import PrivateRoute from "./PrivateRoute.jsx";


function Router() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro_resto" element={<Cadastro_resto />} />
        <Route path="/cadastre_aqui" element={<Cadastro />} />
        <Route path="/yeBOT" element={ <ChatPage />} />
        <Route path="/sobre" element={<Sobre /> } />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/planejamento" element={<Planejamento />} />
        {/* Privadas */}
        <Route
          path="/yeBOT"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/sobre"
          element={
            <PrivateRoute>
              <Sobre />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default Router;