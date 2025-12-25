// utils/apis/apiClient.js
"use client";
import axios from "axios";
import { getTokenFromCookie } from "../Helper";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    let token = getTokenFromCookie()

    // 🧹 Remove quotes if token is like '"abcd..."'
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add x-city header from localStorage or Redux
    // Priority: selectedLocation > selectedCity
    const city = localStorage.getItem("selectedCity");
    if (city) {
      config.headers["x-city"] = city;
    }
  }
  return config;
});

export default apiClient;
