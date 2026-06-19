import React, { useReducer } from "react";

import "../styles/Entrar.css";

import { Navbar } from "../components/Navbar.jsx";

import AppSnackbar from "../components/AppSnackbar.jsx";

import userService from "../api/userService";

import { useNavigate } from "react-router-dom";

function Entrar() {
	const navigate = useNavigate();

	const initialState = {
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

					message: "Login realizado com sucesso!",

					severity: "success",
				};

			case "error":
				return {
					...state,

					open: true,

					title: "Erro",

					message: action.message || "Erro ao realizar login",

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

		if (!state.email || !state.senha) {
			dispatch({
				type: "error",
				message: "Preencha todos os campos",
			});
			return;
		}

		try {
			const response = await userService.login({
				email: state.email,
				senha: state.senha,
			});

			if (response.status === 200) {
				const token = response.data.token;
				const userId = response.data.userId;
				
				localStorage.setItem("token", token);
				localStorage.setItem("userId", userId);

				const payloadBase64 = token.split('.')[1];
				const payloadDecoded = JSON.parse(atob(payloadBase64));

				if (payloadDecoded.role === "ROLE_ADMIN") {
					navigate("/admin/logs");
				} else {
					navigate("/acompanhamento");
				}
				
				window.location.reload();
			}
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
					<h1>Entrar</h1>

					<input
						type="email"
						name="email"
						placeholder="E-mail"
						value={state.email}
						onChange={handleChange}
					/>

					<input
						type="password"
						name="senha"
						placeholder="Senha"
						value={state.senha}
						onChange={handleChange}
					/>

					<button type="submit">Entrar</button>
				</form>
			</div>
		</>
	);
}

export default Entrar;
