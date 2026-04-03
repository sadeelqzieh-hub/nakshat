"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./client-dashboard.module.css";

type ClientProject = {
  id: number;
  name: string;
  service: string;
  status: string;
  deadline: string;
};

type ClientFile = {
  id: number;
  name: string;
  type: string;
  size: string;
  status: string;
  date: string;
  filePath: string;
};

type ClientReport = {
  id: number;
  title: string;
  period: string;
  metric: string;
  result: string;
  status: string;
};

type ServiceRequest = {
  id: number;
  title: string;
  serviceType: string;
  description: string;
  preferredStartDate: string;
  priority: string;
  status: string;
};

type ClientDesign = {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  note: string;
  previewPath?: string | null;
};

type ClientVideo = {
  id: number;
  title: string;
  type: string;
  date: string;
  status: string;
  note: string;
  videoPath?: string | null;
};

function getDesignStatusClass(status: string, styles: any) {
  if (status === "Approved") return styles.approved;
  if (status === "Revision Needed") return styles.updated;
  if (status === "Rejected") return styles.revisionNeeded;
  return styles.waiting;
}

function getVideoStatusClass(status: string, styles: any) {
  if (status === "Approved") return styles.videoCompleted;
  if (status === "Revision Needed") return styles.videoReview;
  if (status === "Rejected") return styles.videoRejected;
  return styles.videoEditing;
}

export default function ClientDashboardPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashboard");

  const [clientInfo, setClientInfo] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [files, setFiles] = useState<ClientFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const [reports, setReports] = useState<ClientReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [designs, setDesigns] = useState<ClientDesign[]>([]);
  const [loadingDesigns, setLoadingDesigns] = useState(true);

  const [videos, setVideos] = useState<ClientVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const res = await fetch("/api/client-profile");
        const data = await res.json();
        if (data.success) setClientInfo(data.profile);
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
        if (data.success) setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/client-files");
        const data = await res.json();
        if (data.success) setFiles(data.files || []);
      } catch (error) {
        console.error("Failed to load files");
      } finally {
        setLoadingFiles(false);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/client-reports");
        const data = await res.json();
        if (data.success) setReports(data.reports || []);
      } catch (error) {
        console.error("Failed to load reports");
      } finally {
        setLoadingReports(false);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/client-service-requests");
        const data = await res.json();
        if (data.success) setRequests(data.requests || []);
      } catch (error) {
        console.error("Failed to load service requests");
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await fetch("/api/client-designs");
        const data = await res.json();
        if (data.success) setDesigns(data.designs || []);
      } catch (error) {
        console.error("Failed to load designs");
      } finally {
        setLoadingDesigns(false);
      }
    };
    fetchDesigns();
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/client-videos");
        const data = await res.json();
        if (data.success) setVideos(data.videos || []);
      } catch (error) {
        console.error("Failed to load videos");
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchVideos();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  const handleAddInformation = () => {
    router.push("/client-dashboard/add-information");
  };

  const handleAddFile = () => {
    router.push("/client-dashboard/add-file");
  };

  const handleRequestService = () => {
    router.push("/client-dashboard/request-service");
  };

  const handleDesignAction = async (
    designId: number,
    action: "approve" | "revision" | "reject"
  ) => {
    try {
      const res = await fetch(`/api/client-designs/${designId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!data.success) return;

      setDesigns((prev) =>
        prev.map((design) =>
          design.id === designId ? { ...design, status: data.design.status } : design
        )
      );
    } catch (error) {
      console.error("Failed to update design status");
    }
  };

  const handleVideoAction = async (
    videoId: number,
    action: "approve" | "revision" | "reject"
  ) => {
    try {
      const res = await fetch(`/api/client-videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!data.success) return;

      setVideos((prev) =>
        prev.map((video) =>
          video.id === videoId ? { ...video, status: data.video.status } : video
        )
      );
    } catch (error) {
      console.error("Failed to update video status");
    }
  };

  const dashboardLocked = !loadingProfile && !clientInfo;

  const emptySection = (title: string, text: string) => (
    <section className={styles.singleSection}>
      <h1>{title}</h1>
      <div className={styles.emptyInfoBox}>
        <h3>No Data Yet</h3>
        <p>{text}</p>
      </div>
    </section>
  );

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>NAKSHET ADS</h2>

        <ul className={styles.menu}>
          <li className={activeSection === "dashboard" ? styles.active : ""} onClick={() => setActiveSection("dashboard")}>Dashboard</li>
          <li className={activeSection === "client-info" ? styles.active : ""} onClick={() => setActiveSection("client-info")}>
            <div className={styles.menuWithBadge}>
              <span>Client Information</span>
              {!loadingProfile && !clientInfo && <span className={styles.infoBadge}>Complete</span>}
            </div>
          </li>
          <li className={activeSection === "service-requests" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("service-requests")}>Service Requests</li>
          <li className={activeSection === "projects" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("projects")}>My Projects</li>
          <li className={activeSection === "designs" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("designs")}>Designs</li>
          <li className={activeSection === "videos" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("videos")}>Videos</li>
          <li className={activeSection === "shooting-schedule" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("shooting-schedule")}>Shooting Schedule</li>
          <li className={activeSection === "calendar" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("calendar")}>Content Calendar</li>
          <li className={activeSection === "ads" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("ads")}>Ads Management</li>
          <li className={activeSection === "reports" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("reports")}>Reports</li>
          <li className={activeSection === "files" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("files")}>Files</li>
          <li className={activeSection === "messages" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("messages")}>Messages</li>
          <li className={activeSection === "approvals" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("approvals")}>Approvals</li>
          <li className={activeSection === "notifications" ? styles.active : ""} onClick={() => !dashboardLocked && setActiveSection("notifications")}>Notifications</li>
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
                <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
              </div>
            </header>

            <section className={styles.singleSection}>
              <div className={styles.emptyInfoBox}>
                <h3>Complete Your Client Information First</h3>
                <p>Your dashboard is currently locked because your client information has not been added yet.</p>
                <button className={styles.addInfoBtn} onClick={handleAddInformation}>Add Information</button>
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
                    <p>Track your requests, projects, files, reports, designs, and videos in one place.</p>
                  </div>
                  <div className={styles.topbarActions}>
                    <button className={styles.profileBtn} onClick={handleRequestService}>+ Request Service</button>
                    <button className={styles.profileBtn} onClick={handleAddFile}>+ Add New File</button>
                    <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                  </div>
                </header>

                <section className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <h3>Service Requests</h3>
                    <p>{loadingRequests ? "..." : requests.length}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Projects</h3>
                    <p>{loadingProjects ? "..." : projects.length}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Designs</h3>
                    <p>{loadingDesigns ? "..." : designs.length}</p>
                  </div>
                  <div className={styles.summaryCard}>
                    <h3>Videos</h3>
                    <p>{loadingVideos ? "..." : videos.length}</p>
                  </div>
                </section>
              </>
            )}

            {activeSection === "client-info" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>Client Information</h1>
                    <p>Your saved business information.</p>
                  </div>
                  <div className={styles.topbarActions}>
                    <button className={styles.profileBtn} onClick={handleAddInformation}>Edit Information</button>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}><h4>Company Name</h4><p>{clientInfo.companyName}</p></div>
                    <div className={styles.infoItem}><h4>Business Type</h4><p>{clientInfo.businessType}</p></div>
                    <div className={styles.infoItem}><h4>Contact Person</h4><p>{clientInfo.contactPerson}</p></div>
                    <div className={styles.infoItem}><h4>Phone</h4><p>{clientInfo.phone}</p></div>
                    <div className={styles.infoItem}><h4>Location</h4><p>{clientInfo.location}</p></div>
                    <div className={styles.infoItem}><h4>Package</h4><p>{clientInfo.packageName}</p></div>
                    <div className={styles.infoItem}><h4>Contract Start</h4><p>{clientInfo.contractStart}</p></div>
                    <div className={styles.infoItem}><h4>Contract Status</h4><p>{clientInfo.contractStatus}</p></div>
                    <div className={styles.infoItem}><h4>Website</h4><p>{clientInfo.website}</p></div>
                    <div className={styles.infoItem}><h4>Social Media</h4><p>{clientInfo.socialMedia}</p></div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "service-requests" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>Service Requests</h1>
                    <p>Send and follow your service requests here.</p>
                  </div>
                  <div className={styles.topbarActions}>
                    <button className={styles.profileBtn} onClick={handleRequestService}>+ Request New Service</button>
                  </div>
                </div>

                <div className={styles.card}>
                  {loadingRequests ? (
                    <p>Loading requests...</p>
                  ) : requests.length > 0 ? (
                    requests.map((request) => (
                      <div key={request.id} className={styles.row}>
                        <div>
                          <h4>{request.title}</h4>
                          <span>{request.serviceType}</span>
                        </div>
                        <div>
                          <strong>{request.status}</strong>
                          <br />
                          <span>{request.priority}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyMiniBox}>
                      <p>No service requests found yet.</p>
                      <button className={styles.addInfoBtn} onClick={handleRequestService}>Send Your First Request</button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "projects" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>My Projects</h1>
                    <p>Follow your confirmed projects here.</p>
                  </div>
                </div>

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
                    <div className={styles.emptyMiniBox}>
                      <p>No projects available yet.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "designs" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>Designs</h1>
                    <p>Review your designs and send approval actions.</p>
                  </div>
                </div>

                <div className={styles.designsGrid}>
                  {loadingDesigns ? (
                    <p>Loading designs...</p>
                  ) : designs.length > 0 ? (
                    designs.map((design) => (
                      <div key={design.id} className={styles.designCard}>
                        <div className={styles.cardTop}>
                          <div>
                            <h3>{design.title}</h3>
                            <span className={styles.designType}>{design.type}</span>
                          </div>
                          <span className={`${styles.designStatus} ${getDesignStatusClass(design.status, styles)}`}>
                            {design.status}
                          </span>
                        </div>

                        <div className={styles.cardBody}>
                          <p><strong>Date:</strong> {design.date}</p>
                          <p><strong>Note:</strong> {design.note}</p>
                        </div>

                        <div className={styles.cardActions}>
                          {design.previewPath ? (
                            <a className={styles.viewBtn} href={design.previewPath} target="_blank" rel="noreferrer">
                              View Design
                            </a>
                          ) : (
                            <button className={styles.viewBtn}>Preview Soon</button>
                          )}

                          <button className={styles.approveBtn} onClick={() => handleDesignAction(design.id, "approve")}>Approve</button>
                          <button className={styles.revisionBtn} onClick={() => handleDesignAction(design.id, "revision")}>Request Revision</button>
                          <button className={styles.rejectBtn} onClick={() => handleDesignAction(design.id, "reject")}>Reject</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyInfoBox}>
                      <h3>No Designs Yet</h3>
                      <p>No designs found yet.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "videos" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>Videos</h1>
                    <p>Review your videos and send approval actions.</p>
                  </div>
                </div>

                <div className={styles.designsGrid}>
                  {loadingVideos ? (
                    <p>Loading videos...</p>
                  ) : videos.length > 0 ? (
                    videos.map((video) => (
                      <div key={video.id} className={styles.designCard}>
                        <div className={styles.cardTop}>
                          <div>
                            <h3>{video.title}</h3>
                            <span className={styles.designType}>{video.type}</span>
                          </div>
                          <span className={`${styles.designStatus} ${getVideoStatusClass(video.status, styles)}`}>
                            {video.status}
                          </span>
                        </div>

                        <div className={styles.cardBody}>
                          <p><strong>Date:</strong> {video.date}</p>
                          <p><strong>Note:</strong> {video.note}</p>
                        </div>

                        <div className={styles.cardActions}>
                          {video.videoPath ? (
                            <a className={styles.viewBtn} href={video.videoPath} target="_blank" rel="noreferrer">
                              View Video
                            </a>
                          ) : (
                            <button className={styles.viewBtn}>Video Soon</button>
                          )}

                          <button className={styles.approveBtn} onClick={() => handleVideoAction(video.id, "approve")}>Approve</button>
                          <button className={styles.revisionBtn} onClick={() => handleVideoAction(video.id, "revision")}>Request Revision</button>
                          <button className={styles.rejectBtn} onClick={() => handleVideoAction(video.id, "reject")}>Reject</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyInfoBox}>
                      <h3>No Videos Yet</h3>
                      <p>No videos found yet.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "approvals" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>Approvals</h1>
                    <p>Review all items waiting for your action.</p>
                  </div>
                </div>

                <div className={styles.designsGrid}>
                  {loadingDesigns || loadingVideos ? (
                    <p>Loading approvals...</p>
                  ) : [...designs.filter((d) => d.status === "Waiting Review"), ...videos.filter((v) => v.status === "Waiting Review")].length > 0 ? (
                    <>
                      {designs
                        .filter((d) => d.status === "Waiting Review")
                        .map((design) => (
                          <div key={`design-${design.id}`} className={styles.designCard}>
                            <div className={styles.cardTop}>
                              <div>
                                <h3>{design.title}</h3>
                                <span className={styles.designType}>Design • {design.type}</span>
                              </div>
                              <span className={`${styles.designStatus} ${styles.waiting}`}>{design.status}</span>
                            </div>
                            <div className={styles.cardBody}>
                              <p><strong>Date:</strong> {design.date}</p>
                              <p><strong>Note:</strong> {design.note}</p>
                            </div>
                            <div className={styles.cardActions}>
                              <button className={styles.approveBtn} onClick={() => handleDesignAction(design.id, "approve")}>Approve</button>
                              <button className={styles.revisionBtn} onClick={() => handleDesignAction(design.id, "revision")}>Request Revision</button>
                              <button className={styles.rejectBtn} onClick={() => handleDesignAction(design.id, "reject")}>Reject</button>
                            </div>
                          </div>
                        ))}

                      {videos
                        .filter((v) => v.status === "Waiting Review")
                        .map((video) => (
                          <div key={`video-${video.id}`} className={styles.designCard}>
                            <div className={styles.cardTop}>
                              <div>
                                <h3>{video.title}</h3>
                                <span className={styles.designType}>Video • {video.type}</span>
                              </div>
                              <span className={`${styles.designStatus} ${styles.videoEditing}`}>{video.status}</span>
                            </div>
                            <div className={styles.cardBody}>
                              <p><strong>Date:</strong> {video.date}</p>
                              <p><strong>Note:</strong> {video.note}</p>
                            </div>
                            <div className={styles.cardActions}>
                              <button className={styles.approveBtn} onClick={() => handleVideoAction(video.id, "approve")}>Approve</button>
                              <button className={styles.revisionBtn} onClick={() => handleVideoAction(video.id, "revision")}>Request Revision</button>
                              <button className={styles.rejectBtn} onClick={() => handleVideoAction(video.id, "reject")}>Reject</button>
                            </div>
                          </div>
                        ))}
                    </>
                  ) : (
                    <div className={styles.emptyInfoBox}>
                      <h3>No Approval Items</h3>
                      <p>No designs or videos are waiting for approval right now.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "files" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>Files</h1>
                    <p>Manage and follow all your files in one place.</p>
                  </div>
                  <div className={styles.topbarActions}>
                    <button className={styles.profileBtn} onClick={handleAddFile}>+ Add New File</button>
                  </div>
                </div>

                <div className={styles.card}>
                  {loadingFiles ? (
                    <p>Loading files...</p>
                  ) : files.length > 0 ? (
                    files.map((file) => (
                      <div key={file.id} className={styles.row}>
                        <div>
                          <h4>{file.name}</h4>
                          <span>{file.type}</span>
                        </div>
                        <div>
                          <strong>{file.status}</strong>
                          <br />
                          <span>{file.size}</span>
                          <br />
                          <a href={file.filePath} target="_blank" rel="noreferrer">View / Download</a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyMiniBox}>
                      <p>No files found yet.</p>
                      <button className={styles.addInfoBtn} onClick={handleAddFile}>Add Your First File</button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "reports" && (
              <section className={styles.singleSection}>
                <div className={styles.topbar}>
                  <div>
                    <h1>Reports</h1>
                    <p>View all reports shared with your account.</p>
                  </div>
                </div>

                <div className={styles.card}>
                  {loadingReports ? (
                    <p>Loading reports...</p>
                  ) : reports.length > 0 ? (
                    reports.map((report) => (
                      <div key={report.id} className={styles.row}>
                        <div>
                          <h4>{report.title}</h4>
                          <span>{report.period}</span>
                        </div>
                        <div>
                          <strong>{report.status}</strong>
                          <br />
                          <span>{report.result}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyMiniBox}>
                      <p>No reports available yet.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "shooting-schedule" &&
              emptySection("Shooting Schedule", "No shooting schedule available yet.")}

            {activeSection === "calendar" &&
              emptySection("Content Calendar", "No content calendar items found yet.")}

            {activeSection === "ads" &&
              emptySection("Ads Management", "No ads campaigns found yet.")}

            {activeSection === "messages" &&
              emptySection("Messages", "No messages found yet.")}

            {activeSection === "notifications" &&
              emptySection("Notifications", "No notifications found yet.")}
          </>
        )}
      </main>
    </div>
  );
}