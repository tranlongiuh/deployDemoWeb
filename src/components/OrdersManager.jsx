import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useRef, useState } from "react";
import { formatToVietnamTime, renderStatus } from "../lib/helpers";

const OrdersManager = () => {
	const [orderItems, setOrderItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [orderItemId, setOrderItemId] = useState(""); // Track current order item being processed
	const [scanResult, setScanResult] = useState(null);
	const [isScanning, setIsScanning] = useState(false);

	const token = localStorage.getItem("token");

	// Axios instance setup
	const instance = axios.create({
		baseURL: "http://localhost:8080/",
		headers: { Authorization: `Bearer ${token}` },
		timeout: 5000,
	});

	// Function to sort and filter orders
	const sortOrders = (params) => {
		if (params.length > 1) {
			return params
				.filter((item) => item.status !== "NEW") // Filter out "NEW" status items
				.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort by createdAt date
		}
		return params;
	};

	// Function to initiate order processing
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

	// Function to complete the order
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

	// Cancel an order item
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

	// Fetch order items from API
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

	// Function to handle giving an order item
	const giveOrderItem = async (id) => {
		try {
			const response = await instance.post(`/api/order-items/give/${id}`);
			if (response.status === 200) {
				// Remove the given item from the orderItems list
				setOrderItems(orderItems.filter((item) => item.id !== id));
			}
		} catch (error) {
			console.error("Error giving order item:", error);
		}
	};

	// Initialize QR code scanner
	const scannerRef = useRef(null);

	useEffect(() => {
		if (isScanning && !scannerRef.current) {
			scannerRef.current = new Html5Qrcode("reader");
			scannerRef.current
				.start(
					{ facingMode: "environment" },
					{
						qrbox: { width: 200, height: 200 },
						fps: 5,
					},
					handleSuccess,
				)
				.catch((err) => {
					console.warn("Scanner start failed:", err);
					setIsScanning(false);
				});
		}

		return () => {
			if (scannerRef.current) {
				scannerRef.current
					.stop()
					.then(() => {
						scannerRef.current.clear();
						scannerRef.current = null;
					})
					.catch((err) => console.warn("Stop failed:", err));
			}
		};
	}, [isScanning]);

	const handleSuccess = async (result) => {
		try {
			const parsedData = JSON.parse(result);
			const formData = new FormData();
			formData.append("idOrder", parsedData.orderDataJson);
			formData.append("signature", parsedData.signature);

			const response = await instance.post(
				"/api/order-items/verify",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				},
			);
			if (response.status === 200) {
				console.log("response.data scan ", response.data);

				setOrderItems(response.data);
			}
		} catch (error) {
			console.error("Verification failed:", error);
			setScanResult(
				"Bạn không có món nào tại gian hàng này. Vui lòng kiểm tra lại",
			);
		}
		setIsScanning(false);
	};

	// Start and stop scanning handlers
	const startScan = () => {
		setScanResult(null);
		setIsScanning(true);
	};

	const stopScan = () => {
		setIsScanning(false);
	};

	useEffect(() => {
		getOrderItems();
	}, []);

	return (
		<div className="container mt-4 mx-auto">
			<div className="flex flex-row">
				<div className="w-3/4">
					<h1 className="text-2xl font-bold mb-4">
						Danh sách món chờ thực hiện
					</h1>
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
						<div className="grid grid-cols-1 gap-4">
							{orderItems.map((item) => (
								<div
									key={item.id}
									className="border p-4 rounded-lg shadow-md flex justify-between items-center">
									<div className="flex ">
										<div className="mr-4">
											<img
												src={`http://localhost:8080/api/images/${item.dishesDTO.imageId}`}
												alt="Food"
												className="w-32 h-32 object-cover rounded-lg mb-2"
											/>
										</div>
										<div>
											<p className="font-bold">
												Tên món: {item.dishesDTO.name}
											</p>
											<p>Số lượng: {item.quantity}</p>
											<p>Mô tả: {item.description}</p>
											<p>{renderStatus(item.status)}</p>
											<p>Thời gian đặt: {formatToVietnamTime(item.createAt)}</p>
											<p>
												Thời gian hoàn thành:{" "}
												{item.finishAt
													? formatToVietnamTime(item.finishAt)
													: "---"}
											</p>
										</div>
									</div>
									<div className="space-x-2">
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
										{item.status === "WAITING" && (
											<button
												className="bg-green-600 text-white px-4 py-2 rounded-md"
												onClick={() => giveOrderItem(item.id)}>
												Giao món
											</button>
										)}
										{item.status === "PROCESSING" && (
											<>
												<button
													className="bg-blue-600 text-white px-4 py-2 rounded-md"
													onClick={() => finishOrderItem(item.id)}>
													{isProcessing && item.id === orderItemId
														? "Đang hoàn tất..."
														: "Hoàn tất"}
												</button>
												<button
													className="bg-red-600 text-white px-4 py-2 rounded-md"
													onClick={() => cancelOrderItem(item.id)}>
													{isProcessing && item.id === orderItemId
														? "Đang hủy..."
														: "Hủy món"}
												</button>
											</>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="w-1/4 p-4 border rounded-xl shadow-md">
					<div className="mb-4">
						<h2 className="text-xl font-bold mb-2">Quét nhận đơn</h2>
						<div id="reader" style={{ width: "100%", height: "250px" }}></div>
					</div>
					<p className="font-black text-red-500"> {scanResult}</p>
					<div className="flex flex-row justify-end">
						{!isScanning && (
							<button
								className="bg-green-600 text-white px-4 py-2 rounded-md mr-2"
								onClick={startScan}>
								Quét mã QR
							</button>
						)}

						{isScanning && (
							<button
								className="bg-red-600 text-white px-4 py-2 rounded-md"
								onClick={stopScan}>
								Dừng quét
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrdersManager;
