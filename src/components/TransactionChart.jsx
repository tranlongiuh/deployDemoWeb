import axios from "axios";
import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

export default function TransactionChart() {
	const token = localStorage.getItem("token");
	const index = localStorage.getItem("index");
	const instance = axios.create({
		baseURL: "http://localhost:8080/",
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
		<div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
			<strong className="text-gray-700 font-medium">Biểu đồ giao dịch</strong>
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
