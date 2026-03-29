import itemModel from "../models/item.model.js";
import negotiationModel from "../models/negotiation.model.js";
import shopModel from "../models/shop.model.js";
import { calculateCartTotals } from "../utils/cartUtils.js";
import { generateChatResponse, generateOpeningLine } from "./aiService.js";

export const initializeGameSession = async (userId, shopId, cartItemIds) => {
  // 1. Fetch Data
  const items = await itemModel.find({ _id: { $in: cartItemIds } });
  const shop = await shopModel.findById(shopId).select("+aiPersonaPrompt");

  if (!shop || !items.length) throw new Error("Invalid shop or empty cart.");

  // 2. Crunch Numbers (Using our util)
  const { totalStartingPrice, totalMinPrice, itemNames } = calculateCartTotals(items);

  // 3. Get AI Greeting (Using our AI service)
  const { openingLine, systemInstruction } = await generateOpeningLine(
    shop.aiPersonaPrompt, 
    itemNames, 
    totalStartingPrice
  );

  // 4. Save to Database
  const newSession = await negotiationModel.create({
    userId,
    shopId,
    cartItems: cartItemIds,
    totalStartingPrice,
    totalMinPrice,
    currentAIOffer: totalStartingPrice,
    roundsLeft: 6,
    status: "active",
    timerExpiresAt: new Date(Date.now() + 60000),
    chatHistory: [
      { role: "system", content: systemInstruction },
      { role: "ai", content: openingLine }
    ]
  });

  return { session: newSession, totalStartingPrice, openingLine };
};

export const processUserChat = async (userId, sessionId, userMessage) => {
  // 1. Find the active game
  const session = await negotiationModel.findOne({ _id: sessionId, userId });
  if (!session) throw new Error("Game session not found.");
  if (session.status !== "active") throw new Error("This negotiation is already closed.");

  // 2. The 60-Second Timer Check
  if (new Date() > session.timerExpiresAt) {
    session.status = "timeout";
    await session.save();
    return { status: "timeout", message: "Time is up! The shopkeeper kicked you out." };
  }

  // 3. The 5-Round Limit Check
  if (session.roundsLeft <= 0) {
    session.status = "lost";
    await session.save();
    return { status: "lost", message: "You ran out of chances to make a deal." };
  }

  // 4. Call the AI Service
  const rawAiReply = await generateChatResponse(session.chatHistory, userMessage, session.totalMinPrice);

  // 5. Parse the Secret Tags to determine the winner
  let newStatus = "active";
  if (rawAiReply.includes("[DEAL]")) newStatus = "won";
  if (rawAiReply.includes("[REJECT]")) newStatus = "lost";

  // Clean the AI's message so the player doesn't see the tags
  const cleanAiMessage = rawAiReply.replace("[DEAL]", "").replace("[REJECT]", "").trim();

  // 6. Update the Save File
  session.chatHistory.push({ role: "user", content: userMessage });
  session.chatHistory.push({ role: "ai", content: cleanAiMessage });
  session.roundsLeft -= 1;
  session.timerExpiresAt = new Date(Date.now() + 60000); // Reset the clock!
  session.status = newStatus;

  await session.save();

  // 7. Return the data to the controller
  return {
    aiMessage: cleanAiMessage,
    roundsLeft: session.roundsLeft,
    status: session.status
  };
};