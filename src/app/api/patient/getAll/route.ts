
import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { handleApiError } from "@/utils/apis/errorHandler";

export async function POST(req: Request) {
  const API_BASE_URL = "patient/getAll";

  try {
    // ✅ Parse request body correctly
    const body = await req.json();

    const response = await apiServer.post(API_BASE_URL, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
}
