import { initializeGameSession, processCheckout, processUserChat } from "../services/negotiationService.js";

export const startNegotiationSession = async (req, res) => {
  try {
    const { shopId, cartItems } = req.body;
    const userId = req.user.id;

    // The controller delegates all the hard work to the Service layer
    const { session, totalStartingPrice, openingLine } =
      await initializeGameSession(userId, shopId, cartItems);

    res.status(201).json({
      sessionId: session._id,
      totalStartingPrice,
      aiMessage: openingLine,
      roundsLeft: session.roundsLeft,
      timerExpiresAt: session.timerExpiresAt,
      currentOffer: session.currentAIOffer,
      status: session.status,
      message: "Game Started!",
    });
  } catch (error) {
    console.error("Negotiation Start Error:", error.message);

    // Check if it's our custom error from the service
    if (error.message === "Invalid shop or empty cart.") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Error starting negotiation engine." });
  }
};

export const handleChatMessage = async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body;
    const userId = req.user.id; 

    // Hand it off to the Service
    const result = await processUserChat(userId, sessionId, userMessage);

    // If the game ended due to a timeout or running out of rounds, send a 400
    if (result.status === "timeout" || result.status === "lost") {
      return res.status(400).json(result);
    }

    // Otherwise, send the successful AI reply back
    res.status(200).json(result);

  } catch (error) {
    console.error("Chat Error:", error.message);
    res.status(500).json({ message: "Server error processing your message." });
  }
};

export const handleCheckout = async (req, res) => {
  try {
    const { sessionId, agreedPrice } = req.body;
    const userId = req.user.id; 

    const result = await processCheckout(userId, sessionId, agreedPrice);

    res.status(200).json(result);

  } catch (error) {
    console.error("Checkout Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};
