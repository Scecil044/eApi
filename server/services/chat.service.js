import Chat from "../models/Chat,model.js";
import Message from "../models/Message.model.js";

export const findChatById = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId)
      .populate("MessageId")
      .populate("userId")
      .populate("members");
    if (!chat) throw new Error("chat not found!");
    return chat;
  } catch (error) {
    throw new Error("could not find chat by ID");
  }
};
export const createNewChat = async (reqBody) => {
  try {
    const { text, members } = reqBody;
    if (!text || !members || !Array.isArray(members) || members.length === 0)
      throw new Error("please provide all required fields");
    const newChat = await Chat.create();
    await Message.create({
      chatId: newChat._id,
      text,
    });
  } catch (error) {
    throw new Error("could not create new chat");
  }
};
export const discardChat = async (chatId) => {
  try {
    const chat = await findChatById(chatId);
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
      chats = await Chat.find();
    } else {
      chats = await Chat.find({
        $or: [{ members: { $in: req.user.id } }, { userId: req.user.id }],
      });
    }
    return chats;
  } catch (error) {
    throw new Error("cannot list all chats");
  }
};
