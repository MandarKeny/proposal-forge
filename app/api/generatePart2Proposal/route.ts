import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define types for the request body
interface GeneratePart2Request {
  companyName: string;
  clientName: string;
  model: "gpt-3.5-turbo" | "gpt-4o-mini";
}

// Define type for model configuration
interface ModelConfig {
  maxTokens: number;
  temperature: number;
}

// Model configurations
const MODEL_CONFIGS: Record<string, ModelConfig> = {
  "gpt-3.5-turbo": { maxTokens: 3000, temperature: 0.7 },
  "gpt-4o-mini": { maxTokens: 2000, temperature: 0.7 },
};

export async function POST(request: Request) {
  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is missing. Please check your environment variables." },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const body: GeneratePart2Request = await request.json();
    const { companyName, clientName, model } = body;

    // Validate required fields
    if (!companyName || !clientName || !model) {
      return NextResponse.json(
        { error: "Missing required fields: companyName, clientName, or model." },
        { status: 400 }
      );
    }

    // Validate model selection
    if (!MODEL_CONFIGS[model]) {
      return NextResponse.json(
        { error: "Invalid model selected. Please choose gpt-3.5-turbo or gpt-4o-mini." },
        { status: 400 }
      );
    }

    // Load template for Part 2
    const sampleProposalPath = path.join(process.cwd(), "public/templates/SampleProposalPart2.txt");
    let proposalTemplate = "";
    try {
      proposalTemplate = fs.readFileSync(sampleProposalPath, "utf-8");
    } catch (error) {
      console.error("Error reading template file for Part 2:", error);
      return NextResponse.json(
        { error: "Failed to read proposal template for Part 2." },
        { status: 500 }
      );
    }

    // Customize the template with company and client names
    const customizedTemplate = proposalTemplate
      .replace(/\{\{ Your Company Name \}\}/g, companyName)
      .replace(/\{\{ Client Name \}\}/g, clientName);

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create OpenAI completion with updated system message for Part 2
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `
You are an accomplished IT services proposal writer with Shipley Industry-Leading Expertise. 
You have ALREADY COMPLETED the first part (section 1 to section 6) of a proposal for ${companyName} to present to ${clientName}. 
Your task is to generate the SECOND PART, specifically focusing on the sections below. 
Ensure that the content is tailored to ${clientName}'s specific business context, emphasizes the unique value 
${companyName} brings, and maintains a structured, professional tone.

Sections to Generate:
7. Transition – Land Safe
8. Driving Continuous Service Improvement– Run Better
9. Bringing Tranformation– Run Different 
10. Success Stories
11. Why ${companyName} as ${clientName}'s Partner

Strict Formatting Rules:
 • Use numbered sections (1., 2., 3., etc.) for main sections
 • Use alphabetical bullets (a), b), c), etc. for subpoints/lists
 • Do not use bold, italics, or special formatting for subsections or bullet points
`,
        },
        {
          role: "user",
          content: customizedTemplate,
        },
      ],
      temperature: MODEL_CONFIGS[model].temperature,
      max_tokens: MODEL_CONFIGS[model].maxTokens,
    });

    // Return the response to the client
    return NextResponse.json({ result: response.choices[0].message?.content });
  } catch (error) {
    console.error("Error in generatePart2Proposal API:", error);

    return NextResponse.json(
      { error: "Failed to generate Part 2 of the proposal." },
      { status: 500 }
    );
  }
}
