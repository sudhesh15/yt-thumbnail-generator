import * as fs from "fs";
import * as path from "path";
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ENV_VAR || ""
});

export async function generateThumbnailImage(
  prompt: string,
  outputPath: string,
  inputImagePath?: string,
): Promise<void> {
  try {
    // Prepare the content parts
    const contentParts: any[] = [{ text: prompt }];
    
    // If an input image is provided, include it in the generation
    if (inputImagePath && fs.existsSync(inputImagePath)) {
      console.log("Debug - Including uploaded image in generation:", inputImagePath);
      const imageBytes = fs.readFileSync(inputImagePath);
      const mimeType = inputImagePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      
      contentParts.push({
        inlineData: {
          data: imageBytes.toString("base64"),
          mimeType,
        },
      });
      console.log("Debug - Image added to content parts, mime type:", mimeType);
    } else {
      console.log("Debug - No input image provided or file doesn't exist:", inputImagePath);
    }

    // Using Gemini 2.5 Flash Image model which supports image generation
    // This model is confirmed to work with the current API setup
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: [{ role: "user", parts: contentParts }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content in response");
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const part of content.parts) {
      if (part.text) {
        console.log("Gemini response:", part.text);
      } else if (part.inlineData && part.inlineData.data) {
        const imageData = Buffer.from(part.inlineData.data, "base64");
        fs.writeFileSync(outputPath, imageData);
        console.log(`Image saved as ${outputPath}`);
        return;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Failed to generate image:", error);
    throw new Error(`Failed to generate image: ${error}`);
  }
}

export async function analyzeUploadedImage(imagePath: string): Promise<string> {
  try {
    const imageBytes = fs.readFileSync(imagePath);
    const mimeType = imagePath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const contents = [
      {
        inlineData: {
          data: imageBytes.toString("base64"),
          mimeType,
        },
      },
      `Analyze this image that will be used as source material for a YouTube thumbnail. Describe the key visual elements, composition, colors, and subject matter that could be enhanced or incorporated into a thumbnail design.`,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
    });

    return response.text || "";
  } catch (error) {
    console.error("Failed to analyze image:", error);
    throw new Error(`Failed to analyze image: ${error}`);
  }
}
