import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { compareCurrentTime, renderStatus } from "../lib/helpers";

const OrdersManager = () => {
	const [orderItems, setOrderItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [orderItemId, setOrderItemId] = useState(""); // Track current order item being processed
	const [scanResult, setScanResult] = useState(null);
	const [isScanning, setIsScanning] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("ALL"); // State to track selected status
	const token = localStorage.getItem("token");

	// Axios instance setup
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: { Authorization: `Bearer ${token}` },
		timeout: 5000,
	});

	const sortOrders = (params) => {
		const statusOrder = {
			PROCESSING: 0,
			PAID: 1,
			WAITING: 2,
			SHIPPING: 3,
			COMPLETED: 4,
			CANCELLED: 5,
		};
		if (params.length > 1) {
			return params
				.filter((item) => item.status !== "NEW")
				.sort((a, b) => {
					if (statusOrder[a.status] !== statusOrder[b.status]) {
						return statusOrder[a.status] - statusOrder[b.status];
					}
					return new Date(a.createdAt) - new Date(b.createdAt);
				});
		}
		return params;
	};

	const filterOrders = (orders, status) => {
		if (status === "ALL") {
			return orders;
		}
		return orders.filter((item) => item.status === status);
	};

	const takeOrderItem = async (id) => {
		setIsProcessing(true);
		setOrderItemId(id);
		try {
			const response = await instance.put(`/api/order-items/making/${id}`);
			if (response.status === 200) {
				getOrderItems();
			}
		} catch (error) {
			console.error(
				"Error taking order item:",
				error.response?.data || error.message,
			);
		} finally {
			setIsProcessing(false);
			setOrderItemId(""); // Reset orderItemId after processing
		}
	};

	const finishOrderItem = async (id) => {
		setIsProcessing(true);
		setOrderItemId(id);
		try {
			const response = await instance.put(`/api/order-items/finish/${id}`);
			if (response.status === 200) {
				getOrderItems();
			}
		} catch (error) {
			console.error(
				"Error finishing order item:",
				error.response?.data || error.message,
			);
		} finally {
			setIsProcessing(false);
			setOrderItemId("");
		}
	};

	const cancelOrderItem = async (id) => {
		setIsProcessing(true);
		setOrderItemId(id);
		try {
			const response = await instance.put(`/api/order-items/cancel/${id}`);
			if (response.status === 200) {
				getOrderItems();
			}
		} catch (error) {
			console.error(
				"Error canceling order item:",
				error.response?.data || error.message,
			);
		} finally {
			setIsProcessing(false);
			setOrderItemId("");
		}
	};

	const getOrderItems = async () => {
		try {
			const response = await instance.get("/api/order-items");
			if (response.status === 200) {
				setOrderItems(sortOrders(response.data));
			}
		} catch (error) {
			console.error("Error fetching order items:", error);
		}
	};

	const transformDataForExport = (orders) => {
		return orders.map((item) => ({
			ID: item.id,
			"Thời gian đặt": item.createAt,
			"Thời gian hoàn thành": item.finishAt || "--/--",
			"Tên món": item.dishesDTO.name,
			"Số lượng": item.quantity,
			Giá: `${item.price} vnđ`,
			"Trạng thái": renderStatus(item.status),
			"Tên khách hàng": item.userDTO.username,
			"Số điện thoại": item.userDTO.phone,
			Email: item.userDTO.email,
		}));
	};

	const exportToExcel = () => {
		const filteredOrders = filterOrders(orderItems, selectedStatus);
		const transformedData = transformDataForExport(filteredOrders);
		const worksheet = XLSX.utils.json_to_sheet(transformedData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
		XLSX.writeFile(workbook, "orders.xlsx");
	};

	useEffect(() => {
		console.log("orderItems ", orderItems);
	}, [orderItems]);

	useEffect(() => {
		getOrderItems();
	}, []);

	return (
		<div className="container mt-4 mx-auto min-h-screen">
			<div className="flex flex-row">
				<div className="w-full">
					<h1 className="text-3xl font-bold mb-4">Danh sách món</h1>
					<div className="flex flex-row-reverse">
						<div className="mb-4">
							<label htmlFor="statusFilter" className="mr-2 font-bold">
								Lọc theo trạng thái:
							</label>
							<select
								id="statusFilter"
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className="p-2 border rounded">
								<option value="ALL">Tất cả</option>
								<option value="PROCESSING">Đang thực hiện</option>
								<option value="PAID">Đang chờ</option>
								<option value="WAITING">Chờ khách hàng đến lấy</option>
								<option value="SHIPPING">Đang giao cho khách</option>
								<option value="COMPLETED">Đã hoàn thành</option>
								<option value="CANCELLED">Đã bị hủy</option>
							</select>
							<button
								onClick={exportToExcel}
								className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md">
								Xuất Excel
							</button>
						</div>
					</div>

					{isLoading ? (
						<div className="text-center">
							<svg
								className="animate-spin h-10 w-10 text-gray-600 mx-auto"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8H4z"></path>
							</svg>
							<p>Loading order items...</p>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-4 pb-10">
							{filterOrders(orderItems, selectedStatus).map((item) => (
								<div
									key={item.id}
									className="border p-4 bg-white rounded-lg shadow-xl flex justify-between items-center">
									<div className="flex w-1/2">
										<div className="mr-4">
											<img
												src={`https://angelic-strength-production.up.railway.app/api/images/${item.dishesDTO.imageId}`}
												alt="Food"
												className="w-[150px] h-[150px] border border-slate-300 object-cover rounded-lg"
											/>
										</div>
										<div>
											<p className="font-bold">
												Tên món: {item.dishesDTO.name}
											</p>
											<p>Số lượng: {item.quantity}</p>
											<p>Mô tả: {item.description}</p>
											<p className="font-bold">{renderStatus(item.status)}</p>
											<div className="flex items-center">
												<p>Thời gian đặt:</p>
												<p className="p-1 rounded-md bg-blue-100 mx-2">
													{compareCurrentTime(item.createAt)}
												</p>
											</div>
											<div className="mt-1 flex items-center">
												<p>Thời gian hoàn thành:</p>
												<p className="p-1 rounded-md bg-green-100 mx-2">
													{item.finishAt
														? compareCurrentTime(item.finishAt)
														: "--/--"}
												</p>
											</div>
										</div>
									</div>
									<div className="flex h-full justify-between w-1/2 space-x-2">
										{/* Thông tin khách hàng */}
										<div className="mr-4">
											<p className="font-bold">Thông tin khách hàng</p>
											<p>Tên khách hàng: {item?.userDTO.username}</p>
											<p>Số điện thoại: {item?.userDTO.phone}</p>
											<p>Email: {item?.userDTO.email}</p>
										</div>

										<div className="flex items-center">
											{/* Conditionally render buttons based on order status */}
											{item.status === "PAID" && (
												<button
													className="bg-green-600 text-white px-4 py-2 rounded-md"
													onClick={() => takeOrderItem(item.id)}>
													{isProcessing && item.id === orderItemId
														? "Đang thực hiện..."
														: "Bắt đầu chế biến"}
												</button>
											)}

											{item.status === "PROCESSING" && (
												<>
													<button
														className="bg-blue-600 text-white px-4 py-2 rounded-md mr-2"
														onClick={() => finishOrderItem(item.id)}>
														{isProcessing && item.id === orderItemId
															? "Đang hoàn tất..."
															: "Hoàn tất chế biến"}
													</button>
													<button
														className="bg-red-600 text-white px-4 py-2 rounded-md"
														onClick={() => cancelOrderItem(item.id)}>
														{isProcessing && item.id === orderItemId
															? "Đang hủy..."
															: "Hủy chế biến"}
													</button>
												</>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrdersManager;
