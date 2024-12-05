import axios from "axios";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

const CreateNewStall = () => {
	const location = useLocation();
	const { canteenSize } = location.state || { canteenSize: 0 };
	const token = localStorage.getItem("token");
	const index = localStorage.getItem("index");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	// State lưu giá trị từ các input
	const [stallData, setStallData] = useState({
		name: "Gian hàng số " + (canteenSize + 1),
		username: "manager" + (canteenSize + 1),
		password: "12345678",
		email: "manager" + (canteenSize + 1) + "@gmail.com",
		phone: "0123456789",
	});

	// Cập nhật dữ liệu từ input
	const handleChange = (e) => {
		const { name, value } = e.target;
		setStallData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Gửi formData lên server
	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", stallData.name);
		formData.append("username", stallData.username);
		formData.append("password", stallData.password);
		formData.append("email", stallData.email);
		formData.append("phone", stallData.phone);

		try {
			const response = await instance.post(
				`/api${index}/createStall`,
				formData,
			);
			if (response.status === 201) {
				alert("Tạo gian hàng thành công!");
			}
		} catch (error) {
			console.error("Error creating stall:", error);
			alert("Đã xảy ra lỗi khi tạo gian hàng!");
		}
	};

	return (
		<div className="h-screen flex flex-col">
			<Navbar />
			<div className="flex-1 flex items-center justify-center">
				<form
					className="bg-stone-200 p-6 rounded-2xl shadow-lg w-full max-w-lg space-y-4"
					onSubmit={handleSubmit}>
					<h1 className="text-2xl font-bold text-center">Tạo gian hàng mới</h1>
					{/* Tên gian hàng */}
					<div>
						<p className="font-bold mb-1">Tên gian hàng</p>
						<input
							className="p-3 rounded-lg bg-white border border-gray-300 w-full"
							type="text"
							name="name"
							value={stallData.name}
							onChange={handleChange}
							required
						/>
					</div>
					{/* Tài khoản */}
					<div>
						<p className="font-bold mb-1">Tài khoản</p>
						<input
							className="p-3 rounded-lg bg-white border border-gray-300 w-full"
							type="text"
							name="username"
							value={stallData.username}
							onChange={handleChange}
							required
						/>
					</div>
					{/* Mật khẩu */}
					<div>
						<p className="font-bold mb-1">Mật khẩu</p>
						<input
							className="p-3 rounded-lg bg-white border border-gray-300 w-full"
							type="text"
							name="password"
							value={stallData.password}
							onChange={handleChange}
							required
						/>
					</div>
					{/* Email */}
					<div>
						<p className="font-bold mb-1">Email</p>
						<input
							className="p-3 rounded-lg bg-white border border-gray-300 w-full"
							type="email"
							name="email"
							value={stallData.email}
							onChange={handleChange}
							required
						/>
					</div>
					{/* Số điện thoại */}
					<div>
						<p className="font-bold mb-1">Số điện thoại</p>
						<input
							className="p-3 rounded-lg bg-white border border-gray-300 w-full"
							type="text"
							name="phone"
							value={stallData.phone}
							onChange={handleChange}
							required
						/>
					</div>
					{/* Nút xác nhận */}
					<button
						type="submit"
						className="w-full p-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition duration-200">
						Xác nhận
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateNewStall;
