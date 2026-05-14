import AxiosInstance from "./AxiosInstance";

const UserService = {
  loadUsers: async (page: number, search: string) => {
    try {
      const q = search.trim();
      const response = await AxiosInstance.get(
        q
          ? `/user/loadUsers?page=${page}&search=${encodeURIComponent(q)}`
          : `/user/loadUsers?page=${page}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeUser: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/user/storeUser", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateUser: async (userId: number, data: Record<string, string>) => {
    try {
      const response = await AxiosInstance.put(
        `/user/updateUser/${userId}`,
        data,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyUser: async (userId: string | number) => {
    try {
      const response = await AxiosInstance.put(`/user/destroyUser/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;