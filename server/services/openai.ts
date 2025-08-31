import OpenAI from "openai";
import 'dotenv/config';

// Using gpt-4.1-mini as requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface PromptRefinementRequest {
  originalPrompt: string;
  colorScheme: string;
  textOption: string;
  customText?: string;
  style: string;
  targetEmotion: string;
}

export async function refinePromptForThumbnail(request: PromptRefinementRequest): Promise<string> {
  try {
    const systemPrompt = `You are an expert at creating detailed prompts for AI image generation, specifically for YouTube thumbnails. Your task is to enhance a user's basic prompt into a comprehensive, detailed prompt that will generate an engaging YouTube thumbnail.

Consider these requirements:
- YouTube thumbnails are 1280x720 pixels
- They need to be eye-catching and clickable
- Text should be large and readable at thumbnail size
- Colors should be vibrant and attention-grabbing
- Composition should follow the rule of thirds
- Should convey the video's value proposition quickly

Transform the user's prompt by incorporating their style preferences and creating a detailed description that includes:
- Specific visual elements and composition
- Color palette and lighting
- Text placement and styling (if requested)
- Emotional tone and mood
- Technical specifications for optimal thumbnail performance

Respond with only the enhanced prompt, no additional commentary.`;

    const userPrompt = `Original prompt: "${request.originalPrompt}"

User preferences:
- Color scheme: ${request.colorScheme}
- Text inclusion: ${request.textOption}${request.customText ? ` (Custom text: "${request.customText}")` : ''}
- Style: ${request.style}
- Target emotion: ${request.targetEmotion}

IMPORTANT: The user has uploaded a reference image that should be incorporated into the thumbnail design. The AI will receive both this prompt and the uploaded image, so make sure to mention how the uploaded image should be used or modified in the final thumbnail.

Please create a detailed, comprehensive prompt for generating a YouTube thumbnail that incorporates all these elements and references how to use the uploaded image.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || request.originalPrompt;
  } catch (error) {
    console.error("Failed to refine prompt:", error);
    throw new Error(`Failed to refine prompt: ${error}`);
  }
}
