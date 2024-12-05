import { React, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineMenuUnfold } from "react-icons/ai";
import { BiRestaurant } from "react-icons/bi";
import { Link } from "react-router-dom";
import Button from "./Button";
const Navbar = () => {
	const token = localStorage.getItem("token"); // Kiểm tra token trong localStorage
	const [menu, setMenu] = useState(false);

	const indexPage = localStorage.getItem("index");
	const handleChange = () => {
		setMenu(!menu);
	};

	const closeMenu = () => {
		setMenu(false);
	};

	useEffect(() => {
		if (token) {
			console.log("indexPage ", indexPage);
		}
	}, []);

	return (
		<div className="sticky top-0 z-50 w-full ">
			<div>
				<div className="flex flex-row justify-between p-5 md:px-32 px-5 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
					{!token && (
						<a
							href={indexPage}
							className="transition-all cursor-pointer hover:text-brightColor">
							<div className="flex flex-row items-center cursor-pointer">
								<span>
									<BiRestaurant size={32} />
								</span>
								<h1 className="text-xl font-semibold">IUHFood</h1>
							</div>
						</a>
					)}
					{token && (
						<a
							href={indexPage}
							className="transition-all cursor-pointer hover:text-brightColor">
							<div className="flex flex-row items-center cursor-pointer">
								<span>
									<BiRestaurant size={32} />
								</span>
								<h1 className="text-xl font-semibold">IUHFood</h1>
							</div>
						</a>
					)}

					{token && (
						<nav className="flex-row items-center hidden gap-8 text-lg font-medium md:flex">
							{indexPage === "/manager" && (
								<>
									<a
										href={indexPage}
										className="transition-all cursor-pointer hover:text-brightColor">
										Trang chủ
									</a>

									<div className="relative group">
										<div className="flex items-center gap-1">
											<a
												href={"/manager/foods"}
												className="transition-all cursor-pointer hover:text-brightColor">
												Món ăn
											</a>
											{/* <BiChevronDown className="cursor-pointer" size={25} /> */}
										</div>

										<ul className="absolute hidden p-5 space-y-2 bg-white border border-gray-300 rounded-lg min-w-max group-hover:block">
											<li>
												<a
													href={"/manager/schedule"}
													className="text-gray-800 transition-all cursor-pointer hover:text-brightColor">
													Lịch theo ngày
												</a>
											</li>
										</ul>
									</div>
									<a
										href="/manager/orders"
										className="transition-all cursor-pointer hover:text-brightColor">
										Đơn hàng
									</a>
									{/* <a
										href="/manager/review"
										className="transition-all cursor-pointer hover:text-brightColor">
										Đánh giá
									</a>

									<a
										href="/manager/chat"
										className="transition-all cursor-pointer hover:text-brightColor">
										Chat
									</a> */}
								</>
							)}

							{indexPage === "/cashier" && (
								<>
									<a
										href={indexPage}
										className="transition-all cursor-pointer hover:text-brightColor">
										Trang chủ
									</a>

									<a
										href={indexPage + "/findCustomer"}
										className="transition-all cursor-pointer hover:text-brightColor">
										Tìm khách hàng
									</a>

									{/* <a
										href={indexPage + "/chat"}
										className="transition-all cursor-pointer hover:text-brightColor">
										Chat
									</a> */}
								</>
							)}
							{indexPage === "/admin" && (
								<>
									<a
										href={indexPage}
										className="transition-all cursor-pointer hover:text-brightColor">
										Trang chủ
									</a>

									{/* <a
										href={indexPage + "/createStall"}
										className="transition-all cursor-pointer hover:text-brightColor">
										Tìm khách hàng
									</a> */}

									{/* <a
										href={indexPage + "/chat"}
										className="transition-all cursor-pointer hover:text-brightColor">
										Chat
									</a> */}
								</>
							)}
							{/* <a
								href="/profile"
								className=" transition-all cursor-pointer hover:text-brightColor">
								Hồ sơ
							</a> */}
							<a
								className="px-6 py-1 transition-all border-2 rounded-full border-brightColor text-brightColor hover:bg-brightColor hover:text-white"
								onClick={() => {
									localStorage.clear(); // Xóa token khỏi localStorage
									// Làm mới trang để cập nhật giao diện
								}}
								href={"/login"}>
								Đăng xuất
							</a>
						</nav>
					)}
					{!token && (
						<nav className="flex-row items-center hidden gap-8 text-lg font-medium md:flex">
							<Button title="Đăng nhập" url="/login" />
						</nav>
					)}
					<div className="flex items-center md:hidden">
						{menu ? (
							<AiOutlineClose size={25} onClick={handleChange} />
						) : (
							<AiOutlineMenuUnfold size={25} onClick={handleChange} />
						)}
					</div>
				</div>

				<div
					className={` ${
						menu ? "translate-x-0" : "-translate-x-full"
					} lg:hidden flex flex-col absolute bg-black text-white left-0 top-20 font-semibold text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}>
					{token && (
						<>
							<Link
								to={indexPage}
								className="transition-all cursor-pointer hover:text-brightColor"
								onClick={closeMenu}>
								Trang chủ
							</Link>
							<Link
								to="/manager/dishes"
								className="transition-all cursor-pointer hover:text-brightColor"
								onClick={closeMenu}>
								Món ăn
							</Link>

							<Link
								to="/manager/menu"
								className="transition-all cursor-pointer hover:text-brightColor"
								onClick={closeMenu}>
								Menu
							</Link>
							<Link
								to="/manager/review"
								className="transition-all cursor-pointer hover:text-brightColor"
								onClick={closeMenu}>
								Đánh giá
							</Link>
						</>
					)}
					{/* Tương tự cho menu di động */}
					{!token ? (
						<Button title="Đăng nhập" url="/login" onClick={closeMenu} />
					) : (
						<>
							<Link
								to="/profile"
								className="transition-all cursor-pointer hover:text-brightColor"
								onClick={closeMenu}>
								Hồ sơ
							</Link>
							<a
								className="px-6 py-1 transition-all border-2 rounded-full border-brightColor text-brightColor hover:bg-brightColor hover:text-white"
								title=""
								onClick={() => {
									localStorage.clear(); // Xóa token khỏi localStorage
									// Làm mới trang để cập nhật giao diện
								}}
								href={"/login"}>
								Đăng xuất
							</a>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
