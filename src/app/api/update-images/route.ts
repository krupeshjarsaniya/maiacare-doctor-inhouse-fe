import { NextResponse } from "next/server";
import { parseRequestBody } from "@/utils/apis/requestHandler";
import { handleApiError } from "@/utils/apis/errorHandler";
import apiCommonServer from "@/utils/apis/axiosCommonBackendHelper";

export async function POST(req: Request) {
  const API_BASE_URL = "/update-images";

  try {
    const body = await parseRequestBody(req);
    console.log("Incoming body:", body);

    // When sending FormData to backend — ensure correct format:
    let response;
    if (body && Object.values(body).some(v => v instanceof File)) {
      const formData = new FormData();
      for (const key in body) {
        formData.append(key, body[key]);
      }
      response = await apiCommonServer.post(API_BASE_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await apiCommonServer.post(API_BASE_URL, body);
    }

    console.log("Backend response:", response.data);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Error in /update-images route:", error);
    return handleApiError(error);
  }
}
