// lib/db.js
export const messages: any = [
  { id: 1, sendBy: "Admin", sendTo: 'customer', createdAt: new Date().toISOString(), message: "Welcome to the chat!" },
];

export const conversations: any = [];

export const addMessage = (msg: any) => {
  const newMsg = { id: Date.now(), ...msg };
  messages.push(newMsg);
  return newMsg;
};

export const getMessages = () => messages;

export const getConversation = () => conversations;
export const addConversation = (p: any) => {
  const newMsg = { ...p };
  if (conversations.some((itm: any) => itm.id == newMsg.id)) {
    return newMsg;
  } else {
    conversations.push(newMsg);
  }
  return newMsg;
};

