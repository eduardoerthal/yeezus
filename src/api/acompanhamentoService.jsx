import api from "./api";

const acompanhamentoService = {

	// =========================
	// RECEITAS
	// =========================

	getReceitas: async (userId) => {
		return await api.get(`/api/receita?userId=${userId}`);
	},

	createReceita: async (data) => {
		return await api.post("/api/receita", data);
	},

	updateReceita: async (id, data) => {
		return await api.put(`/api/receita/${id}`, data);
	},

	deleteReceita: async (id) => {
		return await api.delete(`/api/receita/${id}`);
	},

	// =========================
	// DESPESAS
	// =========================

	getDespesas: async (userId) => {
		return await api.get(`/api/despesa?userId=${userId}`);
	},

	createDespesa: async (data) => {
		return await api.post("/api/despesa", data);
	},

	updateDespesa: async (id, data) => {
		return await api.put(`/api/despesa/${id}`, data);
	},

	deleteDespesa: async (id) => {
		return await api.delete(`/api/despesa/${id}`);
	},

	// =========================
	// INVESTIMENTOS
	// =========================

	getInvestimentos: async (userId) => {
		return await api.get(`/api/investimento?userId=${userId}`);
	},

	createInvestimento: async (data) => {
		return await api.post("/api/investimento", data);
	},

	updateInvestimento: async (id, data) => {
		return await api.put(`/api/investimento/${id}`, data);
	},

	deleteInvestimento: async (id) => {
		return await api.delete(`/api/investimento/${id}`);
	},

	// =========================
	// CATEGORIAS
	// =========================

	getCategorias: async () => {
		return await api.get("/api/categoria");
	},

	// =========================
	// HELPERS
	// =========================

	create: async (type, data) => {

		switch (type) {

			case "receita":
				return await acompanhamentoService.createReceita(data);

			case "despesa":
				return await acompanhamentoService.createDespesa(data);

			case "investimento":
				return await acompanhamentoService.createInvestimento(data);

			default:
				throw new Error(`Tipo inválido: ${type}`);
		}
	},

	update: async (type, id, data) => {

		switch (type) {

			case "receita":
				return await acompanhamentoService.updateReceita(id, data);

			case "despesa":
				return await acompanhamentoService.updateDespesa(id, data);

			case "investimento":
				return await acompanhamentoService.updateInvestimento(id, data);

			default:
				throw new Error(`Tipo inválido: ${type}`);
		}
	},

	delete: async (type, id) => {

		switch (type) {

			case "receita":
				return await acompanhamentoService.deleteReceita(id);

			case "despesa":
				return await acompanhamentoService.deleteDespesa(id);

			case "investimento":
				return await acompanhamentoService.deleteInvestimento(id);

			default:
				throw new Error(`Tipo inválido: ${type}`);
		}
	}

};

export default acompanhamentoService;