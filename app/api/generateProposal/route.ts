import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Configure OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Define types for the request body
interface GenerateProposalRequest {
  companyName: string;
  clientName: string;
  clientObjectives: string[];
  model: "gpt-3.5-turbo" | "gpt-4o-mini";
}

// Define the model configuration type
type ModelConfig = {
  maxTokens: number;
  temperature: number;
};

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing. Ensure it is set in your environment variables.");
    }

    const body: GenerateProposalRequest = await request.json();

    const { companyName, clientName, clientObjectives, model } = body;

    // Validate required inputs
    if (!companyName || !clientName || !clientObjectives || !model) {
      return NextResponse.json(
        { error: "Missing required fields or model selection." },
        { status: 400 }
      );
    }

    if (!Array.isArray(clientObjectives)) {
      return NextResponse.json(
        { error: "Client objectives should be an array of strings." },
        { status: 400 }
      );
    }

    // Map and validate model selection
    const modelMap: Record<string, string> = {
      "gpt-3.5-turbo": "gpt-3.5-turbo",
      "gpt-4o-mini": "gpt-4o-mini",
    };

    const selectedModel = modelMap[model];
    if (!selectedModel) {
      return NextResponse.json(
        { error: "Invalid model selected. Please choose gpt-3.5-turbo or gpt-4o-mini." },
        { status: 400 }
      );
    }

    // Load the proposal template
    const sampleProposalPath = path.join(process.cwd(), "public/templates/SampleProposal.txt");
    let proposalTemplate: string;
    try {
      proposalTemplate = fs.readFileSync(sampleProposalPath, "utf-8");
    } catch (error) {
      console.error("Error reading template file:", error);
      return NextResponse.json(
        { error: "Failed to read proposal template. Ensure the file exists." },
        { status: 500 }
      );
    }

    // Customize the template
    const customizedTemplate = proposalTemplate
      .replace(/\{\{ Your Company Name \}\}/g, companyName)
      .replace(/\{\{ Client Name \}\}/g, clientName)
      .replace(/\{\{ Client Objectives \}\}/g, clientObjectives.join(", "));

    // Define model configs
    const modelConfig: Record<string, ModelConfig> = {
      "gpt-3.5-turbo": { maxTokens: 4000, temperature: 0.6 },
      "gpt-4o-mini": { maxTokens: 2500, temperature: 0.7 },
    };

    // Call the OpenAI API
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: selectedModel,
        max_tokens: modelConfig[model].maxTokens,
        temperature: modelConfig[model].temperature,
        messages: [
          {
            role: "system",
            content: `
            You are an accomplished IT services proposal writer with Shipley Industry-Leading Expertise. 
            Generate a top-quality, business-savvy proposal following these rules:

            • Use numbered sections (1., 2., 3., etc.) for main sections
            • Only if required, Use alphabetical bullets (a), b), c), etc. for subpoints/lists
            • Do not use bold, italics, or special formatting for subsections or bullet points
            DO NOT INCLUDE THANK YOU or any content AFTER SECTION 5.             
            • Include ONLY the following sections in numbered format:
              Thank You 
              1. Understanding Client Objectives
              2. Capabilities Overview
              3. Proposed Solution
              4. Operating Model
              5. Engagement Roadmap

            Tailor the language to highlight how our solutions address the client's objectives.
            Keep it concise, clear, and directly relevant to the client's needs.
            `,
          },
          {
            role: "user",
            content: customizedTemplate,
          },
        ],
      });
    } catch (error: unknown) {
      console.error("OpenAI API Error:", error);
      return NextResponse.json(
        {
          error: "Failed to generate proposal. OpenAI API returned an error.",
          details: process.env.NODE_ENV === "development" ? String(error) : undefined,
        },
        { status: 500 }
      );
    }

    const generatedProposal = completion.choices[0].message.content;
    return NextResponse.json({ proposal: generatedProposal });
  } catch (error: unknown) {
    console.error("Error generating proposal:", error);
    return NextResponse.json(
      {
        error: (error as Error).message || "Failed to generate proposal.",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
