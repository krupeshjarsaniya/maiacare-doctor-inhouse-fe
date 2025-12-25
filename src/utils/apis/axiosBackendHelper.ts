// utils/apis/axiosBackendHelper.ts
'use server';
import axios, { InternalAxiosRequestConfig } from "axios";
import { headers } from "next/headers";
import { getTokenFromCookie } from "../Helper";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const apiServer = axios.create({
  baseURL: baseURL + "/api/doctor-inhouse/v1",
});

apiServer.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // 1️⃣ Try to get token from cookies
  // const token = (await cookies()).get("token")?.value;
  const token = getTokenFromCookie()
  console.log("Backend token:", token);
  
  // Get headers once for reuse
  const headerList = await headers();

  // 2️⃣ If token isn't in cookies, try to get it from the request headers (client → server)
  if (!token) {
    let clientToken = headerList.get("authorization")?.replace("Bearer ", "");
    if (clientToken) {
      console.log("Backend clientToken:", clientToken);
      if (clientToken?.startsWith('"') && clientToken.endsWith('"')) {
        clientToken = clientToken.slice(1, -1);
      }
      config.headers.Authorization = `Bearer ${clientToken}`;
    }
  } else {
    console.log("Backend token:", token);
    
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiServer;
