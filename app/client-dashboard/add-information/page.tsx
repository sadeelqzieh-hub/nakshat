"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./add-information.module.css";

const businessTypes = [
  "Restaurant",
  "Clothing Store",
  "Beauty Salon",
  "Gym",
  "Coffee Shop",
  "Marketing Agency",
  "Medical Center",
  "Pharmacy",
  "E-commerce",
  "Other",
];

const packageOptions = [
  "Basic Package",
  "Standard Package",
  "Premium Marketing Package",
  "Full Branding Package",
  "Social Media Package",
  "Custom Package",
];

const contractStatusOptions = [
  "Active",
  "Pending",
  "Paused",
  "Expired",
];

const locationOptions = [
  "Nablus",
  "Ramallah",
  "Jenin",
  "Tulkarm",
  "Qalqilya",
  "Jericho",
  "Hebron",
  "Bethlehem",
  "Jerusalem",
  "Gaza",
];

const socialPlatforms = [
  "Instagram",
  "Facebook",
  "TikTok",
  "LinkedIn",
  "X",
  "YouTube",
  "Snapchat",
];

export default function AddInformationPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [packageName, setPackageName] = useState("");
  const [contractStart, setContractStart] = useState("");
  const [contractStatus, setContractStatus] = useState("");
  const [website, setWebsite] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/client-profile");
        const data = await res.json();

        if (data.success && data.profile) {
          setCompanyName(data.profile.companyName || "");
          setBusinessType(data.profile.businessType || "");
          setContactPerson(data.profile.contactPerson || "");
          setPhone(data.profile.phone || "");
          setLocation(data.profile.location || "");
          setPackageName(data.profile.packageName || "");
          setContractStart(data.profile.contractStart || "");
          setContractStatus(data.profile.contractStatus || "");
          setWebsite(data.profile.website || "");

          if (data.profile.socialMedia) {
            const parts = String(data.profile.socialMedia).split(": ");
            if (parts.length >= 2) {
              setSocialPlatform(parts[0]);
              setSocialHandle(parts.slice(1).join(": "));
            } else {
              setSocialHandle(data.profile.socialMedia);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !companyName ||
      !businessType ||
      !contactPerson ||
      !phone ||
      !location ||
      !packageName ||
      !contractStart ||
      !contractStatus ||
      !website ||
      !socialPlatform ||
      !socialHandle
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/client-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          businessType,
          contactPerson,
          phone,
          location,
          packageName,
          contractStart,
          contractStatus,
          website,
          socialMedia: `${socialPlatform}: ${socialHandle}`,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrorMessage(data.message || "Failed to save information.");
        return;
      }

      setSuccessMessage("Information saved successfully.");

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
          <h1>Client Information</h1>
          <p>
            Complete your business information to unlock your dashboard and
            access all client services inside NAKSHET ADS.
          </p>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.headerBlock}>
            <h2>Add Information</h2>
            <p className={styles.subtitle}>
              Fill in your business details clearly and accurately.
            </p>
          </div>

          {loading ? (
            <div className={styles.loadingBox}>
              <p>Loading your information...</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSave}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label>Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className={styles.field}>
                  <label>Business Type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Enter contact person"
                  />
                </div>

                <div className={styles.field}>
                  <label>Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className={styles.field}>
                  <label>Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select location</option>
                    {locationOptions.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Package Name</label>
                  <select
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                  >
                    <option value="">Select package</option>
                    {packageOptions.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Contract Start</label>
                  <input
                    type="date"
                    value={contractStart}
                    onChange={(e) => setContractStart(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label>Contract Status</label>
                  <select
                    value={contractStatus}
                    onChange={(e) => setContractStatus(e.target.value)}
                  >
                    <option value="">Select contract status</option>
                    {contractStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Enter website"
                  />
                </div>

                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label>Social Media</label>
                  <div className={styles.socialRow}>
                    <select
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                    >
                      <option value="">Select platform</option>
                      {socialPlatforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={socialHandle}
                      onChange={(e) => setSocialHandle(e.target.value)}
                      placeholder="@youraccount"
                    />
                  </div>
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
                  Save Information
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}