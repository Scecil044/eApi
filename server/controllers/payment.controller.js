import { errorHandler } from "../utils/error.js";
import { initiateMpesaPayment } from "../services/mpesa.service.js";

export const processPayment = async (req, res, next) => {
  try {
    const { phone, amount, accountReference, transactionDesc } = req.body;
    if (!phone || !amount || !transactionDesc || !accountReference) {
      return next(errorHandler(403, "please provide all required fields!"));
    }
    const result = await initiateMpesaPayment(
      phone,
      amount,
      accountReference,
      transactionDesc
    );
    res.status(200).json("payment successful");
  } catch (error) {
    next(error);
  }
};
