export async function parseRequestBody(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // Handle JSON
    if (contentType.includes("application/json")) {
      return await req.json();
    }

    // Handle text
    if (contentType.includes("text/")) {
      return await req.text();
    }

    // ✅ Handle FormData (file uploads / multipart forms)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Typed object: string or File values only
      const body: Record<string, string | File> = {};

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          body[key] = value;
        } else {
          body[key] = value.toString();
        }
      }

      return body;
    }

    // fallback: raw stream (binary or unknown)
    const reader = req.body?.getReader();
    let result = "";
    if (reader) {
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }
    }
    return result || null;
  } catch (error) {
    console.error("Error parsing request body:", error);
    throw new Error("Invalid request body format");
  }
}
