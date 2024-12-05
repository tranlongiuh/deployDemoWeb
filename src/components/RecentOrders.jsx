import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatToVietnamTime, getOrderStatus } from "../lib/helpers";

export default function RecentOrders() {
	const token = localStorage.getItem("token");
	const index = localStorage.getItem("index");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		async function fetchOrders() {
			try {
				const response = await instance.get("/api/dashboard/recent-orders");

				setOrders(response.data);
			} catch (error) {
				console.error("Failed to fetch orders", error);
			}
		}

		fetchOrders();
		console.log("orders ", orders);
	}, []);
	return (
		<div className="flex-1 mx-2">
			<table class="w-full text-sm px-4 pt-3 pb-4 text-left rtl:text-right">
				<thead class="text-xs text-white uppercase  bg-slate-600 ">
					<tr>
						<th scope="col" class="px-6 py-3">
							ID
						</th>
						<th scope="col" class="px-6 py-3">
							Tên khách hàng
						</th>
						<th scope="col" class="px-6 py-3">
							Ngày đặt
						</th>
						<th scope="col" class="px-6 py-3">
							Tổng đơn hàng
						</th>
						<th scope="col" class="px-6 py-3">
							Địa chỉ
						</th>
						<th scope="col" class="px-6 py-3">
							Trạng thái
						</th>
					</tr>
				</thead>

				<tbody>
					{orders.map((order) => (
						<tr key={order.id} class="odd:bg-white even:bg-gray-200  border-b ">
							<td className="px-6 py-4">
								<Link to={`/order/${null}`}>#{order.id}</Link>
							</td>
							<td className="px-6 py-4">
								<Link to={`/customer/${null}`}>{order.userDTO.username}</Link>
							</td>
							<td className="px-6 py-4">
								{formatToVietnamTime(order.createdAt)}
							</td>
							<td className="px-6 py-4">{order.totalPrice}</td>
							<td className="px-6 py-4">{order.address}</td>
							<td className="px-6 py-4">{getOrderStatus(order.status)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
