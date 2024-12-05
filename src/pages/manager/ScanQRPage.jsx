import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { formatToVietnamTime, renderStatus } from "../../lib/helpers";

const ScanQRPage = () => {
	const [isScanning, setIsScanning] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [orderItems, setOrderItems] = useState([]);
	const [scanResult, setScanResult] = useState(null);
	const token = localStorage.getItem("token");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: { Authorization: `Bearer ${token}` },
		timeout: 5000,
	});
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
	const startScan = () => {
		setScanResult(null);
		setIsScanning(true);
	};

	const stopScan = () => {
		setIsScanning(false);
	};
	const scannerRef = useRef(null);
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
	useEffect(() => {
		const checkCameraAvailability = async () => {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter(
					(device) => device.kind === "videoinput",
				);
				if (videoDevices.length > 0) {
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
								setScanResult(
									"Không thể khởi động máy quét. Vui lòng kiểm tra lại camera.",
								);
								setIsScanning(false);
							});
					}
				} else {
					console.warn("No camera found.");
					setScanResult(
						"Không tìm thấy camera. Vui lòng kiểm tra lại thiết bị.",
					);
					setIsScanning(false);
				}
			} catch (error) {
				console.error("Error checking camera availability:", error);
				setScanResult("Lỗi khi kiểm tra camera. Vui lòng thử lại.");
				setIsScanning(false);
			}
		};

		checkCameraAvailability();

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
	return (
		<div>
			<Navbar />

			<div className="container mt-4 mx-auto">
				<div className="flex flex-row">
					<div className="w-3/4">
						<h1 className="text-2xl font-bold mb-4">Danh sách món</h1>
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
													src={`https://angelic-strength-production.up.railway.app/api/images/${item.dishesDTO.imageId}`}
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
												<p>
													Thời gian đặt: {formatToVietnamTime(item.createAt)}
												</p>
												<p>
													Thời gian hoàn thành:{" "}
													{item.finishAt
														? formatToVietnamTime(item.finishAt)
														: "---"}
												</p>
											</div>
										</div>
										<div className="space-x-2">
											{item.status === "WAITING" && (
												<button
													className="bg-green-600 text-white px-4 py-2 rounded-md"
													onClick={() => giveOrderItem(item.id)}>
													Giao món
												</button>
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
		</div>
	);
};

export default ScanQRPage;
