import { AtSign, Eye, EyeClosed, Key, MessageCircle } from "lucide-react";
import AnimatedBorder from "../components/AnimatedBorder";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginSchema = z.object({
	email: z.email("آدرس ایمیل شما معتبر نیست"),
	password: z.string().min(6, "رمز باید حداقل 6 حرفی باشد").max(24, "رمز شما نمیتواند بیش از 24 حرف باشد"),
});

type LoginData = z.infer<typeof LoginSchema>;

export default function LoginPage() {
	const { login, isLoggingIn } = useAuthStore();

	const [showPass, setShowPass] = useState(true);
	const changePassVisibility = () => {
		setShowPass(!showPass);
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginData>({
		resolver: zodResolver(LoginSchema),
	});
	const onSubmit: SubmitHandler<LoginData> = (data) => {
		login(data);
	};

	return (
		<div className="relative w-full max-w-6xl p-1 md:p-4">
			<AnimatedBorder>
				<div className="w-full flex flex-col md:flex-row h-[800px]">
					{/* FORM - RightSide */}
					<div className="md:w-1/2 p-5 md:p-8 flex items-center justify-center min-h-full">
						<div className="w-full max-w-md min-h-full flex flex-col justify-center">
							{/* HEADER - LOGO */}
							<div className="text-center mb-6">
								<MessageCircle size={36} className="mx-auto mb-2" />
								<h2 className="text-slate-200 font-bold text-2xl mb-2">ورود به حساب</h2>
								<p className="text-slate-400">وارد حساب خود شوید و گفتگو را آغاز کنید</p>
							</div>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
								<fieldset className="fieldset">
									<legend className="fieldset-legend">ایمیل کاربری</legend>
									<div className="relative">
										<input
											type="text"
											className="input ltr"
											placeholder="user@example.com"
											{...register("email")}
										/>
										<AtSign className="auth-input-icon" />
									</div>
									{errors.email ?
										<p className="text-red-400 label">{errors.email.message}</p>
									:	<p className="label"> </p>}
								</fieldset>
								<fieldset className="fieldset">
									<legend className="fieldset-legend">رمزعبور</legend>
									<div className="relative">
										<input
											type={showPass ? "password" : "text"}
											className="input ltr"
											placeholder="*********"
											{...register("password")}
										/>
										{showPass ?
											<EyeClosed
												className="auth-password-icon"
												onClick={() => changePassVisibility()}
											/>
										:	<Eye
												className="auth-password-icon"
												onClick={() => changePassVisibility()}
											/>
										}
										<Key className="auth-input-icon" />
									</div>
									{errors.password ?
										<p className="text-red-400 label">{errors.password.message}</p>
									:	<p className="label"> </p>}
								</fieldset>
								<button
									disabled={isLoggingIn}
									type="submit"
									className="auth-btn mt-4 disabled:cursor-not-allowed">
									{isLoggingIn ?
										<span className="loading loading-dots loading-sm"></span>
									:	"ورود به حساب"}
								</button>
								<div className="text-center mt-6">
									<Link to="/register" className="auth-link">
										حساب کاربری ندارید؟ ساخت حساب
									</Link>
								</div>
							</form>
						</div>
					</div>
					{/* Image */}
					<div className="hidden md:w-1/2 p-8 md:flex flex-col items-center justify-center">
						<div className="relative w-full h-full flex items-center justify-center">
							<img src="/robotics.svg" alt="chat bot image" className="w-full" />
						</div>
					</div>
				</div>
			</AnimatedBorder>
		</div>
	);
}
