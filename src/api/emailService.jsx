import api from "./api";

const emailService = {
  sendEmail: async (email) => {
    return await api.post("/api/email/enviar", email);
  },
};

export default emailService;