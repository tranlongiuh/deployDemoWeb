import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";

const UploadImage = () => {
	const [idImages, setIdImages] = useState([]); // Holds list of image IDs
	const [idImage, setIdImage] = useState(null); // For storing current image ID
	const [file, setFile] = useState(null); // For the file input
	const [editing, setEditing] = useState(false);

	const token = localStorage.getItem("token");
	const instance = axios.create({
		baseURL: "https://angelic-strength-production.up.railway.app",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	useEffect(() => {
		getImages(); // Fetch all image IDs
	}, []);

	// Handle image upload
	const handleImageUpload = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("image", file);

		try {
			const response = await instance.post("/api/images/upload", formData);
			console.log("Image uploaded successfully:", response.data);
			setIdImages([...idImages, response.data.id]); // Add new image ID to the list
		} catch (error) {
			console.error("Error uploading image:", error);
		}
	};

	// Fetch all images
	const getImages = async () => {
		try {
			const response = await instance.get("/api/images");
			if (response.status === 200) {
				setIdImages(response.data); // Set image IDs to state
			}
		} catch (error) {
			console.error("Error fetching images:", error);
		}
	};

	// Fetch image by ID for viewing/editing
	const getImageById = async (id) => {
		try {
			const response = await instance.get(`/api/images/${id}`);
			if (response.status === 200) {
				setIdImage(id); // Set selected image ID
				setEditing(true); // Enable edit mode
			}
		} catch (error) {
			console.error("Error fetching image by ID:", error);
		}
	};

	// Delete image by ID
	const deleteImage = async (id) => {
		try {
			await instance.delete(`/api/images/${id}`);
			setIdImages(idImages.filter((imageId) => imageId !== id)); // Update image list
		} catch (error) {
			console.error("Error deleting image:", error);
		}
	};

	// Update image
	const updateImage = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("image", file);

		try {
			const response = await instance.put(`/api/images/${idImage}`, formData);
			if (response.status === 200) {
				setIdImage(null); // Clear selected image
				setEditing(false); // Exit edit mode
			}
		} catch (error) {
			console.error("Error updating image:", error);
		} finally {
			window.location.reload();
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			{/* Toggle add/edit mode */}
			<button
				className="bg-green-500 text-white p-2 mb-4"
				onClick={() => setEditing(false)}>
				{editing ? "Switch to Add Mode" : "Add New Image"}
			</button>

			{/* Image upload/update form */}
			<form onSubmit={editing ? updateImage : handleImageUpload}>
				<input
					type="file"
					onChange={(e) => setFile(e.target.files[0])}
					accept="image/*"
				/>
				<button className="bg-blue-500 text-white p-2" type="submit">
					{editing ? "Update Image" : "Create Image"}
				</button>
			</form>

			{/* Image display */}
			{idImage && (
				<div>
					<h3>Selected Image:</h3>
					<img
						src={`https://angelic-strength-production.up.railway.app/api/images/${idImage}`}
						alt="Selected"
						className="w-24 h-24 mt-4"
					/>
				</div>
			)}

			{/* Image list with actions */}
			<table className="table-auto border-collapse border border-gray-400 mt-4">
				<thead>
					<tr>
						<th>ID</th>
						<th>Photo</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{idImages.map((id) => (
						<tr key={id}>
							<td>{id}</td>
							<td>
								<img
									src={`https://angelic-strength-production.up.railway.app/api/images/${id}`}
									alt="Food"
									className="w-24 h-24"
								/>
							</td>
							<td>
								<button
									onClick={() => getImageById(id)}
									className="bg-blue-500 text-white p-2">
									Edit
								</button>
							</td>
							<td>
								<button
									onClick={() => deleteImage(id)}
									className="bg-red-500 text-white p-2 ml-2">
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default UploadImage;
