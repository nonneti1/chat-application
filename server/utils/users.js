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

export function userLeave(id,isLeaveRoom) {
  console.log(`Socket Id from function ${id}`);
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    users[index].active=0;
    const tempUser = users[index];
    if(isLeaveRoom){
      users.splice(index, 1)[0];
      return tempUser;
    }
    return users[index];
  }
}

// Get room users
export function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

// Get user room history
export function getRoomHistory(username){
  const foundUser = users.filter(user=>user.username === username).map(i=>{
   return i.room;
  });
  return foundUser;
}
export default users;
