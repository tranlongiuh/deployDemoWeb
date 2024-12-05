import axios from "axios";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import Navbar from "../../components/Navbar";

const FindCustomerPage = () => {
	const token = localStorage.getItem("token");
	const index = localStorage.getItem("index");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const [username, setUsername] = useState("");
	const [customer, setCustomer] = useState({});
	const [money, setMoney] = useState("");

	const [error, setError] = useState("");

	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);
	const depositCustomer = async () => {
		if (!customer.id || money <= 0) {
			return;
		}

		setLoading2(true);
		try {
			const formData = new FormData();
			formData.append("idUser", customer.id);
			formData.append("money", money);
			const response = await instance.post("/api/cashier/deposit", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 200) {
				console.log("recall");

				findCustomer(customer.username);
				setMoney("");
			}
		} catch (error) {
			if (error.response) {
				const { status, data } = error.response;

				if (status === 404) {
					setError(data || "Tài khoản không tồn tại!");
					setCustomer({});
				} else {
					setError("Đã xảy ra lỗi không xác định.");
					setCustomer({});
				}
			} else {
				setError("Không thể kết nối đến server.");
			}
		} finally {
			setLoading2(false);
		}
	};
	const findCustomer = async () => {
		setError("");
		setLoading(true);
		const usernameRegex = /^([a-zA-Z0-9]{8,})$/;

		if (!usernameRegex.test(username)) {
			setError(
				"Tên người dùng phải dài ít nhất 8 ký tự và không chứa ký tự đặc biệt.",
			);
			setCustomer({});
			setLoading(false);
			return;
		}

		try {
			const response = await instance.get("/api" + index + `/find/${username}`);

			if (response.status === 200) {
				setCustomer(response.data);
				console.log("response.data ", response.data);
			}
		} catch (error) {
			if (error.response) {
				const { status, data } = error.response;

				if (status === 404) {
					setError(data || "Tài khoản không tồn tại!");
					setCustomer({});
				} else {
					setError("Đã xảy ra lỗi không xác định.");
					setCustomer({});
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
			findCustomer(e);
		}
	};
	return (
		<div>
			<Navbar />
			<div className="m-10 items-center justify-center h-screen">
				<div className="text-3xl font-bold">Tài khoản đã chọn</div>

				<div className="flex w-full ">
					<div className="w-full p-5 border-4 border-double rounded-lg border-sky-500">
						<div className="flex my-2">
							<p className="text-lg font-bold">Tên tài khoản: </p>
							<p className="ml-2 text-lg">{customer.username}</p>
						</div>

						<div className="flex my-2">
							<p className="text-lg font-bold">Email: </p>
							<p className="ml-2 text-lg">{customer.email}</p>
						</div>
						<div className="flex my-2">
							<p className="text-lg font-bold">Số dư: </p>
							{customer.balance ? (
								<p className="ml-2 text-lg">{customer.balance} vnđ</p>
							) : (
								<p className="ml-2 text-lg">0 vnđ</p>
							)}
						</div>
						<div className="flex w-full justify-center items-center">
							<div className="">
								<FormField
									title="Số tiền"
									value={money}
									handleChangeText={(e) => setMoney(e)}
									otherStyles="mt-7 w-[500px]"
									onKeyDown={handleKeyDown}
								/>
								<div className="flex justify-end">
									{!loading2 && (
										<CustomButton
											title="Nạp tiền"
											handlePress={depositCustomer}
											containerStyles="mt-7"
											disabled={loading2}
										/>
									)}
									{loading2 && (
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
					</div>

					<div className="p-10 bg-white border-4 w-[500px] border-double rounded-lg border-sky-500">
						{error && (
							<div className="mt-2 text-center text-red-500">{error}</div>
						)}
						<div>
							<h1>Tìm kiếm</h1>
							<FormField
								title="Tài khoản"
								value={username}
								handleChangeText={(e) => setUsername(e)}
								otherStyles="mt-7"
								onKeyDown={handleKeyDown}
							/>
						</div>
						<div className="flex items-center justify-center w-full">
							{!loading && (
								<CustomButton
									title="Tìm"
									handlePress={findCustomer}
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
			</div>
		</div>
	);
};

export default FindCustomerPage;
