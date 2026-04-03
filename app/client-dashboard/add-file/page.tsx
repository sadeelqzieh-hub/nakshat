"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./add-file.module.css";

const fileTypes = [
  "Brand Identity",
  "Images",
  "Video",
  "Contract",
  "Presentation",
  "Social Media Content",
  "Other",
];

const fileStatuses = [
  "Uploaded",
  "Shared",
  "Ready",
  "Signed",
];

export default function AddFilePage() {
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedFile || !type || !status || !date) {
      setErrorMessage("Please fill in all fields and choose a file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", type);
      formData.append("status", status);
      formData.append("date", date);

      const res = await fetch("/api/client-files", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.message || "Failed to upload file.");
        return;
      }

      setSuccessMessage("File uploaded successfully.");

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
          <h1>Add File</h1>
          <p>
            Upload your real file from your device and keep all your project
            assets organized in one professional place inside NAKSHET ADS.
          </p>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.headerBlock}>
            <h2>Upload File</h2>
            <p className={styles.subtitle}>Choose a file and complete its details</p>
          </div>

          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Select File</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setSelectedFile(file);
                  }}
                />
              </div>

              <div className={styles.field}>
                <label>File Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Select file type</option>
                  {fileTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Select status</option>
                  {fileStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                Upload File
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}