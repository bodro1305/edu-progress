import api from "./api";

export const deleteUsersApi = async (publicIds: string[]) => {
  return await api.delete("/user/delete-users", {
    data: JSON.stringify({ public_ids: publicIds }),
  });
};

export const deleteUserApi = async (publicId: string) => {
  return await api.delete("/user/delete-user", {
    data: JSON.stringify({ public_id: publicId }),
  });
};

export const getUsersApi = async () => {
  const { data } = await api.post("/user/get-users", {});
  return data;
};
