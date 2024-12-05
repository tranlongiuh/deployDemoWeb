export function getOrderStatus(status) {
	switch (status) {
		case "NEW":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs  bg-sky-600">
					Chờ thanh toán
				</span>
			);
		case "PROCESSING":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs bg-orange-600">
					Đang thực hiện
				</span>
			);
		case "COMPLETED":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs bg-green-600">
					Đã hoàn thành
				</span>
			);
		case "PENDING":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs bg-yellow-600">
					Chưa giải quyết
				</span>
			);
		case "PAID":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs bg-teal-600">
					Đã thanh toán
				</span>
			);
		case "CANCELLED":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs bg-red-600 ">
					Đã hủy
				</span>
			);
		default:
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100">
					{status.replaceAll("_", " ").toLowerCase()}
				</span>
			);
	}
}

export const formatToVietnamTime = (isoDateString) => {
	const date = new Date(isoDateString);
	return date.toLocaleString("vi-VN", {
		timeZone: "Asia/Ho_Chi_Minh",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

export const renderStatus = (param) => {
	switch (param) {
		case "PROCESSING":
			return "Trạng thái: Đang thực hiện";
		case "WAITING":
			return "Trạng thái: Chờ khách hàng đến lấy";
		case "PAID":
			return "Trạng thái: Đang chờ";
		case "NEW":
			return "Trạng thái: Chưa thanh toán";
		default:
			return "Trạng thái: Không xác định " + param;
	}
};
