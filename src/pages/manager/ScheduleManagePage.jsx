import React from "react";
import Navbar from "../../components/Navbar";
import ScheduleManage from "../../components/ScheduleManage";

const ScheduleManagePage = () => (
	<div className="h-screen flex flex-col">
		<Navbar />
		<div className="flex-1">
			<ScheduleManage />
		</div>
	</div>
);

export default ScheduleManagePage;
