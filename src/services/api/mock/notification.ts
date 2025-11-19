import AxiosMockAdapter from "axios-mock-adapter";
import { api } from "../axios-client";
import { endpoints } from "../endpoints";
import { NotificationResponse } from "../../../model/notification/notification";

const notificationMock = () => {
  const mock = new AxiosMockAdapter(api, { delayResponse: 1000 });

  const notifications: NotificationResponse[] = [
    {
      id: 1,
      task_id: 1,
      message: "pipopo",
      created_at: new Date("2020-11-11"),
    },
    {
      id: 2,
      task_id: 2,
      message: "nova tarefa criada",
      created_at: new Date("2021-06-01"),
    },
    {
      id: 3,
      task_id: 3,
      message: "lembrete importante",
      created_at: new Date("2023-03-20"),
    },
    {
      id: 4,
      task_id: 4,
      message: "atualização do sistema",
      created_at: new Date("2024-01-10"),
    },
    {
      id: 5,
      task_id: 5,
      message: "mensagem de teste",
      created_at: new Date("2025-05-05"),
    },
  ];

  mock.onGet(endpoints.notification.findAll).reply((config) => {
    return [200, notifications];
  });

  mock.onDelete(endpoints.notification.findAll).reply((config) => {
    return [204];
  });

  mock
    .onDelete(new RegExp(`${endpoints.notification.findAll}/\\d+$`))
    .reply((config) => {
      const url = config.url || "";
      const match = url.match(/\/(\d+)$/);
      const id = match ? Number(match[1]) : null;

      if (id === null || Number.isNaN(id)) {
        return [400];
      }

      const idx = notifications.findIndex((n) => n.id === id);
      if (idx === -1) {
        return [404];
      }

      notifications.splice(idx, 1);

      return [204];
    });
};

process.env.NODE_ENV === "development" &&
  process.env.EXPO_PUBLIC_USE_MOCK === "true" &&
  notificationMock();
