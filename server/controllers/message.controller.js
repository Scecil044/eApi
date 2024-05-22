import {
  createMessage,
  filterMessages,
  replyMessage,
} from "../services/message.service.js";
import { errorHandler } from "../utils/error.js";

export const createResponse = async (req, res, next) => {
  try {
    const result = await replyMessage(req.params.chatId);
    if (!result) return next(errorHandler(400, "could not add response"));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const filterAllMessages = async (req, res, next) => {
  try {
    const result = await filterMessages(req.query);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
