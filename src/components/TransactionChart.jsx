import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export default function TransactionChart() {
	const token = localStorage.getItem("token");
	const index = localStorage.getItem("index");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const [data, setData] = useState([]);

	useEffect(() => {
		async function fetchStats() {
			try {
				const response = await instance.get("/api/dashboard/transactions");
				setData(response.data);
				console.log("data ", data);
			} catch (error) {
				console.error("Failed to fetch stats", error);
			}
		}

		fetchStats();
	}, []);
	return (
		<div className="h-[22rem] bg-white border border-gray-200 flex flex-col flex-1 container mx-auto p-4 rounded-xl">
			<strong className="text-gray-700 font-medium">Thống kê theo tháng</strong>
			<div className="mt-3 w-full flex-1 text-xs">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						width={500}
						height={300}
						data={data}
						margin={{
							top: 20,
							right: 10,
							left: -10,
							bottom: 0,
						}}>
						<CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
						<XAxis dataKey="month" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Bar name="Thu nhập" dataKey="income" fill="#0ea5e9" />
						{/* <Bar name="Phí dịch vụ" dataKey="expense" fill="#ea580c" /> */}
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
