
import React, { useEffect, useReducer, useState } from "react";

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
	CircularProgress,
} from "@mui/material";

import { Add, Delete, Edit, Save } from "@mui/icons-material";

import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/Navbar";

import acompanhamentoService from "../api/acompanhamentoService";

import "../styles/Acompanhamento.css";

const MotionPaper = motion(Paper);

const initialState = {
	tab: 0,

	receitas: [],
	despesas: [],
	investimentos: [],

	categorias: [],

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

				filters: {
					search: "",
					category: null,
				},

				form: {
					title: "",
					value: "",
					category: null,
				},

				editingId: null,
			};

		case "SET_DATA":
			return {
				...state,
				[action.key]: action.payload,
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

		case "START_EDIT":
			return {
				...state,

				editingId: action.item.id,

				form: {
					title: action.item.titulo,
					value: formatCurrency(action.item.valor.toString()),
					category: action.item.categoria,
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

	const [loading, setLoading] = useState(false);

	const [openModal, setOpenModal] = useState(false);

	const tabs = [
		{
			label: "Receita",
			color: "#2196f3",
			key: "receitas",
			api: "receita",
			tipo: "RECEITA",
		},

		{
			label: "Despesa",
			color: "#ff3b3b",
			key: "despesas",
			api: "despesa",
			tipo: "DESPESA",
		},

		{
			label: "Investido",
			color: "#ffc107",
			key: "investimentos",
			api: "investimento",
			tipo: "INVESTIMENTO",
		},
	];

	const currentTab = tabs[state.tab];

	const currentCategories = state.categorias.filter(
		(category) => category.tipo === currentTab.tipo,
	);

	const loadData = async () => {
		try {
			setLoading(true);

			const [
				receitas,
				despesas,
				investimentos,
				categorias,
			] = await Promise.all([
				acompanhamentoService.getReceitas(),
				acompanhamentoService.getDespesas(),
				acompanhamentoService.getInvestimentos(),
				acompanhamentoService.getCategorias(),
			]);

			dispatch({
				type: "SET_DATA",
				key: "receitas",
				payload: receitas.data,
			});

			dispatch({
				type: "SET_DATA",
				key: "despesas",
				payload: despesas.data,
			});

			dispatch({
				type: "SET_DATA",
				key: "investimentos",
				payload: investimentos.data,
			});

			dispatch({
				type: "SET_DATA",
				key: "categorias",
				payload: categorias.data,
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const total = state[currentTab.key].reduce(
		(acc, item) => acc + item.valor,
		0,
	);

	const filteredItems = state[currentTab.key].filter((item) => {
		const search = state.filters.search.toLowerCase();

		const matchesSearch = item.titulo
			.toLowerCase()
			.includes(search);

		const matchesCategory =
			!state.filters.category ||
			item.categoria.id === state.filters.category.id;

		return matchesSearch && matchesCategory;
	});

	const handleSubmit = async () => {
		try {
			if (
				!state.form.title ||
				!state.form.value ||
				!state.form.category
			) {
				return;
			}

			const payload = {
				titulo: state.form.title,

				valor: parseCurrency(state.form.value),

				categoriaId: state.form.category.id,
			};

			if (state.editingId) {
				await acompanhamentoService.update(
					currentTab.api,
					state.editingId,
					payload,
				);
			} else {
				await acompanhamentoService.create(
					currentTab.api,
					payload,
				);
			}

			dispatch({
				type: "CANCEL_EDIT",
			});

			setOpenModal(false);

			await loadData();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (id) => {
		try {
			await acompanhamentoService.delete(
				currentTab.api,
				id,
			);

			await loadData();
		} catch (error) {
			console.error(error);
		}
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
							options={currentCategories}
							getOptionLabel={(option) => option.nome}
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
							{loading ? (
								<div className="planejamento__loading">
									<CircularProgress />
								</div>
							) : (
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
													{item.categoria.nome}
												</span>

												<strong>
													{item.titulo}
												</strong>
											</div>

											<div className="planejamento__itemRight">
												<strong
													style={{
														color: currentTab.color,
													}}
												>
													{item.valor.toLocaleString(
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
															openEditModal(
																item,
															)
														}
													>
														<Edit fontSize="small" />
													</IconButton>

													<IconButton
														onClick={() =>
															handleDelete(
																item.id,
															)
														}
													>
														<Delete fontSize="small" />
													</IconButton>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							)}
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
								options={currentCategories}
								getOptionLabel={(option) => option.nome}
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
									<TextField
										{...params}
										label="Categoria"
									/>
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
										value: formatCurrency(
											e.target.value,
										),
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
								startIcon={
									state.editingId ? <Save /> : <Add />
								}
								sx={{
									background: currentTab.color,
									color: "#fff",
								}}
							>
								{state.editingId
									? "Salvar"
									: "Adicionar"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

export default Acompanhamento;
