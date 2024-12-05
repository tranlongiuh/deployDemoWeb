import React from "react";
import DashboardStatsGrid from "../../components/DashboardStatsGrid";
import Navbar from "../../components/Navbar";
import RecentOrders from "../../components/RecentOrders";
import TransactionChart from "../../components/TransactionChart";

const ManagerIndexPage = () => {
	return (
		<div className=" h-screen flex flex-col gap-4">
			<Navbar />
			<DashboardStatsGrid className="flex-1" />
			<div className="flex flex-row gap-4 w-full">
				<TransactionChart />
				{/* <BuyerProfilePieChart /> */}
			</div>
			<div className="flex flex-row gap-4 w-full">
				<RecentOrders />
				{/* <PopularProducts /> */}
			</div>
		</div>
	);
};

export default ManagerIndexPage;
