import Message from "../models/Message.model.js";
import { findChatById } from "./chat.service.js";

export const createMessage = async (reqBody) => {
  try {
    const chat = await findChatById(chatId);
    if (!chat) throw new Error("could not get the specified chat by id");
    let isRead = false;
    if (req.user.id !== chat.userId) {
      isRead = true;
    }
    const message = await Message.create({
      chatId: chat._id,
      text: reqBody.text,
      isRead,
    });
    if (!message) throw new Error("Unable to save message");
    return chat;
  } catch (error) {
    console.log(error);
    throw new Error("could not save response");
  }
};

export const replyMessage = async (chatId, reqBody) => {
  try {
    const chat = await findChatById(chatId);
    if (!chat) throw new Error("could not get the specified chat by id");
    const result = await createMessage(reqBody);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("could not save response");
  }
};

export const findMessageById = async (messageId) => {
  try {
    const message = await Message.findById(messageId);
    return message;
  } catch (error) {
    console.log(error);
    throw new Error("could not find message by id");
  }
};

export const filterMessages = async (reqQuery) => {
  try {
    const searchRegex = reqQuery.searchTerm
      ? new RegExp(reqQuery.searchTerm, "i")
      : {};

    const matchStage = {
      isDeleted: false,
      text: { $regex: searchRegex },
    };
    const lookUpStage = {
      from: "chats",
      localField: "chatId",
      foreignField: "_id",
      as: "chatDetails",
    };
    const unwindStage = {
      $unwind: "$userDetails",
    };

    const userMatchStage = {
      $match: {
        $or: [
          { "chatDetails.members": req.user.id }, // Check userId in members array
          { "chatDetails.userId": req.user.id }, // Check userId in userId field
        ],
      },
    };

    const groupStage = {
      $group: {
        _id: null,
        totalCount: {
          $sum: 1,
        },
        messages: { $push: "$$ROOT" },
      },
    };

    const sortStage = {
      $sort: { createdAt: -1 },
    };

    const projectStage = {
      $project: {
        messages: 1,
        totalCount: 1,
      },
    };
    const pipeline = [
      matchStage,
      lookUpStage,
      unwindStage,
      userMatchStage,
      sortStage,
      groupStage,
      projectStage,
    ];
    const result = await Message.aggregate(pipeline).populate("chatId");
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("could not filter messages");
  }
};
