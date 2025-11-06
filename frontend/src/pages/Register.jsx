import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Register() {
  const { register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password", "");

  async function onSubmit(data) {
    try {
      await registerUser(data.email, data.password);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Registration failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
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
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum length is 8" },
            validate: (val) =>
              [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) =>
                pattern.test(val)
              ) || "Password must contain lowercase, uppercase, number, and special character",
          })}
        />
        {errors.password && <p className="text-red-500 mb-4">{errors.password.message}</p>}

        <label className="block mb-2 font-semibold" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={`w-full mb-6 px-3 py-2 border rounded ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 mb-4">{errors.confirmPassword.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
