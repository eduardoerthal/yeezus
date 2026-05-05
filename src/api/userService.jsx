import api from "./api";

const userService = {
  createUser: async (user) => {
    const response = await api.post("/api/user/register", user);
    return response.data;
  },
};

export default userService;