"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./company-home.module.css";

export default function CompanyHomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <div className={styles.card}>
        <div className={styles.topBar}>
          <div className={styles.brand}>
            <Image
              src="/chameleon-logo.png"
              alt="Chameleon Logo"
              width={55}
              height={55}
              className={styles.logo}
            />
            <span>Nakshet Ads</span>
          </div>

          <div className={styles.topActions}>
            <span className={styles.roleTag}>Business Owner / Brand Owner</span>
            <button
              className={styles.logoutBtn}
              onClick={() => router.push("/")}
            >
              Logout
            </button>
          </div>
        </div>

        <div className={styles.hero}>
          <h1>Welcome to Nakshet Ads</h1>
          <p>
            We help businesses manage digital marketing projects, campaigns,
            design reviews, content planning, and communication with clients in
            one organized platform.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.featureCard}>
            <h3>Project Management</h3>
            <p>Track tasks, deadlines, and project progress in one place.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Campaign Management</h3>
            <p>Manage social media and paid advertising campaigns clearly.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Design Review</h3>
            <p>Review designs, approvals, and requested changes easily.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Client Communication</h3>
            <p>Keep communication organized between company and clients.</p>
          </div>
        </div>

        <button
          className={styles.mainBtn}
          onClick={() => router.push("/company-dashboard")}
        >
          Go to My Page
        </button>
      </div>
    </div>
  );
}