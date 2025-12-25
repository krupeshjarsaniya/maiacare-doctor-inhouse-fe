import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { handleApiError } from "@/utils/apis/errorHandler";

export async function GET(req: NextRequest, context: any) {
  const id = context.params.id;

  try {
    const response = await apiServer.get(`/patient/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
}
