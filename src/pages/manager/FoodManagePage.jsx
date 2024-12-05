import React from "react";
import FoodManage from "../../components/FoodManage";
import Navbar from "../../components/Navbar";

const FoodManagePage = () => (
	<div className="h-screen flex flex-col">
		<Navbar />
		<div className="flex-1">
			<FoodManage />
		</div>
	</div>
);

export default FoodManagePage;
