import axios from "axios";
const restURL = "http://localhost:3000/";

const users = [];

// Join user to chat
export function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return users;
}

// Get current user
export async function getCurrentUser(username) {
  try {
    // return users.find(user=>user.id === id);
    const response= await axios.post(restURL + "user/getUser");
    return response.data;
  } catch {

  }
}

export function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
export function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
export default users;
