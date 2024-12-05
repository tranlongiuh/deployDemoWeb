import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	const getLoginPage = () => {
		navigate("/login");
	};

	useEffect(() => {
		localStorage.clear();
	}, []);

	return (
		<div className=" min-h-screen flex flex-row justify-between items-center lg:px-32 px-5 bg-[url('./assets/img/hero.jpg')] bg-cover bg-no-repeat ">
			<div className="w-full space-y-5 lg:w-2/3">
				<h1 className="text-6xl font-semibold text-backgroundColor">
					Quản lý của hàng của bạn với ứng dụng
					<span className="text-red-600"> IUHFood</span>
				</h1>
				<p className=" text-backgroundColor">
					Quản lý tối ưu, hiệu quả vượt trội!
				</p>
				{/* <div className=" lg:pl-44"> */}
				{/* <Link
            to="/login"
            spy={true}
            smooth={true}
            duration={500}
            className="transition-all cursor-pointer hover:text-brightColor"
          > */}
				<button
					className="px-6 py-1 transition-all border-2 rounded-full border-brightColor text-brightColor hover:bg-brightColor hover:text-white"
					onClick={getLoginPage}>
					Đăng nhập ngay
				</button>
				{/* </Link> */}
				{/* </div> */}
			</div>
		</div>
	);
};

export default Home;
