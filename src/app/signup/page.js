"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });
  const [buttonDisabled, SetButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onSignup = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("signup success", response.data);
      router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      SetButtonDisabled(false);
    } else {
      SetButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="container mx-auto max-w-md p-6 bg-white rounded-lg shadow-lg space-y-8">
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src="/logo.png"
            alt="Logo"
            layout="fill"
            objectFit="contain"
            objectPosition="center"
          />
        </div>

        {/* Form */}
        <form className="space-y-6">
          <h5 className="text-center text-lg font-semibold">
            {loading ? "Processing..." : "Signup"}
          </h5>

          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-miles-500 focus:border-miles-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              onClick={onSignup}
              type="submit"
              className={`w-full py-2 px-4 text-white rounded-md shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-miles-500 focus:ring-offset-2 ${
                buttonDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-miles-600 hover:bg-miles-500"
              }`}
              disabled={buttonDisabled}
            >
              {buttonDisabled ? "No Signup" : "Signup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
