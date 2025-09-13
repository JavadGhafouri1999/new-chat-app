import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import MainLayout from "../pages/layout/MainLayout";

// Fallback
const LoadingPage = lazy(() => import("../pages/LoadingPage"));
// Auth- Routes
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
// Main Routes

export default function AppRoutes() {
	return (
		<Suspense fallback={<LoadingPage />}>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
				</Route>
			</Routes>
		</Suspense>
	);
}
