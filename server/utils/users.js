const users = [];

// Join user to chat
export function userJoin(id, username, room) {
  const findDuplicateUser = users.filter((v,i)=>{
    return (v["username"]=== username && v["room"] === room)
  })
  if(findDuplicateUser.length > 0){
    const index = users.findIndex((user) => user.username === username && user.room === room);
      users[index].id = id;
      users[index].active = 1;
  }else{
    const user = { id, username, room, active:1};
    users.push(user);
  }
  return users;
}

// Get current user
export function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

export function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index].active=0;
    // return users.splice(index, 1)[0];
    return users[index];
  }
}

// Get room users
export function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
export default users;
