import React, { useState } from "react";
import { assets, heroSectionData } from "../assets/assets";
import { Link } from "react-router-dom";
import {
  Loader2Icon,
  LockIcon,
  MailIcon,
  UserIcon,
  ArrowRightIcon,
  PhoneIcon,
} from "lucide-react";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { login, sendOTP, verifyOTP } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!showOtp) {
          await sendOTP(name, email, phone);
          toast.success("OTP sent to your email");
          setShowOtp(true);
          setCountdown(60);
          setCanResend(false);
          setShowOtp(true);
        } else {
          if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
          }
          await verifyOTP(name, email, phone, password, otp);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!showOtp) return;

    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, showOtp]);

  return (
    <div className="h-screen overflow-hidden flex bg-[#f7f7f5]">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={heroSectionData.hero_image}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-green-900/80 to-black/70" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-14 text-white w-full">
          <Link to="/">
            <img
              src={assets.logo_text}
              alt="Logo"
              className="w-40 brightness-0 invert"
            />
          </Link>

          <div>
            <span className="bg-white/10 border border-white/20 text-sm px-4 py-2 rounded-full backdrop-blur-md">
              Fresh groceries delivered fast
            </span>

            <h1 className="text-5xl font-bold leading-tight mt-6 max-w-xl">
              Reliable Supply
              <br />
              for Hotels & Restaurants.
            </h1>

            <p className="text-white/70 text-lg mt-5 max-w-md leading-relaxed">
              Source vegetables, grains, dairy, spices, and kitchen essentials
              in bulk at wholesale price.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/70">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/100?img=14"
                alt=""
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/100?img=7"
                alt=""
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/100?img=52"
                alt=""
                className="w-10 h-10 rounded-full border-2 border-white"
              />
            </div>

            <p>
              Trusted by <span className="font-semibold text-white">100+</span>{" "}
              happy customers
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center px-5 py-4 pt-28 lg:pt-4 relative">
        {/* Mobile Fixed Logo */}
        <div className="lg:hidden fixed top-0 left-0 w-full z-50 flex justify-center py-4">
          <Link to="/">
            <img src={assets.logo_text} alt="Logo" className="w-44 sm:w-52" />
          </Link>
        </div>

        <div className="w-full max-w-md p-6 sm:p-8">
          {/* Top */}
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              {isLogin
                ? "Sign in to continue ordering fresh essentials."
                : "Create your account and start sourcing smarter."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative mt-2">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    disabled={showOtp}
                    className="w-full h-11 sm:h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-700 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative mt-2">
                <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={!isLogin && showOtp}
                  className="w-full h-11 sm:h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-700 outline-none transition-all"
                />
              </div>
            </div>
            {!isLogin && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative mt-2">
                  <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setPhone(value);
                    }}
                    placeholder="Enter your phone no."
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    inputMode="numeric"
                    disabled={showOtp}
                    className="w-full h-11 sm:h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-700 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                {isLogin && (
                  <button
                    type="button"
                    className="text-sm text-green-700 hover:text-green-800"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative mt-2">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={!isLogin && showOtp}
                  required
                  className="w-full h-11 sm:h-12 pl-12 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-green-700 outline-none transition-all"
                />
              </div>
            </div>
            {!isLogin && showOtp && (
              <div>
                <label className="text-sm font-medium text-gray-700">OTP</label>

                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  required
                  className="mt-2 w-full h-11 sm:h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:bg-white focus:border-green-700"
                />
              </div>
            )}

            {!isLogin && showOtp && (
              <div className="text-right">
                <button
                  type="button"
                  disabled={!canResend}
                  onClick={async () => {
                    try {
                      await sendOTP(name, email, phone);
                      toast.success("OTP resent");

                      setCountdown(60);
                      setCanResend(false);
                    } catch (err: any) {
                      toast.error(err.response?.data?.message || err.message);
                    }
                  }}
                  className={`text-sm ${
                    canResend
                      ? "text-green-700 hover:text-green-900"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {canResend ? "Resend OTP" : `Resend in ${countdown}s`}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (!isLogin && showOtp && otp.length !== 6)}
              className="w-full h-11 sm:h-12 rounded-xl bg-green-950 hover:bg-green-900 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2Icon className="animate-spin size-5" />
              ) : (
                <>
                  {isLogin ? "Sign In" : showOtp ? "Verify OTP" : "Send OTP"}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setName("");
                setEmail("");
                setPhone("");
                setPassword("");
                setOtp("");
                setCanResend(false);
                setCountdown(60);
                setShowOtp(false);
              }}
              className="ml-2 text-green-800 font-semibold hover:text-green-950 transition-colors"
            >
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
