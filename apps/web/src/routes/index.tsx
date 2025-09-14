import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import MainLayout from "../pages/layout/MainLayout";
import { useAuthStore } from "../store/useAuthStore";
import { Toaster } from "react-hot-toast";

// Fallback
const LoadingPage = lazy(() => import("../pages/LoadingPage"));
// Auth- Routes
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
// Main Routes
const HomePage = lazy(() => import("../pages/HomePage"));

export default function AppRoutes() {
	const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	console.log(isCheckingAuth, authUser);

	if (isCheckingAuth) return <LoadingPage />;

	return (
		<Suspense fallback={<LoadingPage />}>
			<Routes>
				<Route element={<MainLayout />}>
					<Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
					<Route path="/register" element={!authUser ? <RegisterPage /> : <Navigate to="/" />} />
					<Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
				</Route>
			</Routes>
			<div>
				<Toaster position="top-center" reverseOrder={false} />
			</div>
		</Suspense>
	);
}
