// utils/api/errorHandler.ts
import { NextResponse } from "next/server";
import type { AxiosError } from "axios";

// Define a type for backend error responses
interface BackendErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown; // allow extra fields but not `any`
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // If error is an AxiosError with a response (backend returned error)
  if (isAxiosError<BackendErrorResponse>(error) && error.response) {
    const data = error.response.data;

    return new NextResponse(
      JSON.stringify({
        message: data.message || data.error || "Backend error",
        details: data ?? null,
      }),
      {
        status: error.response.status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // AxiosError but no response (network/timeout)
  if (isAxiosError(error) && error.request) {
    return new NextResponse(
      JSON.stringify({ message: "No response from backend" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Generic/unexpected error
  const message =
    error instanceof Error ? error.message : "Internal Server Error";

  return new NextResponse(
    JSON.stringify({ message }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
}

// ✅ Generic type guard for AxiosError
function isAxiosError<T = unknown>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError).isAxiosError === true;
}
