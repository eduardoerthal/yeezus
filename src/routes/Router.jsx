import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";

import Entrar from "../pages/Entrar.jsx";

import Cadastro from "../pages/Cadastro_inical.jsx";

import Cadastro_resto from "../pages/Cadastro.jsx";

import ChatPage from "../pages/chat/ChatPage.jsx";

import Sobre from "../pages/Sobre.jsx";

import Planejamento from "../pages/Planejamento.jsx";

import Relatorios from "../pages/Relatorios.jsx";

import Simulador_invest from "../pages/Simulador_invest.jsx";

import Simulador_resultado from "../pages/Simulador_resultado.jsx";

import PrivateRoute from "./PrivateRoute.jsx";
import Acompanhamento from "../pages/Acompanhamento.jsx";
import Simulador_perfil from "../pages/Simulador_perfil.jsx";

function Router() {
  return (
    <BrowserRouter>

		<Routes>
			{/* Públicas */}
			<Route path="/" element={<Inicio />} />
			<Route path="/entrar" element={<Entrar />} />
			<Route path="/cadastro" element={<Cadastro />} />
			<Route path="/cadastro_resto" element={<Cadastro_resto />} />

			<Route path="simulador_invest" element={<Simulador_invest />} />

			<Route path="simulador_perfil" element={<Simulador_perfil />} />

			<Route path="/simulador_resultado" element={<Simulador_resultado />} />
			{/* Privadas */}
			<Route
				path="/YeBOT"
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
			<Route
				path="/acompanhamento"
				element={
					<PrivateRoute>
						<Acompanhamento />
					</PrivateRoute>
				}
			/>
				<Route
					path="/planejamento"
					element={
						<PrivateRoute>
							<Planejamento />
						</PrivateRoute>
					}
				/>

				<Route
					path="/relatorios"
					element={
						<PrivateRoute>
							<Relatorios />
						</PrivateRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
					);
}

export default Router;
