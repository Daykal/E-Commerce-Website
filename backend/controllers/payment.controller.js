import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {

    
  } catch (err) {
    res.status(500).json({ message: "Server error", err: err.message });
  }
};
