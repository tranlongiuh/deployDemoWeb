import React, { useState } from "react";
import styles from "../../src/css/InputCss.css";
import { eyeHideIcon, eyeIcon } from "../assets/icons/icons";
const FormField = ({
	title,
	value,
	placeholder,
	handleChangeText,
	otherStyles,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className={` space-y-2 ${otherStyles}`}>
			<p className="text-base text-blue-600 font-pmedium">{title}</p>

			<div className="flex items-center ">
				<input
					className={`${styles} w-full px-4 pr-12 bg-blue-200 border-2 h-14 border-primary rounded-2xl focus:outline-none focus:border-blue-600 ${
						title === "Mật khẩu" ? "rounded-r-none" : ""
					}`}
					value={value}
					placeholder={placeholder}
					onChange={(e) => handleChangeText(e.target.value)}
					type={
						title === "Mật khẩu" && !showPassword
							? "password"
							: title === "Số tiền"
							? "number"
							: "text"
					}
					{...props}
				/>

				{title === "Mật khẩu" && (
					<button
						className="flex items-center p-2 bg-blue-200 border-2 cursor-pointer h-14 border-primary rounded-2xl rounded-s-none focus:outline-none focus:border-blue-600"
						onClick={() => setShowPassword(!showPassword)}>
						<img
							src={showPassword ? eyeHideIcon : eyeIcon}
							className="w-6 h-6"
							alt="toggle visibility"
						/>
					</button>
				)}
			</div>
		</div>
	);
};

export default FormField;
