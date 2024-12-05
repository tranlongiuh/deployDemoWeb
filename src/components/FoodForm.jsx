import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../axiosInstance";

const FoodForm = () => {
	const [categories, setCategories] = useState([]);
	const [food, setFood] = useState({
		name: "",
		description: "",
		price: "",
		quantity: "", // Khởi tạo quantity
		image: null,
		categoryId: "",
	});
	const [foodId, setFoodId] = useState("");
	const [editing, setEditing] = useState(false);
	const [currentImageId, setCurrentImageId] = useState("");

	const location = useLocation();
	const navigate = useNavigate();

	const token = localStorage.getItem("token");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	useEffect(() => {
		if (location.state?.editing) {
			const { food, foodId } = location.state;
			setFoodId(foodId);
			setFood(food);
			setEditing(true);
			setCurrentImageId(food.imageId);
		}
		getCategories();
	}, [location]);

	const getCategories = async () => {
		try {
			const response = await instance.get("/api/categories");
			if (response.status === 200) {
				console.log("Fetched categories:", response.data);
				setCategories(response.data);
			}
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		const { name, description, price, categoryId, image, quantity } = food;

		const foodData = { name, description, price, quantity };

		formData.append("food", JSON.stringify(foodData));

		if (image) {
			formData.append("image", image); // Thêm hình ảnh nếu có
		} else {
			formData.append("image", null);
		}

		if (categoryId) {
			formData.append("categoryId", categoryId); // Thêm categoryId
		}

		try {
			let response;
			if (editing) {
				console.log("put");

				// Nếu đang chỉnh sửa, thực hiện PUT để cập nhật food
				response = await instance.put(`/api/foods/${foodId}`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			} else {
				// Nếu không phải chỉnh sửa, thực hiện POST để tạo food mới
				response = await instance.post("/api/foods", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			}

			if (response.status === 201 || response.status === 200) {
				navigate("/manager/foods");
			}
		} catch (error) {
			console.error(
				"Error submitting food:",
				error.response?.data || error.message,
			);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-lg mx-auto  shadow-lg rounded-lg p-6 space-y-4 bg-slate-200 mt-2">
			<h2 className="text-2xl font-semibold text-gray-700 mb-6">
				{editing ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}
			</h2>

			{/* Input fields for food name, description, price, and quantity */}
			<div className="space-y-2">
				<label className="block text-gray-600">Tên món ăn</label>
				<input
					type="text"
					placeholder="Name"
					value={food.name}
					onChange={(e) => setFood({ ...food, name: e.target.value })}
					className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-gray-600">Mô tả</label>
				<input
					type="text"
					placeholder="Description"
					value={food.description}
					onChange={(e) => setFood({ ...food, description: e.target.value })}
					className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-gray-600">Giá</label>
				<input
					type="number"
					placeholder="Price"
					value={food.price}
					onChange={(e) => setFood({ ...food, price: e.target.value })}
					className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
				/>
			</div>

			<div className="space-y-2">
				<label className="block text-gray-600">Số lượng</label>
				<input
					type="number"
					placeholder="Số lượng"
					value={food.quantity}
					onChange={(e) =>
						setFood({ ...food, quantity: Math.max(0, e.target.value) })
					} // Giới hạn không cho số âm
					className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
					min="0"
				/>
			</div>

			{/* Current Image Display if Editing */}
			{editing && (
				<div className="space-y-2">
					<label className="block text-gray-600">Hình ảnh hiện tại</label>
					<img
						src={`https://angelic-strength-production.up.railway.app/api/images/${currentImageId}`}
						alt="Food"
						className="w-32 h-32 object-cover rounded-lg mb-2"
					/>
					<p className="text-gray-500">Hình ảnh ID: {currentImageId}</p>
				</div>
			)}

			{/* New Image Upload */}
			<div className="space-y-2">
				<label className="block text-gray-600">Hình ảnh mới</label>
				<input
					type="file"
					name="image"
					onChange={(e) => setFood({ ...food, image: e.target.files[0] })}
					className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
				/>
			</div>

			{/* Category Selection */}
			<div className="space-y-2">
				<label className="block text-gray-600">Danh mục</label>
				<select
					value={food.categoryId}
					onChange={(e) => setFood({ ...food, categoryId: e.target.value })}
					className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400">
					<option value="">Chọn danh mục</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</div>

			<button
				type="submit"
				className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-400 transition duration-300">
				{editing ? "Cập nhật món ăn" : "Tạo món ăn"}
			</button>
		</form>
	);
};

export default FoodForm;
