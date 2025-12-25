import axios, { InternalAxiosRequestConfig } from "axios";
import { getTokenFromCookie } from "../Helper";
import { headers } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const apiCommonServer = axios.create({
  baseURL: baseURL + "/api",
});

apiCommonServer.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // ✅ synchronous cookie read
  // const token = (await cookies()).get("token")?.value;

  const token = getTokenFromCookie();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiCommonServer;
