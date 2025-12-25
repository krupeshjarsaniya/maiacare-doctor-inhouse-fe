import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { parseRequestBody } from "@/utils/apis/requestHandler";
import { handleApiError } from "@/utils/apis/errorHandler";

export async function PUT(
  req: Request,
  context: any
) {
  const id = context.params.id;
  const API_URL = `/patient/partner/fertilityAssessment/${id}`;

  try {
    const body = await parseRequestBody(req);

    const response = await apiServer.put(API_URL, body);

    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
}