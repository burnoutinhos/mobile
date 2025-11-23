export const queryKeys = {
  notification: {
    findAll: "notifications",
    single: "notification",
  },
  auth: {
    register: "register",
    login: "login",
  },
  user: {
    user: "user",
    userPassword: "userPassword",
    userUpdate: "userUpdate",
  },
  todo: {
    findAll: "todos/me",
    me: "todos/me",
    put: "todoUpdate",
    create: "todoCreate",
    delete: "todoDelete",
  },
  timeblock: {
    findAll: "timeblocks",
    single: "timeblock",
    create: "timeblockCreate",
    update: "timeblockUpdate",
    delete: "timeblockDelete",
  },
};
