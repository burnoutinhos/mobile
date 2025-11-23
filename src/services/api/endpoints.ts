export const endpoints = {
  auth: {
    login: "/users/login",
    register: "/users/register",
  },
  notification: {
    findAll: "/notifications",
    findMe: "/notifications/me",
    delete: (id: number) => `/notifications/${id}`,
  },
  user: {
    update: "/users",
    userInfo: "/users/me",
    verifyPassword: "/users/verify-password",
  },
  todo: {
    findAll: "/todos",
    put: "/todos",
    me: (page: number, pageSize: number) =>
      `/todos/me?page=${page}&size=${pageSize}`,
    post: "/todos",
    delete: "/todos",
  },
  timeblock: {
    find: "/timeblocks",
    findMe: (page: number, size: number) =>
      `/timeblocks/me?page=${page}&size=${size}`,
    create: "/timeblocks",
    update: (id: number) => `/timeblocks/${id}`,
    delete: (id: number) => `/timeblocks/${id}`,
  },
} as const;
