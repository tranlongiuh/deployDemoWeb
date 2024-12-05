import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Thay đổi thành URL của API Spring Boot của bạn
});

export default axiosInstance;
