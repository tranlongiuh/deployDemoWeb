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

	const getStallStat = async () => {
		try {
			const response = await instance.get("/api" + index + "/stallStat");
			if (response.status === 200) {
				setStalls(response.data);
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
		} finally {
			console.log("stalls ", stalls);
		}
	};

	useEffect(() => {
		console.log("stalls ", stalls);
	}, [stalls]);

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
				console.log("fee is set");
				setIsInputting(!isInputting);
				getStallStat();
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
		} finally {
			console.log("stalls ", stalls);
		}
	};

	useEffect(() => {
		console.log("token ", token);
		console.log("index ", index);

		getStallStat();
	}, []);

	return (
		<div className=" h-screen flex flex-col gap-4">
			<Navbar />
			<div className="container mx-auto px-4">
				<div className="flex justify-between m-2">
					<h1 className="text-2xl font-bold mb-4">Quản lý gian hàng</h1>
					<div>
						<button
							className="bg-green-600 p-2 rounded-xl  font-bold text-white mr-2"
							onClick={() => editFee()}>
							Sửa phí
						</button>
						<button
							className="bg-green-600 p-2 rounded-xl font-bold text-white"
							onClick={() => createStall()}>
							Tạo gian hàng
						</button>
					</div>
				</div>
				{isInputting && (
					<div className="flex justify-between m-2">
						<input
							className="w-full  border-2 text-xl border-black rounded-xl p-1"
							type="number"
							onChange={(e) => setInputFee(e.target.value)}
						/>
						<button
							className="ml-2 w-[100px] bg-green p-2 rounded-xl"
							onClick={() => setFee()}>
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
						</tr>
					</thead>
					<tbody>
						{stalls.map((stall) => (
							<tr key={stall.id}>
								<td className="border border-gray-300 px-4 py-2">{stall.id}</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall.name}
								</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall?.manager.username}
								</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall.revenue} Vnđ
								</td>
								<td className="border border-gray-300 px-4 py-2">
									{stall.serviceFee} %
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default AdminIndexPage;
