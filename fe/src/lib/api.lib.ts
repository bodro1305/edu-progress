import axios, { type AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.0.103:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
});

export const api = async (
  axiosProp: AxiosRequestConfig,
  { accessToken }: { accessToken?: string },
) => {
  axiosProp.headers = {
    ...axiosProp?.headers,
    Authorization: `Bearer ${accessToken}`,
  };
  const result = await axiosInstance(axiosProp);
  return result;
};

export default api;
