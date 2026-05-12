import api from "./api";

const metaService = {
  listar: async () => {
    const response = await api.get("/api/metas");
    return response.data;
  },

  buscar: async (id) => {
    const response = await api.get(`/api/metas/${id}`);
    return response.data;
  },

  criar: async (meta) => {
    const response = await api.post("/api/metas", meta);
    return response.data;
  },

  atualizar: async (id, meta) => {
    const response = await api.put(`/api/metas/${id}`, meta);
    return response.data;
  },

  remover: async (id) => {
    const response = await api.delete(`/api/metas/${id}`);
    return response.data;
  },

  aportar: async (id, valor) => {
    const response = await api.post(`/api/metas/${id}/aportes`, { valor });
    return response.data;
  },
};

export default metaService;
