"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.message || "Login failed.");
        return;
      }

      setSuccessMessage("Login successful. Redirecting...");

      setTimeout(() => {
        if (data.role === "company") {
          router.push("/company-home");
        } else if (data.role === "designer") {
          router.push("/designer-dashboard");
        } else {
          router.push("/client-dashboard");
        }
      }, 1000);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <div className={styles.loginBox}>
        <div className={styles.leftSide}>
          <h1>NAKSHET ADS</h1>
          <p>
            Manage your marketing projects, designs, approvals,
            and reports in one place.
          </p>
        </div>

        <div className={styles.rightSide}>
          <h2>Login</h2>
          <p className={styles.subtitle}>Sign in to your account</p>

          <form className={styles.form} onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}

            <div className={styles.options}>
              <label className={styles.remember}>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit" className={styles.loginBtn}>
              Login
            </button>
          </form>

          <p className={styles.footerText}>
            Don&apos;t have an account? <a href="/register">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}