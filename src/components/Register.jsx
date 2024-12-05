import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";
import CustomButton from "./CustomButton";
import FormField from "./FormField";
// import images from "../assets/img";
const Register = () => {
	const [form, setForm] = useState({
		userName: "",
		email: "",
		password: "",
	});

	const [error, setError] = useState("");

	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);

	const submit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

		if (!emailRegex.test(form.email)) {
			setError("Vui lòng nhập địa chỉ email hợp lệ. Ví dụ: user@example.com");
			return;
		}

		const usernameRegex = /^[a-zA-Z0-9]{8,}$/;

		if (!usernameRegex.test(form.userName)) {
			setError(
				"Tên người dùng phải dài ít nhất 8 ký tự và không chứa ký tự đặc biệt.",
			);
			return;
		}

		// if (password.length < 8) {
		//   setError("Mật khẩu phải dài ít nhất 8 ký tự.");
		//   return;
		// }
		try {
			const newUser = {
				userName: form.userName,
				email: form.email,
				password: form.password,
			};
			const response = await axios.post(
				"https://angelic-strength-production.up.railway.app/api/auth/register",

				newUser,
			);

			// Xử lý phản hồi từ API
			if (response.status === 201) {
				console.log(
					response.data ||
						"Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực.",
				);
				// Điều hướng người dùng đến trang home
				navigate("/login");
			}
		} catch (error) {
			// Xử lý lỗi
			if (error.response) {
				const { status, data } = error.response;

				if (status === 400) {
					setError(data || "Đăng ký thất bại!");
				} else if (status === 409) {
					setError(data || "Email đã tồn tại!");
				} else {
					setError("Đã xảy ra lỗi không xác định.");
				}
			} else {
				setError("Không thể kết nối đến server.");
			}
		} finally {
			setLoading(false);
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			submit(e);
		}
	};
	return (
		<div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
			<div className="items-center justify-center p-10 bg-white border-4 border-double rounded-lg border-sky-500 ">
				<p className="flex justify-center text-3xl font-semibold text-blue-600 ">
					Đăng Ký
				</p>
				{error && <div className="text-red-500">{error}</div>}
				<div>
					<FormField
						title="Tài khoản"
						value={form.userName}
						handleChangeText={(e) => setForm({ ...form, userName: e })}
						otherStyles="mt-7"
						keyboardType="email-address"
						onKeyDown={handleKeyDown}
					/>
				</div>
				<div>
					<FormField
						title="Email"
						value={form.email}
						handleChangeText={(e) => setForm({ ...form, email: e })}
						otherStyles="mt-7"
						onKeyDown={handleKeyDown}
					/>
				</div>
				<div>
					<FormField
						title="Mật khẩu"
						value={form.password}
						handleChangeText={(e) => setForm({ ...form, password: e })}
						otherStyles="mt-7"
						onKeyDown={handleKeyDown}
					/>
				</div>
				<div className="flex items-center justify-center w-full">
					{!loading && (
						<CustomButton
							title="Đăng ký"
							handlePress={submit}
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

				<div className="flex-row justify-center gap-2 pt-5">
					<p className="text-lg text-primary font-pregular">
						Bạn đã có tài khoản?{" "}
						<a
							href="/login"
							className="text-lg text-blue-600 font-psemibold hover:underline">
							Đăng Nhập
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
