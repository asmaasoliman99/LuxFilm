import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import logo from '../assets/logo.png';

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      // Validate using Zod
      const validatedData = loginSchema.parse({ email, password });
      
      // Simulated login - Replace with actual API call
      console.log('Login attempt:', validatedData);
      
      // Simulate API delay
      setTimeout(() => {
        navigate('/');
      }, 600);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = {};
        err.errors.forEach((error) => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
        setError('Please fix the errors below');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#141414] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#842A3B] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#662222] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-[#3E0703] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="LuxFilm" className="w-40 object-contain cursor-pointer hover:opacity-80 transition" />
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-[#842A3B]/30 rounded-2xl p-8 shadow-2xl">
          
          <h1 className="text-3xl font-extrabold text-white mb-2 text-center">Welcome Back</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">Sign in to your LuxFilm account</p>

          {error && (
            <div className="mb-6 p-4 bg-[#8C1007]/20 border border-[#8C1007] rounded-lg flex items-start gap-3">
              <div className="w-2 h-2 bg-[#8C1007] rounded-full mt-1.5 flex-shrink-0"></div>
              <p className="text-[#ff6b6b] text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
              <div className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.email ? 'border-[#8C1007] focus-within:border-[#8C1007]' : 'border-white/20 focus-within:border-[#842A3B]/60'}`}>
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-transparent border-none outline-none ml-3 w-full text-white placeholder:text-gray-500"
                />
              </div>
              {errors.email && <p className="text-[#ff6b6b] text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <div className={`flex items-center bg-white/10 border rounded-lg px-4 py-3 focus-within:bg-white/15 transition-all duration-300 ${errors.password ? 'border-[#8C1007] focus-within:border-[#8C1007]' : 'border-white/20 focus-within:border-[#842A3B]/60'}`}>
                <Lock size={18} className="text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {errors.password && <p className="text-[#ff6b6b] text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition">
                <input type="checkbox" className="w-4 h-4 bg-white/10 border border-white/20 rounded cursor-pointer accent-[#842A3B]" />
                Remember me
              </label>
              <a href="#" className="text-[#842A3B] hover:text-[#A3485A] transition font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#842A3B] to-[#662222] hover:from-[#A3485A] hover:to-[#7d3535] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
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
              <span className="px-3 bg-black/40 text-gray-400">Don't have an account?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link to="/register">
            <button
              type="button"
              className="w-full border-2 border-[#842A3B] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#842A3B]/10 transition-all duration-300"
            >
              Create Account
            </button>
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-8">
          By signing in, you agree to our <a href="#" className="text-[#842A3B] hover:underline">Terms of Service</a> and <a href="#" className="text-[#842A3B] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
