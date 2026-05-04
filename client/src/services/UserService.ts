import AxiosInstance from "./AxiosInstance";

const UserService = {
  loadUsers: async () => {
    return AxiosInstance.get("/user/loadUsers");
  },
  storeUser: async (data: unknown) => {
    return AxiosInstance.post("/user/storeUser", data);
  },
};

export default UserService;