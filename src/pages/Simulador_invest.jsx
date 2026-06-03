import React from "react";
import "../styles/Simulador_invest.css";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

function Simulador_invest() {
	return (
		<>
			<Navbar />

			<section className="simulador">
				<div className="simulador__container">
					<div className="simulador__steps">
						<div className="step step--active">
							<span>1</span>
							<p>Objetivo</p>
						</div>

						<div className="step__line" />

						<div className="step">
							<span>2</span>
							<p>Perfil</p>
						</div>

						<div className="step__line" />

						<div className="step">
							<span>3</span>
							<p>Resultado</p>
						</div>
					</div>

					<div className="simulador__card">
						<span className="simulador__tag">
							ETAPA 1
						</span>

						<h1>
							Qual é o seu objetivo financeiro?
						</h1>

						<p>
							Informe o valor que deseja alcançar e em quanto
							tempo pretende atingir sua meta. Com essas
							informações, encontraremos os investimentos mais
							adequados para o seu perfil.
						</p>

						<div className="simulador__form">
							<input
								type="number"
								placeholder="Valor desejado"
							/>

							<input
								type="number"
								placeholder="Prazo em meses"
							/>

                            <Link
                            to="/Simulador_perfil"
                            className="continuar"
                            >
                                Continuar
                            </Link>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default Simulador_invest;