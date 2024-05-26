import Chat from "../models/Chat,model.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { findMessageById, findMessagesByChatId } from "./message.service.js";
import mongoose from "mongoose";

export const findChatById = async (chatId) => {
  try {
    const pipeline = [
      {
        $match: {
          _id: chatId, // Match by chatId
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "users", // Assuming "users" is the name of the collection
          localField: "userId", // Field in the current collection
          foreignField: "_id", // Field in the referenced collection
          as: "userDetails",
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
          as: "messages",
        },
      },
    ];

    const chats = await Chat.aggregate(pipeline);
    return chats;
  } catch (error) {
    throw new Error("Could not find chat by ID", { detail: error });
  }
};

export const getChatsByUserId = async (authenticatedUserId) => {
  try {
    const chats = await Chat.find({
      isDeleted: false,
      $or: [{ userId: authenticatedUserId }, { members: authenticatedUserId }],
    })
      .populate("userId", "-password")
      .populate("members", "-password");
    return chats;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const reply = async (chatId, reqBody, userId) => {
  try {
    const { text } = reqBody;
    if (!text) throw new Error("Type something");
    const chat = await Chat.findById(chatId).populate("members", "-password");
    if (!chat) throw new Error("chat with matching id not found");
    const userIdObject = new mongoose.Types.ObjectId(userId);
    const memberExists = chat.members.some((member) =>
      member.equals(userIdObject)
    );
    if (!memberExists || userIdObject !== chat.userId) {
      throw new Error("You are not registered as a contributor in this chat");
    }
    await Message.create({
      chatId: chat._id,
      text,
      senderId: userId,
    });
    const nonDeletedMessages = await findMessagesByChatId(chatId);

    return {
      ...chat.toObject(),
      messages: nonDeletedMessages,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const createNewChat = async (reqBody, req) => {
  try {
    let newChat;
    const { text, members, groupName } = reqBody;
    if (
      !text ||
      !members ||
      !Array.isArray(members) ||
      members.length === 0 ||
      (Array.isArray(members) && members.length > 1 && !groupName)
    )
      throw new Error("please provide all required fields");
    if (members.length > 1) {
      newChat = await Chat.create({
        userId: req.user.id,
        members: members,
        groupName,
      });
    } else {
      newChat = await Chat.create({
        userId: req.user.id,
        members: members,
      });
    }
    const newMessage = await Message.create({
      chatId: newChat._id,
      text,
      senderId: req.user.id,
    });
    newChat.messageId = newMessage._id;
    await newChat.save();
    const result = await findChatById(newChat._id);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("could not create new chat");
  }
};

export const addMemberToChat = async (chatId, memberId) => {
  try {
    const chat = await Chat.findById(chatId).populate("messageId");

    const membersSet = new Set(chat.members);
    if (membersSet.has(memberId))
      throw new Error(
        "you cannot add an existing contributor to the list of chat members!"
      );

    chat.members.unshift(memberId);
    await chat.save();
    return chat;
  } catch (error) {
    console.log(error);
    console.log(error);
    throw new Error(error);
  }
};

export const removeMemberFromChat = async (chatId, memberId) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Unable to retrieve chat by provided id");

    // Convert memberId to ObjectId if it's not already
    const memberIdObject = new mongoose.Types.ObjectId(memberId);

    // Check if memberId exists in the members array
    const memberExists = chat.members.some((member) =>
      member.equals(memberIdObject)
    );
    if (!memberExists) {
      throw new Error("Member not found in the chat members list");
    }

    // Remove the member from the members array using filter
    chat.members = chat.members.filter(
      (member) => !member.equals(memberIdObject)
    );

    // Mark the members field as modified
    chat.markModified("members");

    // Save the modified chat
    await chat.save();

    return chat;
  } catch (error) {
    throw new Error(error.message);
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

export const discardMessage = async (chatId, messageId, userId) => {
  try {
    const chat = await Chat.findById(chatId).populate("members").exec();
    console.log("chat found in db", chat);
    if (!chat) throw new Error("Unable to get chat by the given id");

    const userIdObject = new mongoose.Types.ObjectId(userId);
    if (
      !chat.userId.equals(userIdObject) &&
      !chat.members.some((member) => member.equals(userIdObject))
    ) {
      throw new Error("You cannot complete this action");
    }

    const message = await Message.findById(messageId);
    console.log("message returned", message);
    if (!message) throw new Error("Cannot find message with the provided id!");
    if (!message.senderId.equals(userIdObject))
      throw new Error("You cannot complete this action");

    message.isDeleted = true;
    await message.save();

    // Filter out deleted messages
    const nonDeletedMessages = await Message.find({
      chatId: chat._id,
      isDeleted: false,
    });

    return {
      ...chat.toObject(),
      messages: nonDeletedMessages,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Could not delete message");
  }
};

export const addToArchive = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId);
    console.log(chat);
    if (!chat) throw new Error("Unable to access chat by  id");
    chat.isArchived = !chat.isArchived;
    await chat.save();
    return chat;
  } catch (error) {
    console.log(error);
    throw new Error("could not archive chat");
  }
};

export const getChatById = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId).populate("members", "-password");
    if (!chat) throw new Error("could not find chat");
    const nonDeletedMessages = await findMessagesByChatId(chatId);

    return {
      ...chat.toObject(),
      messages: nonDeletedMessages,
    };
  } catch (error) {
    throw new Error(error);
  }
};

export const modifyChatName = async (chatId, groupName) => {
  try {
    const chat = await Chat.findById(chatId).populate("members", "-password");
    if (!chat) throw new Error("chat not found");
    chat.groupName = groupName;
    await chat.save();
    const objectIdChatId = new mongoose.Types.ObjectId(chatId);
    const result = await Chat.aggregate([
      // Match the specific chat document by ID
      { $match: { _id: objectIdChatId } },
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
          as: "messages",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
    ]);
    const updatedChat = result[0];
    return updatedChat;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
