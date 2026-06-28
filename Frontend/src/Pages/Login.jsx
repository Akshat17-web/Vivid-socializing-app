import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ShipWheel } from "lucide-react";
import { axiosInstance } from "../lib/axios.js";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/login", loginData);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
    onError: (err) => {
      toast.error(err.response?.data?.message || "Invalid email or password");
    },
  });

  const handlelogin = (e) => {
    e.preventDefault();
    mutate();
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="forest"
    >
      <div className="w-full max-w-5xl bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-2xl">
        <div className="grid lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="p-8 md:p-12">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <ShipWheel className="size-10 text-success" />
              <h1 className="text-4xl font-bold text-success">Vivid</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold">Welcome back!</h2>
            </div>

            <form className="space-y-5" onSubmit={handlelogin}>
              {/* Email */}
              <div>
                <label className="label">
                  <span className="label-text mb-2">Email</span>
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="input input-bordered w-full rounded-full"
                />
              </div>

              {/* Password */}
              <div>
                <label className="label">
                  <span className="label-text mb-2">Password</span>
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="input input-bordered w-full rounded-full"
                />
              </div>

              {/* Terms */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="checkbox checkbox-success checkbox-sm"
                  />

                  <span className="text-sm">
                    I agree to the{" "}
                    <a href="#" className="text-success hover:underline">
                      terms of service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-success hover:underline">
                      privacy policy
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success w-full rounded-full text-base text-white"
              >
                {isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Signing in
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-base-content/70">
                Don't have an account?{" "}
              </span>

              <Link to="/signup" className="text-primary hover:underline">Create One</Link>
            </div>
          </div>
          {/* RIGHT SIDE */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-linear-to-br from-green-950 via-green-900 to-green-950 p-10">
            <img
              src="signup_vivid.png"
              alt="Video Call Illustration"
              className="w-full max-w-sm mb-8"
            />

            <h2 className="text-3xl font-bold text-center mb-4">
              Connect with language partners worldwide
            </h2>

            <p className="text-center text-base-content/70 max-w-md">
              Practice conversations, make friends, and improve your language
              skills together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
