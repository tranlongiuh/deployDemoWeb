import React, { useEffect, useState } from "react";
import {
	IoChevronBackOutline,
	IoChevronForwardOutline,
	IoClose,
	IoCreate,
	IoFilterCircleOutline,
	IoFilterCircleSharp,
	IoTrash,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "../axiosInstance";

const FoodManage = () => {
	const navigate = useNavigate();
	const [foods, setFoods] = useState([]);
	const [detail, setDetail] = useState({});
	const [filter, setFilter] = useState("");
	const [food, setFood] = useState({
		name: "",
		description: "",
		price: "",
		imageId: "",
		categoryId: "",
	});
	const [foodId, setFoodId] = useState("");
	const [editing, setEditing] = useState(false);

	const token = localStorage.getItem("token");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	useEffect(() => {
		console.log("detail ", detail);
	}, [detail]);

	useEffect(() => {
		if (token) {
			getFoods();

			getDetails();
		}
	}, []);
	const getDetails = async () => {
		try {
			const response = await instance.get("/api/stalls/details");
			if (response.status === 200) {
				setDetail(response.data);
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
		}
	};
	const getFoods = async () => {
		try {
			const index = localStorage.getItem("index");
			const response = await instance.get("/api/foods" + index);
			if (response.status === 200) {
				setFoods(response.data);
			}
		} catch (error) {
			console.error("Error fetching foods:", error);
		}
	};

	const getFormEditFoodById = async (id) => {
		try {
			const response = await instance.get(`/api/foods/${id}`);
			if (response.status === 200) {
				const fetchedFood = response.data;

				const foodData = {
					name: fetchedFood.name,
					description: fetchedFood.description,
					quantity: fetchedFood.quantity,
					price: fetchedFood.price,
					imageId: fetchedFood.imageId,
					categoryId: fetchedFood.category ? fetchedFood.category.id : "",
				};

				navigate("/manager/foods/form", {
					state: { food: foodData, foodId: id, editing: true },
				});
			}
		} catch (error) {
			console.error("Error fetching food by ID:", error);
		}
	};

	const deleteFood = async (id) => {
		try {
			const response = await instance.delete(`/api/foods/${id}`);
			if (response.status === 200) {
				setFoods(foods.filter((f) => f.id !== id)); // Update the list after deletion
				setFood({
					name: "",
					description: "",
					price: "",
					imageId: "",
					categoryId: "",
				});
			}
		} catch (error) {
			console.error("Error deleting food:", error);
		}
	};

	const openFormAdd = () => {
		navigate("/manager/foods/form");
	};

	const filteredFoods = foods.filter((food) => {
		if (!filter) return true;
		return food.category && food.category.name === filter;
	});

	const [currentPage, setCurrentPage] = useState(1);
	const foodsPerPage = 4; // Số hàng mỗi trang

	// Tính toán chỉ số bắt đầu và kết thúc của dữ liệu hiển thị cho trang hiện tại
	// Pagination logic
	const indexOfLastFood = currentPage * foodsPerPage;
	const indexOfFirstFood = indexOfLastFood - foodsPerPage;
	const currentFoods = filteredFoods.slice(indexOfFirstFood, indexOfLastFood);

	const nextPage = () => {
		if (currentPage < Math.ceil(filteredFoods.length / foodsPerPage)) {
			setCurrentPage(currentPage + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	return (
		<div className="w-full h-full flex font-sans text-gray-900 bg-gray-50">
			<div className="flex-1 flex flex-col pb-8 px-32">
				<div className="flex items-center justify-between py-7 px-10">
					<div>
						<h1 className="text-2xl font-semibold leading-relaxed text-gray-800">
							{detail?.name}
						</h1>
						<p className="text-sm font-medium text-gray-500">
							Hãy quản lý các món ăn tại cửa hàng của bạn ở đây!
						</p>
					</div>
					<button
						onClick={openFormAdd}
						className="inline-flex gap-x-2 items-center py-2.5 px-6 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1">
						<span className="text-sm font-semibold tracking-wide">
							Tạo món mới
						</span>
					</button>
				</div>

				{/* Table and pagination wrapper */}
				<div className="flex-1 flex flex-col justify-between">
					<div className="flex-grow">
						<table className="w-full border-b border-gray-200">
							<thead>
								<tr className="text-sm font-medium text-gray-700 border-b border-gray-200">
									<td className="pl-10">
										<div className="flex items-center gap-x-4">
											{/* select all */}
											<input
												type="checkbox"
												className="w-6 h-6 text-indigo-600 rounded-md border-gray-300"
												indeterminate="indeterminate"
											/>
											<span>Tên món</span>
										</div>
									</td>
									<td className="py-4 px-4 text-center">Loại</td>
									<td className="py-4 px-4 text-center">Giá</td>
									<td className="py-4 px-4 text-center">Còn lại</td>
									<td className="py-4 pr-10 pl-4 text-center">
										{filter === "" ? (
											<div className="">
												<IoFilterCircleOutline
													className="w-8 h-8"
													onClick={() => setFilter("Món chính")}
												/>
											</div>
										) : (
											<div className="flex">
												<IoFilterCircleSharp className="w-8 h-8" />
												<IoClose
													className="w-4 h-4 text-red-600"
													onClick={() => setFilter("")}
												/>
											</div>
										)}
									</td>
								</tr>
								{filter !== "" && (
									<tr>
										<div className="py-4 px-10">
											<div className="flex space-x-4 mt-2">
												<button
													className={`px-4 py-2 rounded ${
														filter === "Món chính"
															? "bg-indigo-600 text-white"
															: "bg-gray-200"
													}`}
													onClick={() => setFilter("Món chính")}>
													Món chính
												</button>
												<button
													className={`px-4 py-2 rounded ${
														filter === "Đồ uống"
															? "bg-indigo-600 text-white"
															: "bg-gray-200"
													}`}
													onClick={() => setFilter("Đồ uống")}>
													Đồ uống
												</button>
												<button
													className={`px-4 py-2 rounded ${
														filter === "Thức ăn vặt"
															? "bg-indigo-600 text-white"
															: "bg-gray-200"
													}`}
													onClick={() => setFilter("Thức ăn vặt")}>
													Thức ăn vặt
												</button>
											</div>
										</div>
									</tr>
								)}
							</thead>
							{currentFoods.map((food) => (
								<tbody key={food.id}>
									<tr className="hover:bg-gray-100 transition-colors group">
										<td className="flex gap-x-4 items-center py-4 pl-10">
											{/* select one */}
											<input
												type="checkbox"
												className="w-6 h-6 text-indigo-600 rounded-md border-gray-300"
											/>
											<img
												src={`http://localhost:8080/api/images/${food.imageId}`}
												alt="image"
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
											<span className="font-medium">{food.quantity}</span>
										</td>

										<td>
											<span className="inline-block w-20 group-hover:hidden"></span>
											<div className="hidden group-hover:flex group-hover:w-20 group-hover:items-center group-hover:text-gray-500 group-hover:gap-x-2">
												<button
													onClick={() => getFormEditFoodById(food.id)}
													className="p-2 hover:rounded-md hover:bg-gray-200">
													<div className="w-6 h-6 fill-current">
														<IoCreate className="text-2xl text-black" />
													</div>
												</button>
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
						<span className="text-sm">Trang {currentPage}</span>
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

export default FoodManage;
