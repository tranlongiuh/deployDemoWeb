import React from "react";
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import AdminIndexPage from "./pages/admin";
import CreateNewStall from "./pages/admin/CreateNewStall";
import CashierIndexPage from "./pages/cashier";
import FindCustomerPage from "./pages/cashier/findCustomerPage";
import ErrorPage from "./pages/error";
import {
	default as ForgotPasswordPage,
	default as ResetPasswordPage,
} from "./pages/ForgotPasswordPage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import FoodFormPage from "./pages/manager/FoodFormPage";
import FoodManagePage from "./pages/manager/FoodManagePage";
import ManagerIndexPage from "./pages/manager/index";
import OrdersPage from "./pages/manager/OrdersPage";
import ScanQRPage from "./pages/manager/ScanQRPage";
import ScheduleFormPage from "./pages/manager/ScheduleFormPage";
import ScheduleManagePage from "./pages/manager/ScheduleManagePage";
import PromotionPage from "./pages/PromotionPage";
import RegisterPage from "./pages/RegisterPage";
import UploadImagePage from "./pages/UploadImagePage";
import PrivateRoute from "./PrivateRoute";

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="*" element={<Navigate to="/error" />} />
				<Route path="/" element={<IndexPage />} />
				<Route path="/error" element={<ErrorPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/forgot" element={<ForgotPasswordPage />} />
				<Route path="/reset" element={<ResetPasswordPage />} />
				{/* Cashier */}
				<Route
					path="/cashier"
					element={
						<PrivateRoute element={<CashierIndexPage />} role="/cashier" />
					}
				/>
				<Route
					path="/cashier/findCustomer"
					element={
						<PrivateRoute element={<FindCustomerPage />} role="/cashier" />
					}
				/>
				{/* Admin */}
				<Route
					path="/admin"
					element={<PrivateRoute element={<AdminIndexPage />} role="/admin" />}
				/>
				<Route
					path="/admin/createStall"
					element={<PrivateRoute element={<CreateNewStall />} role="/admin" />}
				/>
				{/* Manager */}
				<Route
					path="/manager"
					element={
						<PrivateRoute element={<ManagerIndexPage />} role="/manager" />
					}
				/>
				<Route
					path="/manager/schedule"
					element={
						<PrivateRoute element={<ScheduleManagePage />} role="/manager" />
					}
				/>
				<Route
					path="/manager/schedule/form"
					element={
						<PrivateRoute element={<ScheduleFormPage />} role="/manager" />
					}
				/>
				<Route
					path="/manager/foods"
					element={
						<PrivateRoute element={<FoodManagePage />} role="/manager" />
					}
				/>
				<Route
					path="/manager/foods/form"
					element={<PrivateRoute element={<FoodFormPage />} role="/manager" />}
				/>
				<Route
					path="/manager/orders"
					element={<PrivateRoute element={<OrdersPage />} role="/manager" />}
				/>
				<Route
					path="/manager/orders/scan"
					element={<PrivateRoute element={<ScanQRPage />} role="/manager" />}
				/>

				<Route
					path="/uploadImage"
					element={
						<PrivateRoute element={<UploadImagePage />} role="/manager" />
					}
				/>
				<Route
					path="/promotions"
					element={<PrivateRoute element={<PromotionPage />} role="/manager" />}
				/>
			</Routes>
		</Router>
	);
};

export default App;
