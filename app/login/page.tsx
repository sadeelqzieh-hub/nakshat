import styles from "./login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.leftSide}>
          <h1>NAKSHET ADS</h1>
          <p>
            Manage your marketing projects, designs, approvals, and reports
            in one place.
          </p>
        </div>

        <div className={styles.rightSide}>
          <h2>Login</h2>
          <p className={styles.subtitle}>Sign in to your account</p>

          <form className={styles.form}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" />

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
            Don&apos;t have an account? <a href="#">Contact Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
}