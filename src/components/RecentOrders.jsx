import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import {
	formatToVietnamTime,
	getOrderStatus,
	renderStatus,
} from "../lib/helpers";

export default function RecentOrders({ selectedDate }) {
	const formattedDate = selectedDate
		? selectedDate.toISOString()
		: new Date().toISOString();

	const [orders, setOrders] = useState([]);
	const token = localStorage.getItem("token");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	useEffect(() => {
		console.log("selectedDate ", formattedDate);
		async function fetchOrders() {
			try {
				const response = await instance.get("/api/dashboard/recent-orders", {
					params: { selectedDate: formattedDate },
				});
				console.log("response ", response);

				setOrders(response.data);
			} catch (error) {
				console.error("Failed to fetch orders", error);
			}
		}

		fetchOrders();
	}, [selectedDate]);

	useEffect(() => {
		console.log("orders ", orders);
	}, [orders]);

	const transformDataForExport = (orders) => {
		return orders.map((item) => ({
			Mã: item?.id,
			"Tên món ăn": item?.dishesDTO?.name,
			Loại: item?.dishesDTO?.category?.name,
			"Số lượng": item?.quantity,
			"Tên khách hàng": item?.userDTO?.username,
			"Ngày đặt": formatToVietnamTime(item?.createAt),
			Giá: `${item?.price} vnđ`,
			"Trạng thái": renderStatus(item?.status),
		}));
	};

	const exportToExcel = () => {
		const transformedData = transformDataForExport(orders);
		const worksheet = XLSX.utils.json_to_sheet(transformedData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
		XLSX.writeFile(workbook, "orders.xlsx");
	};

	return (
		<div className="flex-1 mx-2">
			<div className="flex flex-row-reverse mb-4">
				<button
					onClick={exportToExcel}
					className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md">
					Xuất Excel
				</button>
			</div>

			<table class="w-full text-sm px-4 pt-3 pb-4 text-left rtl:text-right">
				<thead class="text-xs text-white uppercase  bg-slate-600 ">
					<tr>
						<th scope="col" class="px-6 py-3">
							Mã
						</th>
						<th scope="col" class="px-6 py-3">
							Tên món ăn
						</th>
						<th scope="col" class="px-6 py-3">
							Loại
						</th>
						<th scope="col" class="px-6 py-3">
							Số lượng
						</th>
						<th scope="col" class="px-6 py-3">
							Tên người đặt
						</th>
						<th scope="col" class="px-6 py-3">
							Ngày đặt
						</th>
						<th scope="col" class="px-6 py-3">
							Giá
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
								<Link to={`/order/${null}`}>#{order?.id}</Link>
							</td>
							<td className="px-6 py-4">
								<Link to={`/customer/${null}`}>{order?.dishesDTO?.name}</Link>
							</td>
							<td className="px-6 py-4">{order?.dishesDTO?.category?.name}</td>
							<td className="px-6 py-4">{order?.quantity}</td>
							<td className="px-6 py-4">
								<Link to={`/customer/${null}`}>{order?.userDTO?.username}</Link>
							</td>
							<td className="px-6 py-4">
								{formatToVietnamTime(order?.createAt)}
							</td>
							<td className="px-6 py-4">{order?.price} vnđ</td>
							<td className="px-6 py-4">{getOrderStatus(order.status)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
