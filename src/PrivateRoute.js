import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, role }) => {
	const token = localStorage.getItem("token");
	const userRole = localStorage.getItem("index");

	if (!token) {
		// Nếu không có token, chuyển hướng đến trang đăng nhập
		return <Navigate to="/login" />;
	}

	if (role && userRole !== role) {
		// Nếu vai trò không khớp, chuyển hướng đến trang lỗi hoặc trang khác
		return <Navigate to="/error" />;
	}

	// Nếu người dùng có vai trò phù hợp, cho phép truy cập vào trang
	return element;
};

export default PrivateRoute;
