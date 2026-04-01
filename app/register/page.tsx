"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.message || "Registration failed.");
        return;
      }

      setSuccessMessage("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <div className={styles.registerBox}>
        <div className={styles.leftSide}>
          <h1>Create Account</h1>
          <p>
            Join NAKSHET ADS and manage projects, designs,
            approvals, and communication in one place.
          </p>
        </div>

        <div className={styles.rightSide}>
          <h2>Register</h2>
          <p className={styles.subtitle}>Create your new account</p>

          <form className={styles.form} onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Register as</label>
            <div className={styles.roleOptions}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "company" ? styles.roleActive : ""}`}
                onClick={() => setRole("company")}
              >
                Company
              </button>

              <button
                type="button"
                className={`${styles.roleBtn} ${role === "client" ? styles.roleActive : ""}`}
                onClick={() => setRole("client")}
              >
                Client
              </button>

              <button
                type="button"
                className={`${styles.roleBtn} ${role === "designer" ? styles.roleActive : ""}`}
                onClick={() => setRole("designer")}
              >
                Designer
              </button>
            </div>

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

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}

            <button type="submit" className={styles.registerBtn}>
              Create Account
            </button>
          </form>

          <p className={styles.footerText}>
            Already have an account? <a href="/">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}