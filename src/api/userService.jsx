import api from "./api";

const userService = {

  createUser: async (user) => {
    return await api.post("/api/user/register", user);
  },

  login: async (user) => {
    return await api.post("/api/user/login", user);
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  }

};

export default userService;