import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/form");
    } else {
      alert("Invalid email or password");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label className="block mb-2 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`w-full mb-4 px-3 py-2 border rounded ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-red-500 mb-4">{errors.email.message}</p>}

        <label className="block mb-2 font-semibold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={`w-full mb-4 px-3 py-2 border rounded ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="text-red-500 mb-4">{errors.password.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
