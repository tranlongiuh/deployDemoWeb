import React from "react";
import DashboardStatsGrid from "../../components/DashboardStatsGrid";
import Navbar from "../../components/Navbar";
import SelectDayStats from "../../components/SelectDayStats";
import TransactionChart from "../../components/TransactionChart";

const ManagerIndexPage = () => {
	return (
		<div className=" h-full flex flex-col gap-4 bg-slate-200 pb-[20px]">
			<Navbar />
			<DashboardStatsGrid className="flex-1" />
			<div className="flex flex-row gap-4 w-full">
				<TransactionChart />
				{/* <BuyerProfilePieChart /> */}
			</div>
			<div className="flex flex-row gap-4 w-full">
				<SelectDayStats />
				{/* <BuyerProfilePieChart /> */}
			</div>
		</div>
	);
};

export default ManagerIndexPage;
