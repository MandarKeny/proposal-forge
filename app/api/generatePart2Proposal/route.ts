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
  "gpt-3.5-turbo": { maxTokens: 2000, temperature: 0.7 },
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

    // Create OpenAI completion with custom system message for Part 2
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: `You are a highly skilled professional proposal writer creating a proposal for ${companyName} to present to ${clientName}. The earlier sections of this proposal have already been written. Your task is to complete the remaining sections, ensuring they are specifically tailored to showcase ${companyName}'s unique value proposition to ${clientName}.

Strict Instructions:
- Generate content ONLY for the following sections, customizing each for ${clientName}'s specific context
- Reference ${companyName} by name when discussing capabilities and solutions
- Make all examples and success stories relevant to ${clientName}'s industry and needs
- Ensure all sections emphasize the unique partnership between ${companyName} and ${clientName}

Formatting Guidelines:
- Use numbered sections (8., 9., 10., etc.) for main sections
- Use alphabetical bullets (a), b), c), etc., for subpoints or lists
- Avoid using special formatting like bold or italics; rely on clarity and logical structure

Sections to Generate:
7. Transition - Land Safe: Detail how ${companyName} will manage the transition process for ${clientName}, including specific risk mitigation strategies
8. Run Better - Driving Continuous Service Improvements: Describe ${companyName}'s approach to optimizing ${clientName}'s operations
9. Run Different - Bringing Enhancements: Highlight ${companyName}'s innovative solutions specifically beneficial for ${clientName}
10. Success Stories: Share relevant examples of ${companyName}'s success with similar clients in ${clientName}'s industry
11. Why ${companyName} as ${clientName}'s Partner: Emphasize why ${companyName} is uniquely positioned to serve ${clientName}'s needs

Additional Constraints:
- Use concise and non-redundant language
- Each section should directly address ${clientName}'s specific needs and context
- Maintain a professional yet personal tone that builds trust between ${companyName} and ${clientName}
- Focus on tangible benefits and measurable outcomes specific to ${clientName}`,
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