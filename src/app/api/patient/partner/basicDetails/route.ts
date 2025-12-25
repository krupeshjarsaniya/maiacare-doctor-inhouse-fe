import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { parseRequestBody } from "@/utils/apis/requestHandler";
import { handleApiError } from "@/utils/apis/errorHandler";

export async function POST(req: Request) {
  const BASE_URL = "/patient/partner/basicDetails";

  try {
    const body = await parseRequestBody(req);
    console.log("Incoming body:", body);

    const response = await apiServer.post(BASE_URL, body);
    console.log("Backend response:", response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error in get-doctors route:", error);
    return handleApiError(error);
  }
}
