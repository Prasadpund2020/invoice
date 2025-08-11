"use client";

import "@/app/styles/SignUp_LogIn_Form.css";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false); // Stop loading

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    const res = await fetch("/api/Signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false); // Stop loading

    if (res.ok) {
      setIsLogin(true); // Switch to login view
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong.");
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      if (isLogin) {
        containerRef.current.classList.remove("active");
      } else {
        containerRef.current.classList.add("active");
      }
    }
  }, [isLogin]);

  return (
    <div className="auth-wrapper">
      <div className="container" ref={containerRef}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <span className="loader"></span> : "Login"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>

        {/* Signup Form */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Registration</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? <span className="loader"></span> : "Register"}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <p>or register with social platforms</p>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome!</h1>
            <p>Dont have an account?</p>
            <button
              className="btn register-btn"
              onClick={() => setIsLogin(false)}
              disabled={loading}
            >
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="btn login-btn"
              onClick={() => setIsLogin(true)}
              disabled={loading}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
