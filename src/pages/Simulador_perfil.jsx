import React, { useState } from "react";
import "../styles/Simulador_perfil.css";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

function Simulador_perfil() {
	const [perfilSelecionado, setPerfilSelecionado] = useState("");

	return (
		<>
			<Navbar />

			<section className="perfil">
				<div className="perfil__overlay">
					<div className="perfil__container">

						<div className="perfil__steps">
							<div className="perfil-step perfil-step--done">
								<span>1</span>
								<p>Objetivo</p>
							</div>

							<div className="perfil-step__line perfil-step__line--active" />

							<div className="perfil-step perfil-step--active">
								<span>2</span>
								<p>Perfil</p>
							</div>

							<div className="perfil-step__line" />

							<div className="perfil-step">
								<span>3</span>
								<p>Resultado</p>
							</div>
						</div>

						<h1>
							Precisamos conhecer um pouco mais sobre o seu perfil
						</h1>

						<p className="perfil__description">
							Existem diversos tipos de investimentos. Alguns são
							mais seguros e oferecem retornos mais estáveis.
							Outros podem apresentar oscilações maiores, mas
							também possuem potencial de rentabilidade superior.
						</p>

						<h2>
							O que você prioriza ao investir?
						</h2>

						<div className="perfil__grid">
							<button
								type="button"
								className={`perfil__option ${
									perfilSelecionado === "conservador"
										? "selected"
										: ""
								}`}
								onClick={() =>
									setPerfilSelecionado("conservador")
								}
							>
								Busco primeiro segurança, não quero perder
								dinheiro.
							</button>

							<button
								type="button"
								className={`perfil__option ${
									perfilSelecionado === "moderado"
										? "selected"
										: ""
								}`}
								onClick={() =>
									setPerfilSelecionado("moderado")
								}
							>
								Tolero pequenas oscilações, mas nada que
								arrisque meu patrimônio.
							</button>

							<button
								type="button"
								className={`perfil__option ${
									perfilSelecionado === "arrojado"
										? "selected"
										: ""
								}`}
								onClick={() =>
									setPerfilSelecionado("arrojado")
								}
							>
								Aceito algumas perdas em busca de ganhos
								maiores no longo prazo.
							</button>

							<button
								type="button"
								className={`perfil__option ${
									perfilSelecionado === "agressivo"
										? "selected"
										: ""
								}`}
								onClick={() =>
									setPerfilSelecionado("agressivo")
								}
							>
								Busco a maior rentabilidade possível,
								assumindo riscos elevados.
							</button>
						</div>

                    <Link
                        to="/Simulador_resultado"
                        className="resultado"
                        >
                            Resultado
                        </Link>

					</div>
				</div>
			</section>
		</>
	);
}

export default Simulador_perfil;