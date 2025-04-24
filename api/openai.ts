import express, { Router, Request, Response } from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools = [
  {
    type: "function" as const,
    function: {
      name: "swap_tokens",
      description: "Swap tokens using Uniswap",
      parameters: {
        type: "object",
        properties: {
          amountIn: { type: "string" },
          tokenIn: { type: "string" },
          tokenOut: { type: "string" },
        },
        required: ["amountIn", "tokenIn", "tokenOut"],
      },
    },
  },
] as any as Array<{
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, { type: string }>;
      required: string[];
    };
  };
}>;

router.post("/call", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }],
      tools,
      tool_choice: "auto",
    });

    const toolCall = completion.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call returned");

    const args = JSON.parse(toolCall.function.arguments || "{}");

    res.json({
      tool: toolCall.function.name,
      args,
    });
  } catch (err: any) {
    console.error("❌ OpenAI error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;