import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { handleApiError } from "@/utils/apis/errorHandler";
import { parseRequestBody } from "@/utils/apis/requestHandler";

export async function POST(
  req: Request,
  context: any  
) {
  try {
    const { patientId, physicalAssessmentId } = context.params;

    const response = await apiServer.post(
      `/patient/physical-assessment/${patientId}/${physicalAssessmentId}`
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: Request, context:any) {
  const { id } = context.params;
  const BASE_URL = `/patient/physical-assessment/${id}`;
  try {
    // ✅ Parse the body once (let parseRequestBody handle it)
    
    const body = await parseRequestBody(req);
    console.log("body", body);
    const response = await apiServer.put(BASE_URL, body);
    return new NextResponse(JSON.stringify(response.data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error parsing or updating profile:", error);
    return handleApiError(error);
  }
}
