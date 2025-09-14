import { AtSign, Eye, EyeClosed, FileLock2, Key, MessageCircle, UserRound } from "lucide-react";
import AnimatedBorder from "../components/AnimatedBorder";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const RegistrationSchema = z
	.object({
		username: z
			.string()
			.min(3, "نام کاربری باید حداقل 3 حرفی باشد")
			.max(16, "نام کاربری نمیتواند بیش از 16 حرف باشد")
			.regex(/^[a-zA-Z][a-zA-Z0-9]*$/, "نام کاربری باید حروف انگلیسی و اعداد باشد"),
		email: z.email("آدرس ایمیل شما معتبر نیست"),
		password: z
			.string()
			.min(6, "رمز باید حداقل 6 حرفی باشد")
			.max(24, "رمز شما نمیتواند بیش از 24 حرف باشد"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "رمزعبور و تکرارش همخوانی ندارند",
		path: ["confirmPassword"],
	})
	.strict();

type RegistrationData = z.infer<typeof RegistrationSchema>;

export default function RegisterPage() {
	const { signup, isSigningUp } = useAuthStore();

	const [showPass, setShowPass] = useState(true);
	const changePassVisibility = () => {
		setShowPass(!showPass);
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegistrationData>({
		resolver: zodResolver(RegistrationSchema),
	});
	const onSubmit: SubmitHandler<RegistrationData> = (data) => {
		signup(data);
	};

	return (
		<div className="w-full flex items-center justify-center p-1 md:p-4 bg-slate-900">
			<div className="relative w-full max-w-6xl h-full md:h-[800px]">
				<AnimatedBorder>
					<div className="w-full flex flex-col md:flex-row">
						{/* FORM - RightSide */}
						<div className="md:w-1/2 p-5 md:p-8 flex items-center justify-center">
							<div className="w-full max-w-md">
								{/* HEADER - LOGO */}
								<div className="text-center mb-6">
									<MessageCircle size={36} className="mx-auto mb-2" />
									<h2 className="text-slate-200 font-bold text-2xl mb-2">
										ساخت حساب کاربری
									</h2>
									<p className="text-slate-400">با ساخت حساب شروع کنید</p>
								</div>
								<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
									<fieldset className="fieldset">
										<legend className="fieldset-legend">نام کاربری</legend>
										<div className="relative">
											<input
												type="text"
												className="input ltr"
												placeholder="username_1"
												{...register("username")}
											/>
											<UserRound className="auth-input-icon" />
										</div>
										{errors.username ?
											<p className="text-red-400 label">{errors.username.message}</p>
										:	<p className="label">بعدا قابل تغییر است</p>}
									</fieldset>
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
										:	<p className="label">قابل تغییر نیست </p>}
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
										:	<p className="label">رمزعبور قابل تغییر است</p>}
									</fieldset>
									<fieldset className="fieldset">
										<legend className="fieldset-legend">تکرار رمز</legend>
										<div className="relative">
											<input
												type={showPass ? "password" : "text"}
												className="input ltr"
												placeholder="*********"
												{...register("confirmPassword")}
											/>
											<FileLock2 className="auth-input-icon" />
										</div>
										{errors.confirmPassword ?
											<p className="text-red-400 label">
												{errors.confirmPassword.message}
											</p>
										:	<p className="label">به تکرار رمز دقت کنید</p>}
									</fieldset>
									<button type="submit" className="auth-btn mt-4">
										{isSigningUp ?
											<span className="loading loading-dots loading-md"></span>
										:	"ثبت نام"}
									</button>
									<div className="text-center mt-6">
										<Link to="/login" className="auth-link">
											حساب کاربری دارید؟ وارد شوید
										</Link>
									</div>
								</form>
							</div>
						</div>
						<div className="hidden md:w-1/2 p-8 md:flex flex-col items-center justify-center">
							<div className="relative w-full h-full flex items-center justify-center">
								<img src="/chat-bot.svg" alt="chat bot image" className="w-full" />
							</div>
						</div>
					</div>
				</AnimatedBorder>
			</div>
		</div>
	);
}
