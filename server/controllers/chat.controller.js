import {
  createNewChat,
  discardChat,
  getChatMembers,
  listAllChats,
} from "../services/chat.service.js";
import { errorHandler } from "../utils/error.js";

/**
 * Admin controller function to get all chats
 */
export const getAllChats = async () => {
  try {
    const chats = await listAllChats();
    if (!chats) return next(errorHandler("could not find chats"));
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};
export const createChat = async (req, res, next) => {
  try {
    const chat = await createNewChat(req.body);
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
export const updateChat = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export const listChatMembers = async () => {
  try {
    const chatMembers = await getChatMembers(req.params.id);
    res.status(200).json(chatMembers);
  } catch (error) {
    next(error);
  }
};

export const deleteChat = async (req, res, next) => {
  try {
    const result = await discardChat(req.params.id);
    if (!result)
      return next(errorHandler(400, "something broke down when deleting chat"));
    res.status(200).json("chat deleted");
  } catch (error) {
    next(error);
  }
};

export const archiveChat = async (req, res, next) => {
  try {
  } catch (error) {}
};
