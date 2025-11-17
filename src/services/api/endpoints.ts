export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  notification: {
    findAll: "/notification",
  },
  user: {
    update: "/user",
    userInfo: "/me"
  },
} as const;
