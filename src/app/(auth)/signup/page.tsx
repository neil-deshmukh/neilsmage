"use client"

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter()
    

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (error) {
      console.error(error)
      return
    }
    if (!data.user) {
      console.error("user id does not exist")
      return
    }

    const api_key = []
    const possible_chars = [
      ...'abcdefghijklmnopqrstuvwxyz',      // 26 lower
      ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',      // 26 upper
      ...'0123456789',                      // 10 digits
      '!', '_', '@'                         // 3 specials
    ];
    for (let i = 0; i < 20; i++) {
      api_key.push(possible_chars[Math.floor(Math.random() * 65)])
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {data: res, error: err } = await supabase.from("users").insert({
      id: data.user.id,
      api_key: api_key.join("")
    })
    if (err) {
      console.error(err)
    }
    router.replace("/dashboard")
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-gray-600">Start managing your images like a pro</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create Account
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
