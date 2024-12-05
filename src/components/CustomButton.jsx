import React from "react";

const CustomButton = ({
	handlePress,
	isLoading,
	containerStyles,
	textStyles,
	title,
}) => {
	return (
		<button
			onClick={handlePress}
			className={`bg-red-500 h-14 px-5 rounded-xl  ${containerStyles}  hover:bg-red-600 hover:shadow-lg hover:shadow-black`} // Thay đổi `div` thành `button` và thêm `cursor-not-allowed` khi `isLoading` là true
			disabled={isLoading} // Đặt thuộc tính 'disabled' vào 'button'
		>
			<p className={`text-lg font-semibold text-white ${textStyles}`}>
				{title}
			</p>
		</button>
	);
};

export default CustomButton;
