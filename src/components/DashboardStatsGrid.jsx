import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoBagHandle, IoCart, IoPeople } from "react-icons/io5";

export default function DashboardStatsGrid() {
	const token = localStorage.getItem("token");
	const index = localStorage.getItem("index");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const [stats, setStats] = useState({
		totalSales: 0,
		totalExpenses: 0,
		totalCustomers: 0,
		totalOrders: 0,
	});

	useEffect(() => {
		async function fetchStats() {
			try {
				const response = await instance.get("/api/dashboard/stats");
				setStats(response.data);
			} catch (error) {
				console.error("Failed to fetch stats", error);
			}
		}

		fetchStats();
	}, []);
	useEffect(() => {
		console.log("stats ", stats);
	}, [stats]);
	return (
		<div className="container mx-auto">
			<p className="text-3xl mb-2">Thống kê trong ngày</p>

			<div className="flex gap-4 p-4 rounded-xl mx-2 bg-white">
				<BoxWrapper>
					<div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500">
						<IoBagHandle className="text-2xl text-white" />
					</div>
					<div className="pl-4">
						<span className="text-sm text-gray-500 font-light">Doanh số</span>
						<div className="flex items-center">
							<strong className="text-xl text-gray-700 font-semibold">
								{stats.totalSales} vnđ
							</strong>
						</div>
					</div>
				</BoxWrapper>
				<BoxWrapper>
					<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400">
						<IoPeople className="text-2xl text-white" />
					</div>
					<div className="pl-4">
						<span className="text-sm text-gray-500 font-light">
							Số lượng khách hàng
						</span>
						<div className="flex items-center">
							<strong className="text-xl text-gray-700 font-semibold">
								{stats.totalCustomers}
							</strong>
						</div>
					</div>
				</BoxWrapper>
				<BoxWrapper>
					<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green">
						<IoCart className="text-2xl" />
					</div>
					<div className="pl-4">
						{index === "/manager" ? (
							<span className="text-sm text-gray-500 font-light">
								Số món đã bán
							</span>
						) : (
							<span className="text-sm text-gray-500 font-light">
								Số lượng đơn đặt
							</span>
						)}
						<div className="flex items-center">
							<strong className="text-xl text-gray-700 font-semibold">
								{stats.totalOrders}
							</strong>
						</div>
					</div>
				</BoxWrapper>
			</div>
		</div>
	);
}

function BoxWrapper({ children }) {
	return (
		<div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center">
			{children}
		</div>
	);
}
