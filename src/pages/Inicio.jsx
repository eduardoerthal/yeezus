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
				<div className="hero-ye__container">
					<div className="hero-ye__content">
						<div className="hero-ye__header">
							<span className="hero-ye__badge">
								PLATAFORMA FINANCEIRA PREMIUM
							</span>

							<h1 className="hero-ye__title">Yeezus</h1>

							<p className="hero-ye__description">
								Onde sua vida financeira atinge o impossível.
								Invista, acompanhe e evolua com uma experiência
								moderna, elegante e criada para quem pensa no
								longo prazo.
							</p>

							<div className="hero-ye__actions">
								{!token && (
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
								)}

								{token && (
									<>
										<Link
											className="cadastre_aqui"
											to="/sobre"
										>
											Explorar Plataforma
										</Link>
									</>
								)}
							</div>
						</div>

						<div className="hero-ye__footer-links">
							<Link className="card-link" to="/sobre">
								<div className="card-link__wrapper">
									<div className="card-link__text">
										<strong>CONSULTORIA YE</strong>

										<p>
											Planejamento financeiro exclusivo
											com visão de longo prazo para quem
											quer construir patrimônio de
											verdade.
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
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default Inicio;
