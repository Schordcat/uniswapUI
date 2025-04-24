export async function getFunctionCallFromOpenSource(nlInput: string, endpoint: string) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "your-open-source-model-name", // you can leave this out or update it if needed
        messages: [{ role: "user", content: nlInput }],
        tools: [
          {
            type: "function",
            function: {
              name: "swapExactTokensForTokens",
              description: "Perform a token swap on Uniswap",
              parameters: {
                type: "object",
                properties: {
                  amountIn: { type: "string" },
                  amountOutMin: { type: "string" },
                  path: { type: "array", items: { type: "string" } },
                  to: { type: "string" },
                  deadline: { type: "integer" }
                },
                required: ["amountIn", "amountOutMin", "path", "to", "deadline"]
              }
            }
          }
        ],
        tool_choice: "auto"
      })
    });
  
    const data = await response.json();
  
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("❌ No function call returned from open source model");
  
    return JSON.parse(toolCall.function.arguments);
  }
  