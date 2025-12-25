// import { NextResponse } from "next/server";
// import apiServer from "@/utils/apis/axiosBackendHelper";

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const { id } = params;

//     const response = await apiServer.delete(`/patient/delete/${id}`);

//     return NextResponse.json(response.data);
//   } catch (error) {
//     console.error("Delete Error:", error);
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import apiServer from "@/utils/apis/axiosBackendHelper";
import { handleApiError } from "@/utils/apis/errorHandler";

export async function DELETE(req: Request, context: any) {
  const id = context.params.id;

  try {
    console.log("DELETE ID:", id);

    const response = await apiServer.delete(`/patient/delete/${id}`);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Delete API Error:", error);
    return handleApiError(error);
  }
}



