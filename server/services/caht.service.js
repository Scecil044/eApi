import Chat from "../models/Chat,model.js";

export const listAllChats = async () => {
  try {
    const filter = {
      isDeleted: false,
    };
    const options = {
      sort: { createdAt: -1 },
    };
    const chats = await Chat.find(filter, null, options);
    return chats;
  } catch (error) {
    throw new Error("could not list all chats");
  }
};

export const findChatById = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("chat does not exist");
    return chat;
  } catch (error) {
    throw new Error("could not retrieve chat by id");
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
