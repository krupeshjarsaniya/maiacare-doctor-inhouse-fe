// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { handleApiError } from "@/utils/apis/errorHandler";

export async function GET(req: Request) {
  const API_BASE_URL = "profile/get/login-user";

  try {
    const response = await apiServer.get(API_BASE_URL);

    return new NextResponse(JSON.stringify(response.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
