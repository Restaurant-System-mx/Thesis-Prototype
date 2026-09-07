import { useState } from "react";

import {
    fetchWithCsrf
} from "../services/csrf";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetchWithCsrf(
                "http://localhost:3000/api/auth/login",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid username or password");
                return;
            }

            onLogin(data.user);

        } catch (error) {
            console.error("Login error:", error);
            setError("Unable to connect to the server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

            <div className="w-full max-w-md">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">

                    {/* Restaurant branding */}
                    <div className="text-center mb-8">

                        <div className="w-24 h-24 mx-auto mb-5 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden bg-white">
                            <img
                                src="/restaurant-logo.png"
                                alt="Restaurant logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-800">
                            Restaurant Name
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Sign in to continue
                        </p>

                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block mb-2 text-sm font-semibold text-slate-700"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="Enter your username"
                                autoComplete="username"
                                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#86BEDA] focus:ring-2 focus:ring-[#86BEDA]/20"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-semibold text-slate-700"
                            >
                                Password
                            </label>

                            <div className="relative">

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#86BEDA] focus:ring-2 focus:ring-[#86BEDA]/20"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>

                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-[#86BEDA] px-4 py-3 text-sm font-bold text-slate-800 transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#86BEDA]/40 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                    </form>

                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Restaurant Management System
                </p>

            </div>

        </div>
    );
}

export default Login;
