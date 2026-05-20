import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";

import Entrar from "../pages/Entrar.jsx";

import Cadastro from "../pages/Cadastro_inical.jsx";

import Cadastro_resto from "../pages/Cadastro.jsx";

import ChatPage from "../pages/chat/ChatPage.jsx";

import Sobre from "../pages/Sobre.jsx";

import Planejamento from "../pages/Planejamento.jsx";

import Relatorios from "../pages/Relatorios.jsx";

// import Empresa from "../pages/sobre/Empresa.jsx";

// import Historia from "../pages/sobre/Historia.jsx";

// import Equipe from "../pages/sobre/Equipe.jsx";

// import Compliance from "../pages/sobre/Compliance.jsx";

// import Educacao from "../pages/sobre/Educacao.jsx";

// import Escritorio from "../pages/sobre/Escritorio.jsx";

// import Assessor from "../pages/sobre/Assessor.jsx";

// import Consultor from "../pages/sobre/Consultor.jsx";

// import Fornecedor from "../pages/sobre/Fornecedor.jsx";

// import Support from "../pages/Support.jsx";

import PrivateRoute from "./PrivateRoute.jsx";
import Acompanhamento from "../pages/Acompanhamento.jsx";

function Router() {
	return (
		<BrowserRouter>
			<Routes>
				{/* PÚBLICAS */}

				<Route path="/" element={<Inicio />} />

				<Route path="/entrar" element={<Entrar />} />

				<Route path="/cadastro" element={<Cadastro />} />

				<Route path="/cadastro_resto" element={<Cadastro_resto />} />

				<Route path="/cadastre_aqui" element={<Cadastro />} />

				{/* PRIVADAS */}

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

				{/* <Route
					path="/support"
					element={
						<PrivateRoute>
							<Support />
						</PrivateRoute>
					}
				/> */}

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
                <Route
					path="/acompanhamento"
					element={
						<PrivateRoute>
							<Acompanhamento />
						</PrivateRoute>
					}
				/>

				{/* SUBPÁGINAS SOBRE */}

				{/* <Route
					path="/sobre/empresa"
					element={
						<PrivateRoute>
							<Empresa />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/historia"
					element={
						<PrivateRoute>
							<Historia />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/equipe"
					element={
						<PrivateRoute>
							<Equipe />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/compliance"
					element={
						<PrivateRoute>
							<Compliance />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/educacao"
					element={
						<PrivateRoute>
							<Educacao />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/escritorio"
					element={
						<PrivateRoute>
							<Escritorio />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/assessor"
					element={
						<PrivateRoute>
							<Assessor />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/consultor"
					element={
						<PrivateRoute>
							<Consultor />
						</PrivateRoute>
					}
				/>

				<Route
					path="/sobre/fornecedor"
					element={
						<PrivateRoute>
							<Fornecedor />
						</PrivateRoute>
					}
				/> */}
			</Routes>
		</BrowserRouter>
	);
}

export default Router;
