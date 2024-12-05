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
		case "WAITING":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs bg-orange-500 ">
					Chờ đến nhận
				</span>
			);
		case "SHIPPING":
			return (
				<span className="capitalize py-1 px-2 rounded-md text-xs bg-purple-500 ">
					Đang giao
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

export const compareCurrentTime = (isoDateString) => {
	const date = new Date(isoDateString);
	const now = new Date();
	const diff = now - date;

	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (minutes < 1) {
		return "Vừa xong";
	} else if (minutes < 60) {
		return `${minutes} phút trước`;
	} else if (hours < 24) {
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0
			? `${hours} giờ ${remainingMinutes} phút trước`
			: `${hours} giờ trước`;
	} else {
		const remainingHours = hours % 24;
		return remainingHours > 0
			? `${days} ngày ${remainingHours} giờ trước`
			: `${days} ngày trước`;
	}
};

export const renderStatus = (param) => {
	switch (param) {
		case "SHIPPING":
			return "Trạng thái: Đang giao cho khách";
		case "COMPLETED":
			return "Trạng thái: Đã hoàn thành";
		case "PROCESSING":
			return "Trạng thái: Đang thực hiện";
		case "WAITING":
			return "Trạng thái: Chờ khách hàng đến lấy";
		case "PAID":
			return "Trạng thái: Đang chờ";
		case "NEW":
			return "Trạng thái: Chưa thanh toán";
		case "CANCELLED":
			return "Trạng thái: Đã bị hủy";
		default:
			return "Trạng thái: Không xác định " + param;
	}
};
