import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";
import Entrar from "../pages/Entrar.jsx";
import Cadastro from "../pages/Cadastro_inical.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Inicio />} />
        <Route path="/entrar" element={<Entrar />} />
        <Route path="/cadastro" element={<Cadastro />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Router;