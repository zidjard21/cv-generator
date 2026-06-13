import { NextRequest } from "next/server";
import pdfmake from "pdfmake";
import { createDocDefinition } from "./docDefinition";
import { getProfileImage } from "./image.js";
import path from "path";

// Define font files
const fonts = {
  Roboto: {
    normal: path.resolve(process.cwd(), "app/api/generate-pdf/fonts/Roboto-Regular.ttf"),
    bold: path.resolve(process.cwd(), "app/api/generate-pdf/fonts/Roboto-Medium.ttf"),
    italics: path.resolve(process.cwd(), "app/api/generate-pdf/fonts/Roboto-Italic.ttf"),
    bolditalics: path.resolve(process.cwd(), "app/api/generate-pdf/fonts/Roboto-MediumItalic.ttf"),
  },
  RobotoBlack: {
    normal: path.resolve(process.cwd(), "app/api/generate-pdf/fonts/Roboto-Black.ttf"),
    bold: path.resolve(process.cwd(), "app/api/generate-pdf/fonts/Roboto-Black.ttf"),
  },
};

export async function POST(request: NextRequest) {
  try {
    const resumeObject = await request.json();

    if (!resumeObject || !resumeObject.personalInfo) {
      return new Response(JSON.stringify({ error: "Invalid resume object" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    pdfmake.addFonts(fonts);
    pdfmake.setLocalAccessPolicy((filePath: string) => filePath.startsWith(path.resolve(process.cwd(), "app/api/generate-pdf/fonts")));

    const profileImageBase64 = await getProfileImage();
    resumeObject.profileImageBase64 = profileImageBase64;

    const docDefinition = createDocDefinition(resumeObject);
    const buffer = await pdfmake.createPdf(docDefinition).getBuffer();

    const filename = `${String(resumeObject.personalInfo.name).replace(/\s+/g, "")}-${String(resumeObject.documentMetadata.title).replace(/\s+/g, "")}.pdf`;
    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to generate PDF",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}