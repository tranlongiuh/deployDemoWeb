import { vi } from "date-fns/locale";
import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RecentOrders from "./RecentOrders";
registerLocale("vi", vi);

const SelectDayStats = () => {
	const [selectedDate, setSelectedDate] = useState(null);

	useEffect(() => {
		setSelectedDate(new Date());
	}, []);

	return (
		<div className="min-h-[24rem] bg-white border border-gray-200 flex flex-col flex-1 container mx-auto p-4 rounded-xl">
			<p>Danh sách đơn hàng theo ngày</p>
			<div className="flex flex-row-reverse mb-4">
				<DatePicker
					locale="vi"
					selected={selectedDate}
					onChange={(date) => setSelectedDate(date)}
					dateFormat="dd/MM/yyyy"
					className="mt-2 p-2 border border-gray-300 rounded"
				/>
			</div>
			<div>
				<RecentOrders selectedDate={selectedDate} />
			</div>
		</div>
	);
};

export default SelectDayStats;
