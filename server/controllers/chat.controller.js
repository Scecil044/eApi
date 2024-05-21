import {
  addMemberToChat,
  addToArchive,
  createNewChat,
  discardChat,
  discardMessage,
  getChatMembers,
  listAllChats,
  removeMemberFromChat,
} from "../services/chat.service.js";
import { errorHandler } from "../utils/error.js";

/**
 * Admin controller function to get all chats
 */
export const getAllChats = async (req, res, next) => {
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

export const listChatMembers = async (req, res, next) => {
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
    await addToArchive(req.params.id);
    res.status(200).json("chat archived");
  } catch (error) {
    next(error);
  }
};
// function to add member to chat
export const addContributor = async (req, res, next) => {
  try {
    const result = await addMemberToChat(
      req.params.chatId,
      req.params.memberId
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
// function to remove a contributor from chat
export const removeMember = async (req, res, next) => {
  try {
    const result = await removeMemberFromChat(
      req.params.chatId,
      req.params.memberId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
export const deleteMessage = async (req, res, next) => {
  try {
    const response = await discardMessage(
      req.params.chatId,
      req.params.messageId
    );
    res.status(200).json("Message deleted!");
  } catch (error) {
    next(error);
  }
};
