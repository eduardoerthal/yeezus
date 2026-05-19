import React, { useReducer } from "react";

import "../styles/Cadastro.css";

import Navbar from "../components/Navbar";

import AppSnackbar from "../components/AppSnackbar.jsx";

import userService from "../api/userService";

import { useLocation, useNavigate } from "react-router-dom";

function Cadastro_resto() {
	const navigate = useNavigate();

	const location = useLocation();

	const initialState = {
		nome: location.state?.nome || "",

		email: "",

		senha: "",

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

			case "success":
				return {
					...state,

					open: true,

					title: "Sucesso",

					message: "Usuário cadastrado com sucesso!",

					severity: "success",
				};

			case "error":
				return {
					...state,

					open: true,

					title: "Erro",

					message: action.message || "Erro ao cadastrar usuário",

					severity: "error",
				};

			default:
				return state;
		}
	}

	const [state, dispatch] = useReducer(reducer, initialState);

	const handleChange = (e) => {
		const { name, value } = e.target;

		dispatch({
			type: "update",
			data: {
				[name]: value,
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

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!state.nome || !state.email || !state.senha) {
			dispatch({
				type: "error",
				message: "Preencha todos os campos",
			});

			return;
		}

		try {
			await userService.createUser({
				nome: state.nome,
				email: state.email,
				senha: state.senha,
			});

			dispatch({
				type: "success",
			});

			dispatch({
				type: "update",
				data: {
					nome: "",
					email: "",
					senha: "",
				},
			});

			setTimeout(() => {
				navigate("/entrar");
			}, 1800);
		} catch (error) {
			dispatch({
				type: "error",

				message: error.response?.data || "Erro interno do servidor",
			});

			console.error(error);
		}
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
				<form className="form" onSubmit={handleSubmit}>
					<h1>Vamos continuar seu cadastro!</h1>

					<p>Preencha os campos abaixo</p>

					<input
						className="campo"
						type="text"
						name="nome"
						placeholder="Nome"
						value={state.nome}
						onChange={handleChange}
					/>

					<input
						className="campo"
						type="email"
						name="email"
						placeholder="E-mail"
						value={state.email}
						onChange={handleChange}
					/>

					<input
						className="campo"
						type="password"
						name="senha"
						placeholder="Senha"
						value={state.senha}
						onChange={handleChange}
					/>

					<button className="botao" type="submit">
						Cadastrar
					</button>
				</form>
			</div>
		</>
	);
}

export default Cadastro_resto;
