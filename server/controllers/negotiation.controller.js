import itemModel from "../models/item.model.js";
import negotiationModel from "../models/negotiation.model.js";

export const startNegotiationSession = async (req, res) => {
  try {
    const { shopId, cartItems } = req.body;
    const userId = req.user.id; // From your JWT middleware

    // 1. Fetch the actual items from the database to get the secret minPrices
    const items = await itemModel.find({ _id: { $in: cartItems } });

    // 2. Calculate the Grand Totals
    let totalStartingPrice = 0;
    let totalMinPrice = 0;

    items.forEach(item => {
      totalStartingPrice += item.startingPrice;
      totalMinPrice += item.minPrice; // The AI's secret floor limit!
    });

    // 3. Create the game session in MongoDB
    const newSession = await negotiationModel.create({
      userId,
      shopId,
      cartItems,
      totalStartingPrice,
      totalMinPrice,
      currentAIOffer: totalStartingPrice,
      roundsLeft: 6,
      status: "active",
      timerExpiresAt: new Date(Date.now() + 60000) // 60 seconds from now
    });

    // 4. Send success back to the frontend (We will add the AI's opening line here soon)
    res.status(201).json({
      sessionId: newSession._id,
      totalStartingPrice,
      message: "Session created successfully."
    });

  } catch (error) {
    res.status(500).json({ message: "Error starting negotiation engine." });
  }
};