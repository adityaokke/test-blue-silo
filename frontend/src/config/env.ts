export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  MIN_LOADING_TIMEOUT: parseInt(import.meta.env.VITE_MIN_LOADING_TIMEOUT || "500", 10),
};
