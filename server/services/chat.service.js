import Chat from "../models/Chat,model.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { findMessageById } from "./message.service.js";
import { findUserById } from "./user.service.js";

export const findChatById = async (chatId) => {
  try {
    const pipeline = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$chatId", "$$chatId"] },
                    { $eq: ["$isDeleted", false] },
                  ],
                },
              },
            },
          ],
          as: "messageDetails",
        },
      },
    ];

    const chats = await Chat.aggregate(pipeline)
      .populate("userId")
      .populate("messageId");
    return chats;
  } catch (error) {
    throw new Error("could not find chat by ID");
  }
};
export const createNewChat = async (reqBody) => {
  try {
    const { text, members } = reqBody;
    if (!text || !members || !Array.isArray(members) || members.length === 0)
      throw new Error("please provide all required fields");
    const newChat = await Chat.create({
      userId: req.user.id,
      members: members,
    });
    const newMessage = await Message.create({
      chatId: newChat._id,
      text,
    });
    newChat.messageId = newMessage._id;
    await newChat.save();
    const result = await findChatById(newChat._id);
    return result;
  } catch (error) {
    throw new Error("could not create new chat");
  }
};

export const addMemberToChat = async (chatId, memberId) => {
  try {
    const chat = await findChatById(chatId);
    if (chat.members.some((item) => item === memberId))
      throw new Error(
        "you cannot add an existing contributor to the list of chat members!"
      );
    chat.members.unshift(memberId);
    return chat;
  } catch (error) {
    console.log(error);
    throw new Error("cannot add member to chat");
  }
};

export const removeMemberFromChat = async (chatId, memberId) => {
  try {
    const chat = await findChatById(chatId);
    if (!chat) throw new Error("unable to retrieve chat by provided id");

    const membersSet = new Set(chat.members);
    if (!membersSet.has(memberId)) {
      throw new Error(
        "You are attempting to remove a non-existing user from the list of chat members"
      );
    }
    membersSet.delete(memberId);
    chat.members = Array.from(membersSet);
    // alternative
    // chat.members = chat.members.filter((id) => id !== memberId);
    await chat.save();
    return chat;
  } catch (error) {
    throw new Error("cannot remove contributor from chat");
  }
};
export const discardChat = async (chatId) => {
  try {
    const chat = await findChatById(chatId);
    if (!chat) throw new Error("could not find chat by the provided id");
    chat.isDeleted = true;
    return chat;
  } catch (error) {
    throw new Error("could not delete chat");
  }
};

export const listAllChats = async () => {
  try {
    let chats;
    if (req.user.role === "admin" || req.user.role === "superAdmin") {
      // chats = await Chat.find();
      const pipeline = [
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "messages",
            localField: "messageId",
            foreignField: "_id",
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                },
              },
            ],
            as: "messageDetails",
          },
        },
        {
          $project: {
            senderId: 1,
            text: "$messageDetails.text",
            createdAt: 1,
          },
        },
      ];
      chats = await Chat.aggregate(pipeline)
        .populate("userId")
        .populate("messageId");
    } else {
      chats = await Chat.find({
        $or: [{ members: { $in: req.user.id } }, { userId: req.user.id }],
      })
        .populate("userId")
        .populate("messageId");
    }
    return chats;
  } catch (error) {
    throw new Error("cannot list all chats");
  }
};

export const getChatMembers = async (chatId) => {
  try {
    const chat = await findChatById(chatId);
    if (!chat) throw new Error("Unable to get chat by provided id");
    const members = await User.find({ _id: { $in: chat.members } });
    return members;
  } catch (error) {
    throw new Error(error);
  }
};

export const discardMessage = async (chatId, messageId) => {
  try {
    const chat = await findChatById(chatId);
    if (!chat) throw new Error("Unable to get chat by the give id");
    const membersSet = new Set(chat.members);
    if (req.user.id !== chat.userId && !membersSet.has(chatId)) {
      throw new Error("you cannot complete this action");
    }
    const message = await findMessageById(messageId);
    if (!message) throw new Error("Cant find message with the provided id!");
    message.isDeleted = true;
    await message.save();
    return chat;
  } catch (error) {
    console.log(error);
    throw new Error("could not delete message");
  }
};

export const addToArchive = async (chatId) => {
  try {
    const chat = await findChatById(chatId);
    if (!chat) throw new Error("Unable to access chat by  id");
    chat.isArchived = true;
    await chat.save();
    return chat;
  } catch (error) {
    console.log(error);
    throw new Error("could not archive chat");
  }
};
