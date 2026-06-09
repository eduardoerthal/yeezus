import React, { useReducer } from "react";

import "../styles/Cadastro.css";

import { Navbar } from "../components/Navbar.jsx";

import { useNavigate } from "react-router-dom";

import AppSnackbar from "../components/AppSnackbar.jsx";

function Cadastro() {
	const navigate = useNavigate();

	const initialState = {
		nome: "",

		open: false,

		message: "",

		severity: "success",

		title: "",
	};

	function reducer(state, action) {
		switch (action.type) {
			case "update":
				return {
					...state,
					...action.data,
				};

			case "error":
				return {
					...state,

					open: true,

					title: "Erro",

					message: "O nome deve ter 3 letras ou mais",

					severity: "error",
				};

			default:
				return state;
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);

	const handleChange = (e) => {
		dispatch({
			type: "update",
			data: {
				nome: e.target.value,
			},
		});
	};

	const handleCloseSnackbar = () => {
		dispatch({
			type: "update",
			data: {
				open: false,
			},
		});
	};

	const handleNext = () => {
		if (state.nome.trim().length < 3) {
			dispatch({
				type: "error",
			});

			return;
		}

		navigate("/cadastro_resto", {
			state: {
				nome: state.nome,
			},
		});
	};

	return (
		<>
			<AppSnackbar
				open={state.open}
				onClose={handleCloseSnackbar}
				message={state.message}
				title={state.title}
				severity={state.severity}
				autoClose
			/>

			<Navbar />

			<div className="container">
				<div className="form">
					<h1>Boas vindas ao Ye!</h1>

					<p>Para começar, qual seu nome?</p>

					<input
						type="text"
						placeholder="Nome completo"
						value={state.nome}
						onChange={handleChange}
					/>

					<button className="cadastro" onClick={handleNext}>
						Continuar Cadastro
					</button>
				</div>
			</div>
		</>
	);
}

export default Cadastro;
