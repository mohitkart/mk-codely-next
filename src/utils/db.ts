// lib/db.js
export const messages:any = [
  { id: 1, user: "Admin", text: "Welcome to the chat!" },
];

export const addMessage = (msg:any) => {
  const newMsg = { id: Date.now(), ...msg };
  messages.push(newMsg);
  return newMsg;
};

export const getMessages = () => messages;
