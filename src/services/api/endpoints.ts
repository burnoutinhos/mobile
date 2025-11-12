export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  notification: {
    findAll: "/notification",
  },
} as const;
