import React, { useEffect, useState } from "react";
import {
	IoChevronBackOutline,
	IoChevronForwardOutline,
	IoTrash,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";

const ScheduleManage = () => {
	const navigate = useNavigate();
	const [selectedDayId, setSelectedDayId] = useState(1);
	const [checkedItems, setCheckedItems] = useState({});
	const [foods, setFoods] = useState([]);
	const [stallDetails, setStallDetails] = useState({});
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const foodsPerPage = 3;

	const token = localStorage.getItem("token");

	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const getDetails = async () => {
		try {
			const response = await instance.get("/api/stalls/details");
			if (response.status === 200) {
				setStallDetails(response.data);
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
		}
	};

	const getFoods = async (id) => {
		setLoading(true);
		setCheckedItems({}); // Reset checkedItems khi tải món ăn mới
		try {
			const response = await instance.get(`/api/schedules/${id}`);
			if (response.status === 200) {
				console.log(response.data);

				setFoods(response.data.dishesDTOS);
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log(token);
		getDetails();
		selectDay(1);
	}, []);

	const selectDay = (id) => {
		setSelectedDayId(id);
		setCurrentPage(1); // Reset to first page
		getFoods(id);
	};

	const deleteFood = async (id) => {
		try {
			const foodInSchedule = { dishesIds: id, day: selectedDayId };
			const response = await instance.delete(`/api/schedules/removeDishes`, {
				params: foodInSchedule,
			});
			if (response.status === 200) {
				setFoods(foods.filter((f) => f.id !== id));
			}
		} catch (error) {
			console.error("Error deleting food:", error);
		}
	};

	const deleteAllFoods = async () => {
		const confirmed = window.confirm(
			"Bạn có chắc chắn muốn xóa tất cả các món ăn đã chọn?",
		);
		if (confirmed) {
			const idsToDelete = foods
				.filter((food) => checkedItems[food.id]) // Get IDs of checked items
				.map((food) => food.id);

			for (const id of idsToDelete) {
				await deleteFood(id);
			}
			setCheckedItems({}); // Reset checkedItems sau khi xóa
		}
		selectDay(selectedDayId);
	};

	const indexOfLastFood = currentPage * foodsPerPage;
	const indexOfFirstFood = indexOfLastFood - foodsPerPage;
	const currentFoods = foods.slice(indexOfFirstFood, indexOfLastFood);

	const nextPage = () => {
		if (currentPage < Math.ceil(foods.length / foodsPerPage)) {
			setCurrentPage(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	// Check if all checkboxes are checked
	const allChecked =
		Object.keys(checkedItems).length === foods.length &&
		Object.values(checkedItems).every((value) => value === true);

	// Handle check/uncheck all
	const handleCheckAll = (event) => {
		const isChecked = event.target.checked;
		const newCheckedItems = {};
		foods.forEach((food) => {
			newCheckedItems[food.id] = isChecked; // Set state for each food item based on ID
		});
		setCheckedItems(newCheckedItems);
	};

	// Handle individual checkbox toggle
	const handleCheckItem = (id) => {
		const newCheckedItems = { ...checkedItems };
		newCheckedItems[id] = !newCheckedItems[id]; // Toggle the checkbox state
		setCheckedItems(newCheckedItems);
	};

	const openFormAdd = () => {
		navigate("/manager/schedule/form");
	};

	return (
		<div className="w-full h-full flex font-sans text-gray-900 bg-slate-400">
			<div className="flex-1 flex flex-col pb-8 px-32">
				{/* Header Section */}
				<div className="flex items-center justify-between py-7 px-10">
					<div>
						<h1 className="text-2xl font-semibold leading-relaxed text-gray-800">
							{stallDetails?.name}
						</h1>
						<p className="text-sm font-medium text-gray-500">
							Hãy quản lý các món ăn tại cửa hàng của bạn ở đây!
						</p>
					</div>
					<button
						onClick={() => {
							openFormAdd();
						}}
						className="inline-flex gap-x-2 items-center py-2.5 px-6 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
						<span className="text-sm font-semibold tracking-wide">
							Thêm món món mới
						</span>
					</button>
				</div>

				{/* Day Selection */}
				<div className="flex flex-row">
					{Array.from({ length: 7 }, (_, index) => index + 1).map((day) => {
						const currentDay = new Date().getDay(); // Lấy chỉ số ngày hiện tại (0-6)
						const isCurrentDay = day === (currentDay === 0 ? 7 : currentDay); // Chuyển đổi Chủ nhật thành 7
						const isTomorrow =
							day === ((currentDay + 1) % 7 === 0 ? 7 : (currentDay + 1) % 7); // Kiểm tra ngày mai

						return (
							<button
								key={day}
								id={day.toString()}
								onClick={() => selectDay(day)}
								className={`flex flex-col w-40 pl-5 py-3 mr-3 rounded-tl-2xl rounded-tr-2xl ${
									selectedDayId === day
										? "bg-white text-blue-1"
										: isCurrentDay
										? "bg-orange-500 text-white" // Màu nền màu cam cho ngày hiện tại
										: isTomorrow
										? "bg-green-500 text-white" // Màu nền màu xanh lá cho ngày mai
										: "bg-blue-500 text-white"
								} shadow-active`}>
								<span className="text-3xl font-bold"></span>
								<span className="text-md font-semibold">
									{day === 7 ? "Chủ nhật" : `Thứ ${day + 1}`}
								</span>
							</button>
						);
					})}
				</div>

				{/* Food Table */}
				<div className="flex-1 flex flex-col justify-between bg-white ">
					<div className="flex-grow">
						<table className="w-full border-b border-gray-200">
							<thead>
								<tr className="text-sm font-medium text-gray-700 border-b border-gray-200">
									<td className="pl-10">
										<div className="flex items-center gap-x-4">
											<input
												type="checkbox"
												className="w-6 h-6 text-indigo-600 rounded-md border-gray-300"
												onChange={handleCheckAll} // Handle checking all
												checked={allChecked} // Thay đổi ở đây
											/>
											<span>Tên món</span>
										</div>
									</td>
									<td className="py-4 px-4 text-center">Loại</td>
									<td className="py-4 px-4 text-center">Giá</td>
									<td className="py-4 px-4 text-center">Đánh giá</td>
									<td className="py-4 pr-10 pl-4 text-center">
										<div className="w-6 h-6 fill-current">
											<button
												onClick={() => {
													deleteAllFoods();
												}}
												className="p-2 hover:rounded-md hover:bg-gray-200">
												<div className="w-6 h-6 fill-current">
													<IoTrash className="text-2xl text-black" />
												</div>
											</button>
										</div>
									</td>
								</tr>
							</thead>
							{currentFoods.map((food) => (
								<tbody key={food.id}>
									<tr className="hover:bg-gray-100 transition-colors group">
										<td className="flex gap-x-4 items-center py-4 pl-10">
											<input
												type="checkbox"
												className="w-6 h-6 text-indigo-600 rounded-md border-gray-300"
												checked={!!checkedItems[food.id]} // Lấy trạng thái từ checkedItems dựa trên ID
												onChange={() => handleCheckItem(food.id)} // Sử dụng ID thay vì index
											/>
											<img
												src={`https://angelic-strength-production.up.railway.app/api/images/${food.imageId}`}
												alt=""
												className="w-40 aspect-[3/2] rounded-lg object-cover object-top border border-gray-200"
											/>
											<div>
												<a
													href="#"
													className="text-lg font-semibold text-gray-700">
													{food.name}
												</a>
												<div className="font-medium text-gray-400">
													{food.description}
												</div>
											</div>
										</td>
										<td className="font-medium text-center">
											{food.category ? food.category.name : "No category"}
										</td>
										<td className="font-medium text-center">
											{food.price} vnđ
										</td>
										<td className="text-center">
											<span className="font-medium">*</span>
											<span className="text-gray-400">/5</span>
										</td>

										<td>
											<span className="inline-block w-20 group-hover:hidden"></span>
											<div className="hidden group-hover:flex group-hover:w-20 group-hover:items-center group-hover:text-gray-500 group-hover:gap-x-2">
												<button
													onClick={() => {
														console.log("deleteFood ", food.id);
														const confirmed = window.confirm(
															"Bạn có chắc chắn muốn xóa món ăn này?",
														);
														if (confirmed) {
															deleteFood(food.id);
														}
													}}
													className="p-2 hover:rounded-md hover:bg-gray-200">
													<div className="w-6 h-6 fill-current">
														<IoTrash className="text-2xl text-black" />
													</div>
												</button>
											</div>
										</td>
									</tr>
								</tbody>
							))}
						</table>
					</div>

					{/* Pagination controls */}
					<div className="flex justify-between mt-4">
						<button
							onClick={prevPage}
							disabled={currentPage === 1}
							className={`px-4 py-2 border rounded-md ${
								currentPage === 1
									? "bg-gray-300 cursor-not-allowed"
									: "bg-blue-500 text-white"
							}`}>
							<IoChevronBackOutline />
						</button>

						{/* Hiển thị số trang hiện tại / tổng số trang */}
						<span className="text-sm">
							Trang {currentPage} / {Math.ceil(foods.length / foodsPerPage)}
						</span>

						<button
							onClick={nextPage}
							disabled={currentPage === Math.ceil(foods.length / foodsPerPage)}
							className={`px-4 py-2 border rounded-md ${
								currentPage === Math.ceil(foods.length / foodsPerPage)
									? "bg-gray-300 cursor-not-allowed"
									: "bg-blue-500 text-white"
							}`}>
							<IoChevronForwardOutline />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScheduleManage;
