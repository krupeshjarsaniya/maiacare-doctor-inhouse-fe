// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { handleApiError } from "@/utils/apis/errorHandler";
import { parseRequestBody } from "@/utils/apis/requestHandler";

export async function POST(req: Request) {
  const API_BASE_URL = "/profile/qualifications/add";
  const body = await parseRequestBody(req);

  try {
    const response = await apiServer.post(API_BASE_URL, body);

    return new NextResponse(JSON.stringify(response.data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
