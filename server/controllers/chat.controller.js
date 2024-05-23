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
import { createLog } from "../services/log.service.js";
import { errorHandler } from "../utils/error.js";
import { logger } from "../utils/winstonLogger.js";

/**
 * Admin controller function to get all chats
 */
export const getAllChats = async (req, res, next) => {
  try {
    const chats = await listAllChats();
    if (!chats) return next(errorHandler("could not find chats"));
    const logString = logger.info(
      `${req.user.userName} accessed the get all chats route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(chats);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the get all chats route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
export const createChat = async (req, res, next) => {
  try {
    const chat = await createNewChat(req.body);
    const logString = logger.info(
      `${req.user.userName} accessed the create new chat route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(chat);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the create new chat route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
export const updateChat = async (req, res, next) => {
  try {
    const logString = logger.info(
      `${req.user.userName} accessed the update chat route for chat id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the update chat route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const listChatMembers = async (req, res, next) => {
  try {
    const chatMembers = await getChatMembers(req.params.id);
    const logString = logger.info(
      `${req.user.userName} accessed list chat members route for chat id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(chatMembers);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the list all chat members route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const deleteChat = async (req, res, next) => {
  try {
    const result = await discardChat(req.params.id);
    if (!result)
      return next(errorHandler(400, "something broke down when deleting chat"));
    const logString = logger.info(
      `${req.user.userName} accessed delete chat route for chat id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json("chat deleted");
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the delete chat route`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};

export const archiveChat = async (req, res, next) => {
  try {
    await addToArchive(req.params.id);
    const logString = logger.info(
      `${req.user.userName} accessed archive chat route for chat id ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json("chat archived");
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the archive chat route for chat id: ${req.params.id}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
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

    const logString = logger.info(
      `${req.user.userName} accessed add chat contributor for chat id ${req.params.chatId}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(result);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the add chat contributor route for chat ${req.params.chatId}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
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
    const logString = logger.info(
      `${req.user.userName} accessed archive remove member id ${req.params.memberId} for chat id ${req.params.chatId}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json(result);
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the remove member route for chat id: ${req.params.chatId}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
export const deleteMessage = async (req, res, next) => {
  try {
    const response = await discardMessage(
      req.params.chatId,
      req.params.messageId
    );
    const logString = logger.info(
      `${req.user.userName} accessed delete chat route for chat id ${req.params.chatId}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    res.status(200).json("Message deleted!");
  } catch (error) {
    const logString = logger.info(
      `${req.user.userName} unable to access the delete message route for chat id: ${req.params.chatId}`
    ).transports[0].logString;
    await createLog(req.user.id, logString);
    next(error);
  }
};
