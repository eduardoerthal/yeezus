import React, { useState } from "react";
import "../styles/Simulador_resultado.css";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";

function formatCPF(value) {
	return value
		.replace(/\D/g, "")
		.slice(0, 11)
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatTel(value) {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	if (digits.length <= 10) {
		return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
	}
	return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function Simulador_resultado() {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [cpf, setCpf] = useState("");
	const [telefone, setTelefone] = useState("");
	const [aceito, setAceito] = useState(false);

	const isValid =
		nome.trim() && email.trim() && cpf.trim() && telefone.trim() && aceito;

	function handleCPF(e) {
		setCpf(formatCPF(e.target.value));
	}

	function handleTel(e) {
		setTelefone(formatTel(e.target.value));
	}

	return (
		<>
			<Navbar />

			<section className="dados">
				<div className="dados__overlay">
					<div className="dados__container">

						<div className="dados__steps">
							<div className="dados-step dados-step--done">
								<span>1</span>
								<p>Objetivo</p>
							</div>

							<div className="dados-step__line dados-step__line--active" />

							<div className="dados-step dados-step--done">
								<span>2</span>
								<p>Perfil</p>
							</div>

							<div className="dados-step__line dados-step__line--active" />

							<div className="dados-step dados-step--active">
								<span>3</span>
								<p>Resultado</p>
							</div>
						</div>

						<h1>
							Já estamos analisando suas informações!
						</h1>

						<p className="dados__description">
							Para visualizar o resultado da sua simulação,
							precisamos que você preencha seus dados:
						</p>

						<div className="dados__form">
							<input
								className="dados__field"
								type="text"
								placeholder="Nome"
								value={nome}
								onChange={(e) => setNome(e.target.value)}
							/>

							<input
								className="dados__field"
								type="email"
								placeholder="E-mail de contato"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<input
								className="dados__field"
								type="text"
								placeholder="CPF para personalizar sua experiência"
								value={cpf}
								onChange={handleCPF}
								maxLength={14}
							/>

							<input
								className="dados__field"
								type="tel"
								placeholder="Número do seu celular com DDD"
								value={telefone}
								onChange={handleTel}
								maxLength={15}
							/>

							<div className="dados__check-row">
								<button
									type="button"
									className={`dados__check-box ${aceito ? "dados__check-box--checked" : ""}`}
									onClick={() => setAceito(!aceito)}
									aria-checked={aceito}
									role="checkbox"
								/>
								<span className="dados__check-label">
									Ao aceitar, você autoriza a XP a coletar seus dados
									pessoais de acordo com a nossa{" "}
									<a href="/politica-de-privacidade" className="dados__check-link">
										Política de Privacidade.
									</a>
								</span>
							</div>

							{isValid ? (
								<Link to="/Simulador_resultado" className="resultado">
									Ver Resultado
								</Link>
							) : (
								<button
									type="button"
									className="resultado resultado--disabled"
									disabled
								>
									Ver Resultado
								</button>
							)}
						</div>

					</div>
				</div>
			</section>
		</>
	);
}

export default Simulador_resultado;
