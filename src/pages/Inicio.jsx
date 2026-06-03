import React from "react";
import "../styles/Inicio.css";
import { Navbar } from "../components/Navbar.jsx";
import { Link, useNavigate } from "react-router-dom";

function Inicio() {
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/entrar");
	};

	return (
		<>
			<Navbar />

			<section className="hero-ye">
				<div className="hero-ye__container" data-testid="container">
					<div className="hero-ye__content">
						<div className="hero-ye__header">
							{token && (
								<button
									className="saiba_mais"
									onClick={handleLogout}
								>
									Sair
								</button>
							)}
						</div>

						<h1 className="hero-ye__title">Yeezus</h1>

						<p className="hero-ye__description">
							Onde sua vida financeira atinge o impossível
						</p>

						<div className="hero-ye__actions">
							{!token ? (
								<>
									<Link
										className="cadastre_aqui"
										to="/cadastro"
									>
										Abra sua Conta
									</Link>

									<Link
										className="saiba_mais"
										to="/entrar"
									>
										Entrar
									</Link>
								</>
							) : (
								<Link
									className="cadastre_aqui"
									to="/sobre"
								>
									Explorar Plataforma
								</Link>
							)}
						</div>
					</div>

					<div className="hero-ye__footer-links">
						<Link className="card-link" to="/sobre">
							<div className="card-link__wrapper">
								<div className="card-link__text">
									<strong>CONSULTORIA YE</strong>

									<p>
										Planejamento exclusivo com visão de
										longo prazo para ajudar você a alcançar
										seus objetivos financeiros.
									</p>
								</div>

								<button
									className="btn--inline"
									type="button"
								>
									Saiba mais →
								</button>
							</div>
						</Link>

						<Link
							className="card-link"
							to="/Simulador_invest"
						>
							<div className="card-link__wrapper">
								<div className="card-link__text">
									<strong>
										SIMULADOR DE INVESTIMENTOS
									</strong>

									<p>
										Confira os investimentos recomendados
										para alcançar seus objetivos
										financeiros.
									</p>
								</div>

								<button
									className="btn--inline"
									type="button"
								>
									Simular investimentos →
								</button>
							</div>
						</Link>
					</div>
				</div>
			</section>

			{/* SOBRE A PLATAFORMA */}
			<section className="home-section">
				<div className="home-section__container">
					<span className="home-section__tag">
						SOBRE A YEEZUS
					</span>

					<h2>
						Tudo o que você precisa para administrar sua vida
						financeira em um só lugar.
					</h2>

					<p>
						A Yeezus foi desenvolvida para simplificar o
						gerenciamento financeiro pessoal. Nossa plataforma
						permite acompanhar gastos, monitorar investimentos,
						organizar metas e tomar decisões com mais confiança.
					</p>
				</div>
			</section>

			{/* IA */}
			<section className="home-section home-section--dark">
				<div className="home-section__container">
					<span className="home-section__tag">
						INTELIGÊNCIA ARTIFICIAL
					</span>

					<h2>
						Um assistente financeiro disponível sempre que você
						precisar.
					</h2>

					<p>
						Utilize nosso chatbot para esclarecer dúvidas sobre
						investimentos, planejamento financeiro, educação
						financeira e estratégias para alcançar seus objetivos.
					</p>
				</div>
			</section>

			{/* RELATÓRIOS */}
			<section className="home-section">
				<div className="home-section__container">
					<span className="home-section__tag">
						RELATÓRIOS E ANÁLISES
					</span>

					<h2>
						Transforme informações em decisões mais inteligentes.
					</h2>

					<p>
						Acompanhe gráficos, indicadores e relatórios
						detalhados para entender seus hábitos financeiros e
						visualizar sua evolução ao longo do tempo.
					</p>
				</div>
			</section>

			{/* PLANEJAMENTO */}
			<section className="home-section home-section--dark">
				<div className="home-section__container">
					<span className="home-section__tag">
						PLANEJAMENTO FINANCEIRO
					</span>

					<h2>
						Construa objetivos claros para o seu futuro.
					</h2>

					<p>
						Crie metas financeiras, acompanhe seu progresso e
						mantenha o foco em resultados de longo prazo através
						de ferramentas de planejamento intuitivas.
					</p>
				</div>
			</section>
		</>
	);
}

export default Inicio;