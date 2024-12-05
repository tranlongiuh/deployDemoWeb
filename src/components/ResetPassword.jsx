import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import CustomButton from "./CustomButton";
import FormField from "./FormField";

function ResetPassword() {
	const authToken = localStorage.getItem("token");
	const instance = axios.create({
		baseURL: "http://localhost:8080/",
		headers: {
			Authorization: `Bearer ${authToken}`,
		},
	});
	const [searchParams] = useSearchParams(); // Lấy các tham số từ URL
	const navigate = useNavigate();
	const [form, setForm] = useState({
		newPassword: "",
	});

	const [loading, setLoading] = useState(false);

	let hasChecked = false; // Cờ để chặn gọi nhiều lần
	useEffect(() => {
		const token = searchParams.get("token");
		console.log("token ", token);

		instance
			.post("http://localhost:8080/api/auth/getReset", null, {
				params: { token: token },
			})
			.then((response) => {
				if (response.status === 200) {
					console.log("Token hợp lệ, hiển thị form reset password.");
					hasChecked = true; // Đặt cờ sau khi kiểm tra token
					return;
				}
			})
			.catch((error) => {
				if (!hasChecked) {
					console.log("Token không hợp lệ.", error);

					hasChecked = true;
				}
			});
	}, [searchParams, navigate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const token = searchParams.get("token"); // Lấy lại token để gửi
		console.log("handleSubmit token", token);

		// Dữ liệu yêu cầu để đặt lại mật khẩu
		const requestReset = new FormData();
		requestReset.append("token", token);

		requestReset.append("password", form.newPassword);

		setLoading(true);

		// Gọi API để thay đổi mật khẩu
		instance
			.post("http://localhost:8080/api/auth/reset", requestReset)
			.then((response) => {
				if (response.status === 200) {
					alert(response.data || "Đặt lại mật khẩu thành công!");
					navigate("/login"); // Chuyển hướng đến trang đăng nhập sau khi reset thành công
				}
			})
			.catch((error) => {
				console.error("Error resetting password:", error);
			})
			.finally(() => setLoading(false));
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
			<div className="items-center justify-center p-10 bg-white border-4 border-double rounded-lg border-sky-500 ">
				<p className="flex justify-center text-3xl font-semibold text-blue-600 ">
					Đặt lại mật khẩu
				</p>
				<div>
					<FormField
						title="Mật khẩu mới"
						value={form.newPassword}
						handleChangeText={(e) => setForm({ ...form, newPassword: e })}
						otherStyles="mt-7"
						keyboardType=""
					/>
				</div>
				<div className="flex items-center justify-center w-full">
					{!loading && (
						<CustomButton
							title="Gửi"
							handlePress={handleSubmit}
							containerStyles="mt-7"
							disabled={loading}
						/>
					)}
					{loading && (
						<div role="status" className="mt-7">
							<svg
								aria-hidden="true"
								class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span class="sr-only">Loading...</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ResetPassword;
