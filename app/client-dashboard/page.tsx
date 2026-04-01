"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./client-dashboard.module.css";

const designs = [
  {
    id: 1,
    title: "Logo Concepts",
    type: "Brand Identity",
    date: "Today",
    status: "Waiting Review",
    note: "The client should review the final colors and font style.",
  },
  {
    id: 2,
    title: "Story Design",
    type: "Instagram Story",
    date: "Yesterday",
    status: "Approved",
    note: "Approved and ready for publishing.",
  },
];

const videos = [
  {
    id: 1,
    title: "Restaurant Promo Video",
    type: "Promotional Video",
    stage: "Editing",
    date: "Apr 05, 2026",
    note: "Editing team is preparing the final cut.",
  },
];

const contentCalendar = [
  {
    id: 1,
    title: "Grand Opening Post",
    platform: "Instagram",
    type: "Post",
    date: "Apr 08, 2026",
    status: "Scheduled",
  },
];

const adsCampaigns = [
  {
    id: 1,
    name: "Eid Offer Campaign",
    platform: "Meta Ads",
    budget: "$500",
    duration: "Apr 1 - Apr 15",
    result: "1,240 clicks",
    status: "Active",
  },
];

const reports = [
  {
    id: 1,
    title: "Monthly Performance Report",
    period: "March 2026",
    metric: "Follower Growth",
    result: "+12%",
    status: "Ready",
  },
];

const files = [
  {
    id: 1,
    name: "Brand_Guidelines.pdf",
    type: "Brand Identity",
    date: "Apr 01, 2026",
    size: "2.4 MB",
    status: "Shared",
  },
];

const appointments = [
  { id: 1, title: "Meeting with Project Manager", date: "Apr 5, 2026", time: "11:00 AM" },
];

const notifications = [
  "A new design has been uploaded for your review.",
  "Your approval is needed for one campaign.",
];

const conversations = [
  {
    id: 1,
    name: "Project Manager",
    role: "Company",
    messages: [
      { id: 1, sender: "them", text: "Hello, your project is going well." },
      { id: 2, sender: "me", text: "Great, when will I receive the new design?" },
    ],
  },
];

function getDesignStatusClass(status: string) {
  if (status === "Approved") return styles.approved;
  if (status === "Updated") return styles.updated;
  return styles.waiting;
}

function getFileStatusClass(status: string) {
  if (status === "Signed") return styles.signed;
  if (status === "Ready") return styles.ready;
  return styles.shared;
}

function getVideoStageClass(stage: string) {
  if (stage === "Completed") return styles.videoCompleted;
  if (stage === "Review") return styles.videoReview;
  return styles.videoEditing;
}

function getCalendarStatusClass(status: string) {
  if (status === "Published") return styles.calendarPublished;
  if (status === "Ready") return styles.calendarReady;
  if (status === "Scheduled") return styles.calendarScheduled;
  return styles.calendarDraft;
}

function getAdsStatusClass(status: string) {
  if (status === "Completed") return styles.adsCompleted;
  if (status === "Pending Review") return styles.adsPending;
  if (status === "Running") return styles.adsRunning;
  return styles.adsActive;
}

function getReportStatusClass(status: string) {
  if (status === "Ready") return styles.reportReady;
  if (status === "Shared") return styles.reportShared;
  return styles.reportDraft;
}

type ClientProject = {
  id: number;
  name: string;
  service: string;
  status: string;
  deadline: string;
};

export default function ClientDashboardPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  const [clientInfo, setClientInfo] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const res = await fetch("/api/client-profile");
        const data = await res.json();

        if (data.success) {
          setClientInfo(data.profile);
        }
      } catch (error) {
        console.error("Failed to load client profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchClientProfile();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/client-projects");
        const data = await res.json();

        if (data.success) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setMessageText("");
  };

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
    });
    router.push("/");
  };

  const handleAddInformation = () => {
    router.push("/client-dashboard/add-information");
  };

  const dashboardLocked = !loadingProfile && !clientInfo;

  const totalProjects = projects.length;
  const pendingProjects = projects.filter(
    (project) => project.status === "Pending Approval"
  ).length;
  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  ).length;
  const inProgressProjects = projects.filter(
    (project) => project.status === "In Progress"
  ).length;

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>NAKSHET ADS</h2>

        <ul className={styles.menu}>
          <li
            className={activeSection === "dashboard" ? styles.active : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </li>

          <li
            className={activeSection === "client-info" ? styles.active : ""}
            onClick={() => setActiveSection("client-info")}
          >
            <div className={styles.menuWithBadge}>
              <span>Client Information</span>
              {!loadingProfile && !clientInfo && (
                <span className={styles.infoBadge}>Complete</span>
              )}
            </div>
          </li>

          <li
            className={`${activeSection === "projects" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("projects")}
          >
            My Projects
          </li>

          <li
            className={`${activeSection === "designs" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("designs")}
          >
            Designs
          </li>

          <li
            className={`${activeSection === "videos" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("videos")}
          >
            Videos
          </li>

          <li
            className={`${activeSection === "calendar" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("calendar")}
          >
            Content Calendar
          </li>

          <li
            className={`${activeSection === "ads" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("ads")}
          >
            Ads Management
          </li>

          <li
            className={`${activeSection === "reports" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("reports")}
          >
            Reports
          </li>

          <li
            className={`${activeSection === "files" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("files")}
          >
            Files
          </li>

          <li
            className={`${activeSection === "appointments" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("appointments")}
          >
            Appointments
          </li>

          <li
            className={`${activeSection === "notifications" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("notifications")}
          >
            Notifications
          </li>

          <li
            className={`${activeSection === "messages" ? styles.active : ""} ${
              dashboardLocked ? styles.lockedItem : ""
            }`}
            onClick={() => !dashboardLocked && setActiveSection("messages")}
          >
            Messages
          </li>
        </ul>
      </aside>

      <main className={styles.main}>
        {dashboardLocked ? (
          <>
            <header className={styles.topbar}>
              <div>
                <h1>Client Dashboard</h1>
                <p>Please complete your information first to unlock your dashboard.</p>
              </div>

              <div className={styles.topbarActions}>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </header>

            <section className={styles.singleSection}>
              <div className={styles.emptyInfoBox}>
                <h3>Complete Your Client Information First</h3>
                <p>
                  Your dashboard is currently locked because your client information
                  has not been added yet. Please add your information first to access
                  projects, files, reports, and all dashboard sections.
                </p>
                <button className={styles.addInfoBtn} onClick={handleAddInformation}>
                  Add Information
                </button>
              </div>
            </section>
          </>
        ) : (
          <>
            {activeSection === "dashboard" && (
              <>
                <header className={styles.topbar}>
                  <div>
                    <h1>Client Dashboard</h1>
                    <p>Track your projects, designs, videos, calendar, ads, reports, and files in one place.</p>
                  </div>

                  <div className={styles.topbarActions}>
                    <button className={styles.profileBtn}>Client Profile</button>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </header>

                <section className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <h3>My Projects</h3>
                    <p>{loadingProjects ? "..." : totalProjects}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Pending Approval</h3>
                    <p>{loadingProjects ? "..." : pendingProjects}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>In Progress</h3>
                    <p>{loadingProjects ? "..." : inProgressProjects}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Completed</h3>
                    <p>{loadingProjects ? "..." : completedProjects}</p>
                  </div>
                </section>

                <section className={styles.contentGrid}>
                  <div className={styles.card}>
                    <h2>My Projects</h2>

                    {loadingProjects ? (
                      <p>Loading projects...</p>
                    ) : projects.length > 0 ? (
                      projects.map((project) => (
                        <div key={project.id} className={styles.row}>
                          <div>
                            <h4>{project.name}</h4>
                            <span>{project.service}</span>
                          </div>
                          <strong>{project.status}</strong>
                        </div>
                      ))
                    ) : (
                      <p>No projects found yet.</p>
                    )}
                  </div>

                  <div className={styles.card}>
                    <h2>Latest Reports</h2>
                    {reports.map((report) => (
                      <div key={report.id} className={styles.row}>
                        <div>
                          <h4>{report.title}</h4>
                          <span>{report.period}</span>
                        </div>
                        <strong>{report.status}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeSection === "client-info" && (
              <section className={styles.singleSection}>
                <h1>Client Information</h1>

                <div className={styles.infoCard}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <h4>Company Name</h4>
                      <p>{clientInfo.companyName}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Business Type</h4>
                      <p>{clientInfo.businessType}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Contact Person</h4>
                      <p>{clientInfo.contactPerson}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Phone</h4>
                      <p>{clientInfo.phone}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Location</h4>
                      <p>{clientInfo.location}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Package</h4>
                      <p>{clientInfo.packageName}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Contract Start</h4>
                      <p>{clientInfo.contractStart}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Contract Status</h4>
                      <p>{clientInfo.contractStatus}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Website</h4>
                      <p>{clientInfo.website}</p>
                    </div>

                    <div className={styles.infoItem}>
                      <h4>Social Media</h4>
                      <p>{clientInfo.socialMedia}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "projects" && (
              <section className={styles.singleSection}>
                <h1>My Projects</h1>

                <div className={styles.card}>
                  {loadingProjects ? (
                    <p>Loading projects...</p>
                  ) : projects.length > 0 ? (
                    projects.map((project) => (
                      <div key={project.id} className={styles.row}>
                        <div>
                          <h4>{project.name}</h4>
                          <span>{project.service}</span>
                        </div>
                        <div>
                          <strong>{project.status}</strong>
                          <br />
                          <span>{project.deadline}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No projects found yet.</p>
                  )}
                </div>
              </section>
            )}

            {activeSection === "designs" && (
              <section className={styles.singleSection}>
                <h1>Designs</h1>
                <div className={styles.designsGrid}>
                  {designs.map((design) => (
                    <div key={design.id} className={styles.designCard}>
                      <div className={styles.cardTop}>
                        <div>
                          <h3>{design.title}</h3>
                          <span className={styles.designType}>{design.type}</span>
                        </div>
                        <span
                          className={`${styles.designStatus} ${getDesignStatusClass(
                            design.status
                          )}`}
                        >
                          {design.status}
                        </span>
                      </div>

                      <div className={styles.cardBody}>
                        <p><strong>Date:</strong> {design.date}</p>
                        <p><strong>Note:</strong> {design.note}</p>
                      </div>

                      <div className={styles.cardActions}>
                        <button className={styles.viewBtn}>View Design</button>
                        <button className={styles.approveBtn}>Approve</button>
                        <button className={styles.revisionBtn}>Request Revision</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "videos" && (
              <section className={styles.singleSection}>
                <h1>Videos</h1>
                <div className={styles.videosGrid}>
                  {videos.map((video) => (
                    <div key={video.id} className={styles.videoCard}>
                      <div className={styles.cardTop}>
                        <div>
                          <h3>{video.title}</h3>
                          <span className={styles.videoType}>{video.type}</span>
                        </div>
                        <span
                          className={`${styles.videoStage} ${getVideoStageClass(video.stage)}`}
                        >
                          {video.stage}
                        </span>
                      </div>

                      <div className={styles.cardBody}>
                        <p><strong>Date:</strong> {video.date}</p>
                        <p><strong>Note:</strong> {video.note}</p>
                      </div>

                      <div className={styles.cardActions}>
                        <button className={styles.viewBtn}>View Video</button>
                        <button className={styles.approveBtn}>Approve</button>
                        <button className={styles.revisionBtn}>Request Revision</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "calendar" && (
              <section className={styles.singleSection}>
                <h1>Content Calendar</h1>

                <div className={styles.calendarList}>
                  {contentCalendar.map((item) => (
                    <div key={item.id} className={styles.calendarRow}>
                      <div className={styles.calendarLeft}>
                        <h3>{item.title}</h3>
                        <p><strong>Platform:</strong> {item.platform}</p>
                        <p><strong>Type:</strong> {item.type}</p>
                      </div>

                      <div className={styles.calendarMiddle}>
                        <p><strong>Date:</strong> {item.date}</p>
                      </div>

                      <div className={styles.calendarRight}>
                        <span
                          className={`${styles.calendarStatus} ${getCalendarStatusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>

                        <div className={styles.cardActions}>
                          <button className={styles.viewBtn}>View</button>
                          <button className={styles.approveBtn}>Confirm</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "ads" && (
              <section className={styles.singleSection}>
                <h1>Ads Management</h1>
                <div className={styles.adsGrid}>
                  {adsCampaigns.map((ad) => (
                    <div key={ad.id} className={styles.adsCard}>
                      <div className={styles.cardTop}>
                        <div>
                          <h3>{ad.name}</h3>
                          <span className={styles.adsPlatform}>{ad.platform}</span>
                        </div>
                        <span className={`${styles.adsStatus} ${getAdsStatusClass(ad.status)}`}>
                          {ad.status}
                        </span>
                      </div>

                      <div className={styles.cardBody}>
                        <p><strong>Budget:</strong> {ad.budget}</p>
                        <p><strong>Duration:</strong> {ad.duration}</p>
                        <p><strong>Result:</strong> {ad.result}</p>
                      </div>

                      <div className={styles.cardActions}>
                        <button className={styles.viewBtn}>View Campaign</button>
                        <button className={styles.approveBtn}>Track Results</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "reports" && (
              <section className={styles.singleSection}>
                <h1>Reports</h1>
                <div className={styles.reportsGrid}>
                  {reports.map((report) => (
                    <div key={report.id} className={styles.reportCard}>
                      <div className={styles.cardTop}>
                        <div>
                          <h3>{report.title}</h3>
                          <span className={styles.reportPeriod}>{report.period}</span>
                        </div>
                        <span
                          className={`${styles.reportStatus} ${getReportStatusClass(report.status)}`}
                        >
                          {report.status}
                        </span>
                      </div>

                      <div className={styles.cardBody}>
                        <p><strong>Metric:</strong> {report.metric}</p>
                        <p><strong>Result:</strong> {report.result}</p>
                      </div>

                      <div className={styles.cardActions}>
                        <button className={styles.viewBtn}>View Report</button>
                        <button className={styles.downloadBtn}>Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "files" && (
              <section className={styles.singleSection}>
                <h1>Files</h1>
                <div className={styles.filesGrid}>
                  {files.map((file) => (
                    <div key={file.id} className={styles.fileCard}>
                      <div className={styles.cardTop}>
                        <div>
                          <h3>{file.name}</h3>
                          <span className={styles.fileType}>{file.type}</span>
                        </div>
                        <span
                          className={`${styles.fileStatus} ${getFileStatusClass(file.status)}`}
                        >
                          {file.status}
                        </span>
                      </div>

                      <div className={styles.cardBody}>
                        <p><strong>Date:</strong> {file.date}</p>
                        <p><strong>Size:</strong> {file.size}</p>
                      </div>

                      <div className={styles.cardActions}>
                        <button className={styles.viewBtn}>View</button>
                        <button className={styles.downloadBtn}>Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "appointments" && (
              <section className={styles.singleSection}>
                <h1>Appointments</h1>
                <div className={styles.card}>
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className={styles.row}>
                      <div>
                        <h4>{appointment.title}</h4>
                        <span>{appointment.date}</span>
                      </div>
                      <strong>{appointment.time}</strong>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "notifications" && (
              <section className={styles.singleSection}>
                <h1>Notifications</h1>
                <div className={styles.card}>
                  <ul className={styles.notificationList}>
                    {notifications.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {activeSection === "messages" && (
              <section className={styles.chatSection}>
                <div className={styles.chatSidebar}>
                  <h1>Messages</h1>

                  {conversations.map((chat) => (
                    <div
                      key={chat.id}
                      className={`${styles.chatUser} ${
                        selectedChat.id === chat.id ? styles.chatUserActive : ""
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <h4>{chat.name}</h4>
                      <span>{chat.role}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.chatBox}>
                  <div className={styles.chatHeader}>
                    <h2>{selectedChat.name}</h2>
                    <span>{selectedChat.role}</span>
                  </div>

                  <div className={styles.messagesArea}>
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={
                          message.sender === "me" ? styles.myMessage : styles.theirMessage
                        }
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>

                  <div className={styles.messageInputArea}>
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}