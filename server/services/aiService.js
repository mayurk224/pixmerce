import { llm } from "../config/gemini.js";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const generateOpeningLine = async (personaPrompt, itemNames, totalPrice) => {
  // Persona rules only — Gemini treats this as the system prompt
  const systemInstruction = personaPrompt.trim();

  // Transaction context — must be a HumanMessage so Gemini populates `contents`
  const invisibleTrigger = `
The customer just walked up to your counter. They want to buy the following items: ${itemNames.join(", ")}.
The total sticker price for these items is $${totalPrice}.

Write a short, in-character opening greeting (1-2 sentences maximum).
Acknowledge the items they want and state the total sticker price. Ask them if they are ready to pay or if they want to make an offer.
  `.trim();

  const response = await llm.invoke([
    new SystemMessage(systemInstruction),
    new HumanMessage(invisibleTrigger),
  ]);

  // Combine both parts so the DB stores the full context for future rounds
  const fullSystemContext = `${systemInstruction}\n\n${invisibleTrigger}`;

  return {
    openingLine: response.content,
    systemInstruction: fullSystemContext, // saved to chatHistory[0] in negotiationService
  };
};

export const generateChatResponse = async (chatHistory, userMessage, totalMinPrice) => {
  // 1. Define the referee rule first so it can be merged into the system message
  const refereeRule = `
    STRICT GAME RULES: 
    1. Your absolute minimum allowed price is $${totalMinPrice}. You CANNOT accept any offer below this number under any circumstances. 
    2. If the user's offer is acceptable to you (at or above the minimum), you MUST end your response with the exact word "[DEAL]".
    3. If the user's offer is incredibly insulting or way too low, you may end the negotiation by appending the word "[REJECT]".
    4. Otherwise, just counter-offer normally and try to get the highest price possible.
  `;

  // 2. Convert our MongoDB chat history into LangChain message objects.
  //    Gemini requires the SystemMessage to be the FIRST and ONLY system message,
  //    so we merge the refereeRule directly into the existing system prompt here.
  const messages = chatHistory.map(msg => {
    if (msg.role === 'system') return new SystemMessage(`${msg.content}\n\n${refereeRule}`);
    if (msg.role === 'ai') return new AIMessage(msg.content);
    if (msg.role === 'user') return new HumanMessage(msg.content);
  });

  // 3. Push the player's brand new message to the end
  messages.push(new HumanMessage(userMessage));

  // 4. Call Gemini with a correctly ordered message array
  const response = await llm.invoke(messages);
  return response.content;
};