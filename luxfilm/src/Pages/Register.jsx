import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { z } from "zod";
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import { authService } from "../services/authService";
import { LanguageContext } from "../context/LanguageContext";
import movieService from "../services/movieService";
// Base schema for individual field validation (has .shape)
const registerBaseSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .refine((name) => name.trim().split(" ").length >= 2, {
      message: "Please enter your first and last name",
    }),
  userName: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});

// Full schema with refinements for form submission
const registerSchema = registerBaseSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

// Register component
const Register = () => {
  const navigate = useNavigate();
  const { t } = React.useContext(LanguageContext);
  // form data state
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // const [backdrop, setBackdrop] = useState("");

  // fetch backdrop from TMDB
  useEffect(() => {
    const fetchBackdrop = async () => {
      try {
        const backdropUrl = await movieService.getTrendingBackdrop();
        if (backdropUrl) {
          setBackdrop(backdropUrl);
        }
      } catch (err) {
        console.error("Backdrop fetch error:", err);
      }
    };
    fetchBackdrop();
  }, []);

  // handle form change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle blur validation - Uses baseSchema.shape for reliability
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let fieldError = "";

    if (name === "confirmPassword") {
      if (value !== formData.password) {
        fieldError = "Passwords do not match";
      }
    } else {
      const fieldSchema = registerBaseSchema.shape[name];
      if (fieldSchema) {
        const result = fieldSchema.safeParse(value);
        if (!result.success) {
          // Use .issues for standard Zod reliability
          fieldError = result.error.issues[0]?.message || "Invalid input";
        }
      }
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (fieldError) {
        newErrors[name] = fieldError;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrors({});
    setLoading(true);

    try {
      // Validate using full schema
      const validatedData = registerSchema.parse(formData);

      // Register via local service
      authService.registerUser(validatedData);

      toast.success("Account created successfully!");

      // Navigate to login on success
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration Error:", err);

      // 1. Handle Zod Validation Errors
      if (err instanceof z.ZodError) {
        const fieldErrors = err.flatten().fieldErrors;
        const formattedErrors = {};

        // Map fieldErrors (arrays) to single strings for our UI
        Object.keys(fieldErrors).forEach((key) => {
          formattedErrors[key] = fieldErrors[key][0];
        });

        setErrors(formattedErrors);
        setError("Please fill empty fields correctly.");
        toast.error("Validation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    return strength;
  };

  const strength = passwordStrength();

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center overflow-hidden py-12">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#842A3B] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#662222] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-[#3E0703] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src={logo}
              alt="LuxFilm"
              className="w-40 object-contain cursor-pointer hover:opacity-80 transition"
            />
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-[#842A3B]/30 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-2 text-center">
            {t("joinLuxFilm")}
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            {t("createAccount")}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-[#8C1007]/20 border border-[#8C1007] rounded-lg flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8C1007] rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-[#ff6b6b] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("fullName")}
              </label>
              <div
                className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.fullName ? "border-[#8C1007] focus-within:border-[#8C1007]" : "border-white/20 focus-within:border-[#842A3B]/60"}`}
              >
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Doe"
                  className="bg-transparent border-none outline-none ml-3 w-full text-white placeholder:text-gray-500"
                />
              </div>
              {errors.fullName && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("username")}
              </label>
              <div
                className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.userName ? "border-[#8C1007] focus-within:border-[#8C1007]" : "border-white/20 focus-within:border-[#842A3B]/60"}`}
              >
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="johndoe123"
                  className="bg-transparent border-none outline-none ml-3 w-full text-white placeholder:text-gray-500"
                />
              </div>
              {errors.userName && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.userName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("email")}
              </label>
              <div
                className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.email ? "border-[#8C1007] focus-within:border-[#8C1007]" : "border-white/20 focus-within:border-[#842A3B]/60"}`}
              >
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your@email.com"
                  className="bg-transparent border-none outline-none ml-3 w-full text-white placeholder:text-gray-500"
                />
              </div>
              {errors.email && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("phone")}
              </label>
              <div
                className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.phone ? "border-[#8C1007] focus-within:border-[#8C1007]" : "border-white/20 focus-within:border-[#842A3B]/60"}`}
              >
                <Phone size={18} className="text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0123456789"
                  className="bg-transparent border-none outline-none ml-3 w-full text-white placeholder:text-gray-500"
                />
              </div>
              {errors.phone && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("password")}
              </label>
              <div
                className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.password ? "border-[#8C1007] focus-within:border-[#8C1007]" : "border-white/20 focus-within:border-[#842A3B]/60"}`}
              >
                <Lock size={18} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none ml-3 w-full text-white placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#ff6b6b] text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t("confirmPassword")}
              </label>
              <div
                className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.confirmPassword ? "border-[#8C1007] focus-within:border-[#8C1007]" : "border-white/20 focus-within:border-[#842A3B]/60"}`}
              >
                <Lock size={18} className="text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none ml-3 w-full text-white placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#ff6b6b] text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#842A3B] to-[#662222] hover:from-[#A3485A] hover:to-[#7d3535] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-lg"
            >
              {loading ? (
                <span className="animate-pulse">{t("creatingAccount")}</span>
              ) : (
                <>
                  {t("createAccountBtn")} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-black/40 text-gray-400">
                {t("alreadyHaveAccount")}
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link to="/login">
            <button
              type="button"
              className="w-full border-2 border-[#842A3B] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#842A3B] transition-all duration-300"
            >
              {t("signIn")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
