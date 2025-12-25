import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { parseRequestBody } from "@/utils/apis/requestHandler";
import { handleApiError } from "@/utils/apis/errorHandler";

export async function DELETE(
  req: Request,
  context: any
) {
  const id = context.params.id;

  try {
    const response = await apiServer.delete(`/profile/qualifications/delete/${id}`);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error deleting qualification:", error);
    return handleApiError(error);
  }
}