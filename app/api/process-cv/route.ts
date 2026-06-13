// app/api/process-cv/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const cvFile = formData.get("cvFile");
  const jobDescription = String(formData.get("jobDescription") || "");
  const systemInstructions = process.env.SYSTEM_INSTRUCTIONS ?? "";

  const file = cvFile as Blob | null;
  if (!file || typeof file.arrayBuffer !== "function") {
    return NextResponse.json(
      { error: "cvFile missing or invalid" },
      { status: 400 },
    );
  }
  const buffer = Buffer.from(await file.arrayBuffer());

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async function main() {
    const config = {
      responseMimeType: "application/json",
      systemInstruction: [
        {
          text: `${systemInstructions}`,
        },
      ],
    };
    const model = "gemini-2.5-flash";
    const contents = [
      { text: `${jobDescription}` },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });
    // let fileIndex = 0;
    // for await (const chunk of response) {
    //   if (chunk.text) {
    //     return chunk.text;
    //   }
    // }
    // console.log("Full AI response stream:", response.text);
    return response.text;
  }

  try {
    const response = await main();

    return NextResponse.json({ result: response });
  } catch (error) {
    console.error("Failed to process CV:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : "Failed to process CV",
      },
      { status: 500 },
    );
  }
}
