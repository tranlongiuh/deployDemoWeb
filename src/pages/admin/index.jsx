import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const AdminIndexPage = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const index = localStorage.getItem("index");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const [stalls, setStalls] = useState([]);
	const [isInputting, setIsInputting] = useState(false);
	const [inputFee, setInputFee] = useState(0);

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1);
	const stallsPerPage = 6;

	// Calculate current stalls for display
	const indexOfLastStall = currentPage * stallsPerPage;
	const indexOfFirstStall = indexOfLastStall - stallsPerPage;
	const currentStalls = stalls.slice(indexOfFirstStall, indexOfLastStall);

	const getStallStat = async () => {
		try {
			const response = await instance.get("/api" + index + "/stallStat");
			if (response.status === 200) {
				setStalls(response.data);
			}
		} catch (error) {
			console.error("Error fetching stalls:", error);
		}
	};

	useEffect(() => {
		getStallStat();
	}, []);

	const editFee = () => {
		setIsInputting(!isInputting);
	};

	const createStall = () => {
		navigate("/admin/createStall", { state: { canteenSize: stalls.length } });
	};

	const setFee = async () => {
		try {
			const formData = new FormData();
			formData.append("fee", inputFee);
			const response = await instance.put(
				"/api" + index + "/setFee",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			if (response.status === 200) {
				getStallStat();
				setIsInputting(false);
			}
		} catch (error) {
			console.error("Error setting fee:", error);
		}
	};

	const resetPassword = async (id) => {
		try {
			const response = await instance.put(
				"/api" + index + "/resetPassword/" + id,
			);
			if (response.status === 200) {
				alert("Đặt lại mật khẩu thành công!");
			}
		} catch (error) {
			console.error("Error resetting password:", error);
		}
	};

	// Pagination controls
	const nextPage = () => {
		if (currentPage < Math.ceil(stalls.length / stallsPerPage)) {
			setCurrentPage(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<div className="h-screen flex flex-col gap-4">
			<Navbar />
			<div className="container mx-auto px-4">
				<div className="flex justify-between m-2">
					<h1 className="text-2xl font-bold mb-4">Quản lý căng tin</h1>
					<div>
						<button
							className="bg-green-600 p-2 rounded-xl font-bold text-white mr-2"
							onClick={editFee}>
							Sửa phí
						</button>
						<button
							className="bg-green-600 p-2 rounded-xl font-bold text-white"
							onClick={createStall}>
							Tạo gian hàng
						</button>
					</div>
				</div>
				{isInputting && (
					<div className="flex justify-between m-2">
						<input
							className="w-full border-2 text-xl border-black rounded-xl p-1"
							type="number"
							onChange={(e) => setInputFee(e.target.value)}
						/>
						<button
							className="ml-2 w-[100px] bg-green-600 text-white p-2 rounded-xl"
							onClick={setFee}>
							Sửa phí
						</button>
					</div>
				)}

				{/* Table to display stall data */}
				<table className="min-w-full bg-white border-collapse border border-gray-300">
					<thead>
						<tr>
							<th className="border border-gray-300 px-4 py-2">Mã</th>
							<th className="border border-gray-300 px-4 py-2">Tên</th>
							<th className="border border-gray-300 px-4 py-2">Tên quản lý</th>
							<th className="border border-gray-300 px-4 py-2">Doanh thu</th>
							<th className="border border-gray-300 px-4 py-2">Phí dịch vụ</th>
							<th className="border border-gray-300 px-4 py-2">
								Đặt lại mật khẩu
							</th>
						</tr>
					</thead>
					<tbody>
						{currentStalls.map((stall) => (
							<tr key={stall.id}>
								<td className="border border-gray-300 px-4 py-2">{stall.id}</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall.name}
								</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall?.manager.username}
								</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall?.manager.balance} Vnđ
								</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall.serviceFee} %
								</td>
								<td className="flex justify-center items-center border border-gray-300 py-2">
									<button
										onClick={() => resetPassword(stall?.manager.id)}
										className="bg-slate-300 rounded-xl m-2 p-2 hover:bg-orange-500">
										Đặt lại
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Pagination controls */}
				<div className="flex justify-between mt-4">
					<button
						onClick={prevPage}
						disabled={currentPage === 1}
						className={`px-4 py-2 border rounded-md ${
							currentPage === 1
								? "bg-gray-300 cursor-not-allowed"
								: "bg-blue-500 text-white"
						}`}>
						Trước
					</button>
					<span className="text-sm">Trang {currentPage}</span>
					<button
						onClick={nextPage}
						disabled={currentPage === Math.ceil(stalls.length / stallsPerPage)}
						className={`px-4 py-2 border rounded-md ${
							currentPage === Math.ceil(stalls.length / stallsPerPage)
								? "bg-gray-300 cursor-not-allowed"
								: "bg-blue-500 text-white"
						}`}>
						Sau
					</button>
				</div>
			</div>
		</div>
	);
};

export default AdminIndexPage;
