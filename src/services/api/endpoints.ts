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
  },
} as const;
