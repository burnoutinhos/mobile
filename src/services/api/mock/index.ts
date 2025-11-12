const MOCK =
  process.env.EXPO_PUBLIC_USE_MOCK === "true" ||
  !process.env.EXPO_PUBLIC_API_URL;

if (MOCK) {
  require("./register");
  require("./login");
  require("./notification");
}
