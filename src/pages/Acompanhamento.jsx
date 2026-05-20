import React, { useReducer, useState } from "react";

import {
	Button,
	TextField,
	Typography,
	Paper,
	Tabs,
	Tab,
	Autocomplete,
	IconButton,
	Dialog,
	DialogContent,
	DialogTitle,
} from "@mui/material";

import { Add, Delete, Edit, Save } from "@mui/icons-material";

import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";

import "../styles/Acompanhamento.css";

const MotionPaper = motion(Paper);

const receitaCategorias = [
	{ id: 1, name: "Salário" },
	{ id: 2, name: "Freelance" },
	{ id: 3, name: "Dividendos" },
	{ id: 4, name: "Presente" },
	{ id: 5, name: "Cashback" },
	{ id: 6, name: "Comissão" },
	{ id: 7, name: "Aluguel Recebido" },
	{ id: 8, name: "Venda" },
];

const despesaCategorias = [
	{ id: 1, name: "Moradia" },
	{ id: 2, name: "Lazer" },
	{ id: 3, name: "Transporte" },
	{ id: 4, name: "Saúde" },
	{ id: 5, name: "Mercado" },
	{ id: 6, name: "Streaming" },
	{ id: 7, name: "Restaurante" },
	{ id: 8, name: "Educação" },
];

const investimentoCategorias = [
	{ id: 1, name: "Tesouro Direto" },
	{ id: 2, name: "Ações" },
	{ id: 3, name: "ETF" },
	{ id: 4, name: "Crypto" },
	{ id: 5, name: "CDB" },
	{ id: 6, name: "LCI/LCA" },
	{ id: 7, name: "Fundos" },
	{ id: 8, name: "Reserva de Emergência" },
];

const initialState = {
	tab: 0,

	receitas: [],
	despesas: [],
	investimentos: [],

	form: {
		title: "",
		value: "",
		category: null,
	},

	filters: {
		search: "",
		category: null,
	},

	editingId: null,
};

function formatCurrency(value) {
	const number = Number(value.replace(/\D/g, "")) / 100;

	return number.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL",
	});
}

function parseCurrency(value) {
	return Number(
		value
			.replace(/\./g, "")
			.replace(",", ".")
			.replace(/[^\d.-]/g, ""),
	);
}

function reducer(state, action) {
	switch (action.type) {
		case "SET_TAB":
			return {
				...state,
				tab: action.payload,

				form: {
					title: "",
					value: "",
					category: null,
				},

				filters: {
					search: "",
					category: null,
				},

				editingId: null,
			};

		case "UPDATE_FORM":
			return {
				...state,
				form: {
					...state.form,
					...action.payload,
				},
			};

		case "UPDATE_FILTERS":
			return {
				...state,
				filters: {
					...state.filters,
					...action.payload,
				},
			};

		case "ADD_ITEM":
			return {
				...state,

				[action.section]: [...state[action.section], action.payload],

				form: {
					title: "",
					value: "",
					category: null,
				},
			};

		case "DELETE_ITEM":
			return {
				...state,

				[action.section]: state[action.section].filter(
					(item) => item.id !== action.id,
				),
			};

		case "START_EDIT":
			return {
				...state,

				editingId: action.item.id,

				form: {
					title: action.item.title,
					value: formatCurrency(action.item.value.toString()),
					category: action.item.category,
				},
			};

		case "SAVE_EDIT":
			return {
				...state,

				[action.section]: state[action.section].map((item) =>
					item.id === action.id ? action.payload : item,
				),

				editingId: null,

				form: {
					title: "",
					value: "",
					category: null,
				},
			};

		case "CANCEL_EDIT":
			return {
				...state,

				editingId: null,

				form: {
					title: "",
					value: "",
					category: null,
				},
			};

		default:
			return state;
	}
}

function Acompanhamento() {
	const [state, dispatch] = useReducer(reducer, initialState);

	const [openModal, setOpenModal] = useState(false);

	const tabs = [
		{
			label: "Receita",
			color: "#2196f3",
			key: "receitas",
			categories: receitaCategorias,
		},

		{
			label: "Despesa",
			color: "#ff3b3b",
			key: "despesas",
			categories: despesaCategorias,
		},

		{
			label: "Investido",
			color: "#ffc107",
			key: "investimentos",
			categories: investimentoCategorias,
		},
	];

	const currentTab = tabs[state.tab];

	const total = state[currentTab.key].reduce(
		(acc, item) => acc + item.value,
		0,
	);

	const filteredItems = state[currentTab.key].filter((item) => {
		const search = state.filters.search.toLowerCase();

		const matchesSearch = item.title.toLowerCase().includes(search);

		const matchesCategory =
			!state.filters.category ||
			item.category.id === state.filters.category.id;

		return matchesSearch && matchesCategory;
	});

	const handleSubmit = () => {
		if (!state.form.title || !state.form.value || !state.form.category) {
			return;
		}

		const item = {
			id: state.editingId || Date.now(),

			title: state.form.title,

			value: parseCurrency(state.form.value),

			category: state.form.category,
		};

		if (state.editingId) {
			dispatch({
				type: "SAVE_EDIT",
				section: currentTab.key,
				id: state.editingId,
				payload: item,
			});

			setOpenModal(false);

			return;
		}

		dispatch({
			type: "ADD_ITEM",
			section: currentTab.key,
			payload: item,
		});

		setOpenModal(false);
	};

	const openEditModal = (item) => {
		dispatch({
			type: "START_EDIT",
			item,
		});

		setOpenModal(true);
	};

	return (
		<>
			<Navbar />

			<section className="planejamento">
				<div className="planejamento__container">
					<div className="planejamento__header">
						<div>
							<Typography className="planejamento__title">
								Acompanhamento Financeiro
							</Typography>

							<Typography className="planejamento__subtitle">
								Controle simples e visual das suas finanças.
							</Typography>
						</div>

						<Paper
							className="planejamento__total"
							sx={{
								borderColor: currentTab.color,
							}}
						>
							<span>Total Atual</span>

							<strong
								style={{
									color: currentTab.color,
								}}
							>
								{total.toLocaleString("pt-BR", {
									style: "currency",
									currency: "BRL",
								})}
							</strong>
						</Paper>
					</div>

					<div className="planejamento__topbar">
						<Button
							className="planejamento__floatingButton"
							onClick={() => {
								dispatch({
									type: "CANCEL_EDIT",
								});

								setOpenModal(true);
							}}
						>
							<Add />
						</Button>

						<Paper className="planejamento__tabs">
							<Tabs
								value={state.tab}
								onChange={(_, value) =>
									dispatch({
										type: "SET_TAB",
										payload: value,
									})
								}
								textColor="inherit"
								variant="fullWidth"
							>
								{tabs.map((tab) => (
									<Tab
										key={tab.key}
										label={tab.label}
										sx={{
											"&.Mui-selected": {
												background: `${tab.color}22`,
												color: "#fff",
											},
										}}
									/>
								))}
							</Tabs>
						</Paper>
					</div>

					<div className="planejamento__filters">
						<TextField
							placeholder="Pesquisar por nome..."
							fullWidth
							value={state.filters.search}
							onChange={(e) =>
								dispatch({
									type: "UPDATE_FILTERS",
									payload: {
										search: e.target.value,
									},
								})
							}
						/>

						<Autocomplete
							options={currentTab.categories}
							getOptionLabel={(option) => option.name}
							value={state.filters.category}
							onChange={(_, value) =>
								dispatch({
									type: "UPDATE_FILTERS",
									payload: {
										category: value,
									},
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Categoria"
								/>
							)}
						/>
					</div>

					<MotionPaper layout className="planejamento__card">
						<div className="planejamento__grid">
							<AnimatePresence>
								{filteredItems.map((item) => (
									<motion.div
										layout
										key={item.id}
										className={`planejamento__item planejamento__item--${currentTab.key}`}
										initial={{
											opacity: 0,
											y: 10,
										}}
										animate={{
											opacity: 1,
											y: 0,
										}}
										exit={{
											opacity: 0,
											scale: 0.95,
										}}
									>
										<div className="planejamento__itemInfo">
											<span className="planejamento__category">
												{item.category.name}
											</span>

											<strong>{item.title}</strong>
										</div>

										<div className="planejamento__itemRight">
											<strong
												style={{
													color: currentTab.color,
												}}
											>
												{item.value.toLocaleString(
													"pt-BR",
													{
														style: "currency",
														currency: "BRL",
													},
												)}
											</strong>

											<div className="planejamento__actions">
												<IconButton
													onClick={() =>
														openEditModal(item)
													}
												>
													<Edit fontSize="small" />
												</IconButton>

												<IconButton
													onClick={() =>
														dispatch({
															type: "DELETE_ITEM",
															section:
																currentTab.key,
															id: item.id,
														})
													}
												>
													<Delete fontSize="small" />
												</IconButton>
											</div>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					</MotionPaper>
				</div>
			</section>

			<Dialog
				open={openModal}
				onClose={() => setOpenModal(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle sx={{ paddingBottom: "6px" }}>
					{state.editingId
						? `Editar ${currentTab.label}`
						: `Novo ${currentTab.label}`}
				</DialogTitle>

				<DialogContent>
					<div className="planejamento__modalForm">
						<div className="planejamento__modalRow">
							<TextField
								label="Título"
								fullWidth
								value={state.form.title}
								onChange={(e) =>
									dispatch({
										type: "UPDATE_FORM",
										payload: {
											title: e.target.value,
										},
									})
								}
							/>

							<Autocomplete
								options={currentTab.categories}
								getOptionLabel={(option) => option.name}
								value={state.form.category}
								onChange={(_, value) =>
									dispatch({
										type: "UPDATE_FORM",
										payload: {
											category: value,
										},
									})
								}
								renderInput={(params) => (
									<TextField {...params} label="Categoria" />
								)}
							/>
						</div>

						<TextField
							label="Valor"
							value={state.form.value}
							onChange={(e) =>
								dispatch({
									type: "UPDATE_FORM",
									payload: {
										value: formatCurrency(e.target.value),
									},
								})
							}
						/>

						<div className="planejamento__modalActions">
							<Button
								onClick={() => {
									dispatch({
										type: "CANCEL_EDIT",
									});

									setOpenModal(false);
								}}
								variant="outlined"
								color="inherit"
							>
								Cancelar
							</Button>

							<Button
								onClick={handleSubmit}
								startIcon={state.editingId ? <Save /> : <Add />}
								sx={{
									background: currentTab.color,
									color: "#fff",
								}}
							>
								{state.editingId ? "Salvar" : "Adicionar"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default Acompanhamento;
