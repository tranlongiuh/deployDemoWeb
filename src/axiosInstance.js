import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://angelic-strength-production.up.railway.app/api", // Thay đổi thành URL của API Spring Boot của bạn
});

export default axiosInstance;
