"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./request-service.module.css";

const serviceOptions = [
  "Social Media Management",
  "Advertising Campaign",
  "Video Production",
  "Brand Identity Design",
  "Website Development",
];

const priorityOptions = ["Low", "Medium", "High"];

export default function RequestServicePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [preferredStartDate, setPreferredStartDate] = useState("");
  const [priority, setPriority] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !title ||
      !serviceType ||
      !description ||
      !preferredStartDate ||
      !priority
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/client-service-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          serviceType,
          description,
          preferredStartDate,
          priority,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.message || "Failed to send request.");
        return;
      }

      setSuccessMessage("Service request sent successfully.");

      setTimeout(() => {
        router.push("/client-dashboard");
      }, 1000);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <div className={styles.pageBox}>
        <div className={styles.leftSide}>
          <h1>Request New Service</h1>
          <p>
            Send your service request to the company so the team can review it
            and turn it into an official project.
          </p>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.headerBlock}>
            <h2>New Service Request</h2>
            <p className={styles.subtitle}>Fill in the request details below</p>
          </div>

          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Request Title</label>
                <input
                  type="text"
                  placeholder="Enter request title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label>Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                >
                  <option value="">Select service type</option>
                  {serviceOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Select priority</option>
                  {priorityOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Preferred Start Date</label>
                <input
                  type="date"
                  value={preferredStartDate}
                  onChange={(e) => setPreferredStartDate(e.target.value)}
                />
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Description</label>
                <textarea
                  placeholder="Describe the service you need"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </div>

            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}

            <div className={styles.buttonRow}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.push("/client-dashboard")}
              >
                Cancel
              </button>

              <button type="submit" className={styles.saveBtn}>
                Send Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}