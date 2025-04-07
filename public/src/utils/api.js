import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // URL do back-end
});

export default api;