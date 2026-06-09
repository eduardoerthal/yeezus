import React, { useReducer } from "react";
import "../styles/Simulador_resultado.css";
import { Navbar } from "../components/Navbar";
import emailService from "../api/emailService";
import AppSnackbar from "../components/AppSnackbar";

// ===================== FORMATADORES =====================
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

// ===================== REDUCER =====================
const initialState = {
	nome: "",
	email: "",
	cpf: "",
	telefone: "",
	aceito: false,
	title: "",
	message: "",
	severity: "",
	open: false,
};

function reducer(state, action) {
	switch (action.type) {
		case "SET_FIELD":
			return { ...state, [action.field]: action.value };
		case "TOGGLE_ACEITO":
			return { ...state, aceito: !state.aceito };
		case "OPEN_SNACKBAR":
			return { ...state, open: true };
		case "CLOSE_SNACKBAR":
			return { ...state, open: false };
		case "SUCCESS":
			return {...state, title: "Sucesso", message: "Email enviado!", severity: "success"}
		case "ERROR":
			return {...state, title: "Erro", message: "Erro ao salvar", severity: "error"}
		case "RESET":
			return initialState;

		default:
			return state;
	}
}

// ===================== COMPONENTE =====================
function Simulador_resultado() {
	const [state, dispatch] = useReducer(reducer, initialState);

	const { nome, email, cpf, telefone, aceito, open } = state;

	const isValid =
		nome.trim() &&
		email.trim() &&
		cpf.trim() &&
		telefone.trim() &&
		aceito;

	function handleSubmit() {

		const request = {...state}

		emailService
			.sendEmail(request)
			.then(() => {
				dispatch({ type: "SUCCESS" });
				dispatch({ type: "OPEN_SNACKBAR" });
				dispatch({ type: "RESET" });
			})
			.catch(() => {
				dispatch({ type: "ERROR" });
				dispatch({ type: "OPEN_SNACKBAR" });
			});
	}

	return (
		<>
			<AppSnackbar
				open={open}
				onClose={() => dispatch({ type: "CLOSE_SNACKBAR" })}
				message={state.message}
				title={state.title}
				severity={state.severity}
				autoClose
			/>

			<Navbar />

			<section className="dados">
				<div className="dados__overlay">
					<div className="dados__container">

						<h1>Já estamos analisando suas informações!</h1>

						<p className="dados__description">
							Para visualizar o resultado da sua simulação,
							precisamos que você preencha seus dados:
						</p>

						<div className="dados__form">

							<input
								type="text"
								placeholder="Nome"
								value={nome}
								onChange={(e) =>
									dispatch({
										type: "SET_FIELD",
										field: "nome",
										value: e.target.value,
									})
								}
							/>

							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) =>
									dispatch({
										type: "SET_FIELD",
										field: "email",
										value: e.target.value,
									})
								}
							/>

							<input
								type="text"
								placeholder="CPF"
								value={cpf}
								onChange={(e) =>
									dispatch({
										type: "SET_FIELD",
										field: "cpf",
										value: formatCPF(e.target.value),
									})
								}
							/>

							<input
								type="tel"
								placeholder="Telefone"
								value={telefone}
								onChange={(e) =>
									dispatch({
										type: "SET_FIELD",
										field: "telefone",
										value: formatTel(e.target.value),
									})
								}
							/>

							<div className="dados__check-row">
								<button
									type="button"
									className={`dados__check-box ${
										aceito ? "dados__check-box--checked" : ""
									}`}
									onClick={() =>
										dispatch({ type: "TOGGLE_ACEITO" })
									}
								/>

								<span className="dados__check-label">
									Ao aceitar, você autoriza a YEEZUS a coletar seus dados
									pessoais de acordo com a nossa{" "}
									<a href="/politica-de-privacidade" className="dados__check-link">
										Política de Privacidade.
									</a>
								</span>
							</div>

							<button
								type="button"
								className="resultado"
								onClick={handleSubmit}
								disabled={!isValid}
							>
								Ver Resultado
							</button>

						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default Simulador_resultado;