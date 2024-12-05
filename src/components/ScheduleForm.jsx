import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axiosInstance";

const ScheduleForm = () => {
	const navigate = useNavigate();
	const [foods, setFoods] = useState([]);
	const [selectFoods, setSelectFoods] = useState([]); // Lưu danh sách các món đã chọn
	const [selectDay, setSelectDay] = useState("");
	const [selectAll, setSelectAll] = useState(false); // State for "Select All" checkbox
	const location = useLocation(); // Lấy vị trí hiện tại của router

	const token = localStorage.getItem("token");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	useEffect(() => {
		getFoods();
	}, [location]);

	// Lấy danh sách các món ăn từ API
	const getFoods = async () => {
		try {
			const index = localStorage.getItem("index");
			const response = await instance.get("/api/foods" + index); // Lấy tất cả các món ăn từ API
			if (response.status === 200) {
				setFoods(response.data);
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
		}
	};

	// Hàm thêm món ăn vào lịch theo ngày đã chọn
	const addFood = async () => {
		try {
			const params = new URLSearchParams();
			params.append("dishesIds", selectFoods.join(",")); // Gửi danh sách các món ăn (dishesIds) dưới dạng chuỗi phân tách bởi dấu phẩy
			params.append("day", selectDay); // Gửi ngày (day)

			const response = await instance.post(
				`/api/schedules/addDishes?${params.toString()}`,
			); // Gửi request với query parameters

			if (response.status === 200) {
				navigate("/manager/schedule");
			}
		} catch (error) {
			console.error("Error adding food:", error);
		}
	};

	// Hàm xử lý khi checkbox được thay đổi
	const handleCheckboxChange = (foodId) => {
		if (foodId === "selectAll") {
			const newSelectAll = !selectAll;
			setSelectAll(newSelectAll);
			setSelectFoods(newSelectAll ? foods.map((food) => food.id) : []);
		} else {
			if (selectFoods.includes(foodId)) {
				setSelectFoods(selectFoods.filter((id) => id !== foodId)); // Bỏ món ăn đã chọn
			} else {
				setSelectFoods([...selectFoods, foodId]); // Thêm món ăn vào danh sách đã chọn
			}
		}
	};

	return (
		<form
			className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				addFood();
			}}>
			<h2 className="text-2xl font-semibold text-gray-700 mb-6">
				Thêm món ăn vào lịch
			</h2>

			{/* Hiển thị danh sách món ăn bằng bảng */}
			<div className="overflow-x-auto">
				<table className="min-w-full table-auto">
					<thead>
						<tr>
							<th className="px-4 py-2">
								<input
									type="checkbox"
									checked={selectAll}
									onChange={() => handleCheckboxChange("selectAll")}
								/>
							</th>
							<th className="px-4 py-2">Tên món ăn</th>
							<th className="px-4 py-2">Mô tả</th>
						</tr>
					</thead>
					<tbody>
						{foods.map((food) => (
							<tr key={food.id}>
								<td className="border px-4 py-2">
									<input
										type="checkbox"
										checked={selectFoods.includes(food.id)} // Kiểm tra món ăn đã được chọn chưa
										onChange={() => handleCheckboxChange(food.id)} // Xử lý khi chọn checkbox
									/>
								</td>
								<td className="border px-4 py-2">{food.name}</td>
								<td className="border px-4 py-2">{food.description}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Chọn ngày */}
			<div className="space-y-2">
				<label className="block text-gray-600">Chọn ngày</label>
				<select
					value={selectDay} // Giữ giá trị ngày đã chọn
					onChange={(e) => setSelectDay(e.target.value)} // Cập nhật giá trị ngày đã chọn
					className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
					<option value="">Chọn ngày</option>
					<option value={1}>Thứ 2</option>
					<option value={2}>Thứ 3</option>
					<option value={3}>Thứ 4</option>
					<option value={4}>Thứ 5</option>
					<option value={5}>Thứ 6</option>
					<option value={6}>Thứ 7</option>
					<option value={7}>Chủ nhật</option>
				</select>
			</div>

			{/* Nút thêm món */}
			<button
				type="submit"
				className="w-full bg-green-600
                 text-white py-2 rounded-lg hover:bg-green-400 transition duration-300">
				Thêm món ăn
			</button>
		</form>
	);
};

export default ScheduleForm;
