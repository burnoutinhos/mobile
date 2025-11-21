export const endpoints = {
  auth: {
    login: "/users/login",
    register: "/users/register",
  },
  notification: {
    findAll: "/notifications",
  },
  user: {
    update: "/users",
    userInfo: "/users/me",
    verifyPassword: "/users/verify-password",
  },
  todo: {
    findAll: "/todos",
    put: "/todos",
    me: "/todos/me",
    post: "/todos",
  },
} as const;
