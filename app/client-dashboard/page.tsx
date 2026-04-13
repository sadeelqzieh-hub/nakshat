"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./client-dashboard.module.css";
import {
  Bell,
  Briefcase,
  CheckCircle2,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  UserRound,
  Video,
} from "lucide-react";

type ClientInfo = {
  companyName?: string;
  businessType?: string;
  contactPerson?: string;
  phone?: string;
  location?: string;
  packageName?: string;
  contractStart?: string;
  contractStatus?: string;
  website?: string;
  socialMedia?: string;
};

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

type ChatUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ChatMessage = {
  id: number;
  text?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  createdAt: string;
  sender: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

type ConversationItem = {
  id: number;
  otherUser: ChatUser;
  lastMessage: {
    id: number;
    text?: string | null;
    fileName?: string | null;
    createdAt: string;
  } | null;
  updatedAt: string;
};

type UserSettingsType = {
  theme: "light" | "dark";
};

function formatValue(value?: string | null) {
  if (!value || value.trim() === "") return "Not provided";
  return value;
}

function getDesignStatusClass(status: string, stylesObj: typeof styles) {
  if (status === "Approved") return stylesObj.approved;
  if (status === "Revision Needed") return stylesObj.updated;
  if (status === "Rejected") return stylesObj.revisionNeeded;
  return stylesObj.waiting;
}

function getVideoStatusClass(status: string, stylesObj: typeof styles) {
  if (status === "Approved") return stylesObj.videoCompleted;
  if (status === "Revision Needed") return stylesObj.videoReview;
  if (status === "Rejected") return stylesObj.videoRejected;
  return stylesObj.videoEditing;
}

export default function ClientDashboardPage() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashboard");

  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
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

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingTheme, setSavingTheme] = useState(false);

  const [chatSearch, setChatSearch] = useState("");
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loadingChatUsers, setLoadingChatUsers] = useState(false);

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<ChatUser | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const res = await fetch("/api/client-profile");
        const data = await res.json();
        if (data.success) setClientInfo(data.profile);
      } catch (error) {
        console.error("Failed to load client profile", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchClientProfile();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/client-project");
        const data = await res.json();
        if (data.success) setProjects(data.projects || []);
      } catch (error) {
        console.error("Failed to load projects", error);
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
        console.error("Failed to load files", error);
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
        console.error("Failed to load reports", error);
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
        console.error("Failed to load service requests", error);
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
        console.error("Failed to load designs", error);
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
        console.error("Failed to load videos", error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success && data.settings?.theme) {
          setTheme(data.settings.theme);
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/chat/conversations");
        const data = await res.json();
        if (data.success) setConversations(data.conversations || []);
      } catch (error) {
        console.error("Failed to load conversations", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeSection !== "messages") return;

    const fetchUsers = async () => {
      try {
        setLoadingChatUsers(true);
        const query = chatSearch.trim();
        const res = await fetch(`/api/chat/users?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) setChatUsers(data.users || []);
      } catch (error) {
        console.error("Failed to search users", error);
      } finally {
        setLoadingChatUsers(false);
      }
    };

    const timeout = setTimeout(fetchUsers, 250);
    return () => clearTimeout(timeout);
  }, [chatSearch, activeSection]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await fetch(
          `/api/chat/messages?conversationId=${selectedConversationId}`
        );
        const data = await res.json();
        if (data.success) setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

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
      console.error("Failed to update design status", error);
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
      console.error("Failed to update video status", error);
    }
  };

  const handleThemeChange = async (nextTheme: "light" | "dark") => {
    try {
      setSavingTheme(true);
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: nextTheme }),
      });

      const data = await res.json();
      if (data.success) {
        setTheme(data.settings.theme);
      }
    } catch (error) {
      console.error("Failed to update theme", error);
    } finally {
      setSavingTheme(false);
    }
  };

  const handleOpenConversation = async (user: ChatUser) => {
    try {
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id }),
      });

      const data = await res.json();
      if (!data.success) return;

      setSelectedConversationId(data.conversation.id);
      setSelectedChatUser(user);
      setActiveSection("messages");

      const refresh = await fetch("/api/chat/conversations");
      const refreshData = await refresh.json();
      if (refreshData.success) setConversations(refreshData.conversations || []);
    } catch (error) {
      console.error("Failed to open conversation", error);
    }
  };

  const handleSelectConversation = async (conversation: ConversationItem) => {
    setSelectedConversationId(conversation.id);
    setSelectedChatUser(conversation.otherUser);
  };

  const handleSendMessage = async () => {
    const text = messageText.trim();
    if (!selectedConversationId || !text || sendingMessage) return;

    try {
      setSendingMessage(true);

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedConversationId, text }),
      });

      const data = await res.json();
      if (!data.success) return;

      setMessages((prev) => [...prev, data.message]);
      setMessageText("");

      const refresh = await fetch("/api/chat/conversations");
      const refreshData = await refresh.json();
      if (refreshData.success) setConversations(refreshData.conversations || []);
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const dashboardLocked = !loadingProfile && !clientInfo;

  const approvalItemsCount = useMemo(() => {
    const pendingDesigns = designs.filter((d) => d.status === "Waiting Review").length;
    const pendingVideos = videos.filter((v) => v.status === "Waiting Review").length;
    return pendingDesigns + pendingVideos;
  }, [designs, videos]);

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "client-info", label: "Client Information", icon: UserRound },
    { key: "service-requests", label: "Service Requests", icon: Briefcase },
    { key: "projects", label: "My Projects", icon: FolderOpen },
    { key: "designs", label: "Designs", icon: ImageIcon },
    { key: "videos", label: "Videos", icon: Video },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "files", label: "Files", icon: FolderOpen },
    { key: "approvals", label: "Approvals", icon: CheckCircle2 },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  const emptySection = (title: string, text: string) => (
    <section className={styles.singleSection}>
      <div className={styles.sectionTitleWrap}>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>

      <div className={styles.emptyInfoBox}>
        <h3>No Data Yet</h3>
        <p>{text}</p>
      </div>
    </section>
  );

  return (
    <div className={`${styles.page} ${theme === "dark" ? styles.dark : styles.light}`}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandLogo}>N</div>
          <div>
            <h2>NAKSHET ADS</h2>
            <p>Client Panel</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            const isDisabled =
              dashboardLocked &&
              item.key !== "dashboard" &&
              item.key !== "client-info" &&
              item.key !== "settings";

            return (
              <button
                key={item.key}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => {
                  if (!isDisabled) setActiveSection(item.key);
                }}
              >
                <span className={styles.navItemLeft}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </span>

                {item.key === "client-info" && !loadingProfile && !clientInfo && (
                  <span className={styles.badgeWarn}>Complete</span>
                )}

                {item.key === "approvals" && approvalItemsCount > 0 && (
                  <span className={styles.badgeCount}>{approvalItemsCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <button
            className={styles.themeToggle}
            onClick={() => handleThemeChange(theme === "light" ? "dark" : "light")}
            disabled={savingTheme || loadingSettings}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
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
                <button className={styles.primaryBtn} onClick={handleAddInformation}>
                  <Plus size={16} />
                  <span>Add Information</span>
                </button>
              </div>
            </header>

            <section className={styles.heroCard}>
              <div className={styles.heroText}>
                <span className={styles.heroTag}>Account Setup</span>
                <h2>Complete your client profile first</h2>
                <p>
                  Once your business information is added, all sections become active:
                  projects, files, service requests, messages, reports, designs, and videos.
                </p>
                <button className={styles.primaryBtn} onClick={handleAddInformation}>
                  <Plus size={16} />
                  <span>Add Information</span>
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
                    <p>
                      Manage your requests, projects, approvals, messages, and files
                      from one place.
                    </p>
                  </div>

                  <div className={styles.topbarActions}>
                    <button className={styles.primaryBtn} onClick={handleRequestService}>
                      <Plus size={16} />
                      <span>Request Service</span>
                    </button>

                    <button className={styles.secondaryBtn} onClick={handleAddFile}>
                      <Plus size={16} />
                      <span>Add File</span>
                    </button>
                  </div>
                </header>

                <section className={styles.summaryGrid}>
                  <div className={styles.summaryCard}>
                    <div className={styles.summaryTop}>
                      <span className={styles.summaryIcon}>
                        <Briefcase size={18} />
                      </span>
                      <span className={styles.summaryLabel}>Service Requests</span>
                    </div>
                    <h3>{loadingRequests ? "..." : requests.length}</h3>
                    <p>Total requests submitted.</p>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.summaryTop}>
                      <span className={styles.summaryIcon}>
                        <FolderOpen size={18} />
                      </span>
                      <span className={styles.summaryLabel}>Projects</span>
                    </div>
                    <h3>{loadingProjects ? "..." : projects.length}</h3>
                    <p>Your project records.</p>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.summaryTop}>
                      <span className={styles.summaryIcon}>
                        <ImageIcon size={18} />
                      </span>
                      <span className={styles.summaryLabel}>Designs</span>
                    </div>
                    <h3>{loadingDesigns ? "..." : designs.length}</h3>
                    <p>Design items shared with you.</p>
                  </div>

                  <div className={styles.summaryCard}>
                    <div className={styles.summaryTop}>
                      <span className={styles.summaryIcon}>
                        <Video size={18} />
                      </span>
                      <span className={styles.summaryLabel}>Videos</span>
                    </div>
                    <h3>{loadingVideos ? "..." : videos.length}</h3>
                    <p>Video items available for review.</p>
                  </div>
                </section>

                <section className={styles.dashboardGrid}>
                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <div>
                        <h2>Recent Requests</h2>
                        <p>Your latest service requests.</p>
                      </div>
                      <button
                        className={styles.smallBtn}
                        onClick={() => setActiveSection("service-requests")}
                      >
                        View All
                      </button>
                    </div>

                    {loadingRequests ? (
                      <p className={styles.loadingText}>Loading requests...</p>
                    ) : requests.length > 0 ? (
                      requests.slice(0, 4).map((request) => (
                        <div key={request.id} className={styles.row}>
                          <div>
                            <h4>{request.title}</h4>
                            <span>{request.serviceType}</span>
                          </div>
                          <div className={styles.rowRight}>
                            <strong>{request.status}</strong>
                            <small>{request.priority}</small>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyMiniBox}>
                        <p>No service requests yet.</p>
                      </div>
                    )}
                  </div>

                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <div>
                        <h2>Quick Chat Access</h2>
                        <p>Start a real conversation with people in the system.</p>
                      </div>
                      <button
                        className={styles.smallBtn}
                        onClick={() => setActiveSection("messages")}
                      >
                        Open Messages
                      </button>
                    </div>

                    {loadingConversations ? (
                      <p className={styles.loadingText}>Loading conversations...</p>
                    ) : conversations.length > 0 ? (
                      conversations.slice(0, 4).map((conversation) => (
                        <div key={conversation.id} className={styles.row}>
                          <div>
                            <h4>{conversation.otherUser.name}</h4>
                            <span>{conversation.otherUser.role}</span>
                          </div>
                          <div className={styles.rowRight}>
                            <strong>
                              {conversation.lastMessage?.text ||
                                conversation.lastMessage?.fileName ||
                                "No messages yet"}
                            </strong>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyMiniBox}>
                        <p>No conversations yet.</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {activeSection === "client-info" && (
              <section className={styles.singleSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Client Information</h1>
                    <p>Your saved business and contact information.</p>
                  </div>

                  <button className={styles.primaryBtn} onClick={handleAddInformation}>
                    <Plus size={16} />
                    <span>Edit Information</span>
                  </button>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <h4>Company Name</h4>
                      <p>{formatValue(clientInfo?.companyName)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Business Type</h4>
                      <p>{formatValue(clientInfo?.businessType)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Contact Person</h4>
                      <p>{formatValue(clientInfo?.contactPerson)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Phone</h4>
                      <p>{formatValue(clientInfo?.phone)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Location</h4>
                      <p>{formatValue(clientInfo?.location)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Package</h4>
                      <p>{formatValue(clientInfo?.packageName)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Contract Start</h4>
                      <p>{formatValue(clientInfo?.contractStart)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Contract Status</h4>
                      <p>{formatValue(clientInfo?.contractStatus)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Website</h4>
                      <p>{formatValue(clientInfo?.website)}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h4>Social Media</h4>
                      <p>{formatValue(clientInfo?.socialMedia)}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "service-requests" && (
              <section className={styles.singleSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Service Requests</h1>
                    <p>Send and follow your service requests here.</p>
                  </div>

                  <button className={styles.primaryBtn} onClick={handleRequestService}>
                    <Plus size={16} />
                    <span>Request Service</span>
                  </button>
                </div>

                <div className={styles.panel}>
                  {loadingRequests ? (
                    <p className={styles.loadingText}>Loading requests...</p>
                  ) : requests.length > 0 ? (
                    requests.map((request) => (
                      <div key={request.id} className={styles.row}>
                        <div>
                          <h4>{request.title}</h4>
                          <span>{request.serviceType}</span>
                        </div>
                        <div className={styles.rowRight}>
                          <strong>{request.status}</strong>
                          <small>{request.priority}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyMiniBox}>
                      <p>No service requests found yet.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "projects" && (
              <section className={styles.singleSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>My Projects</h1>
                    <p>Follow your confirmed projects here.</p>
                  </div>
                </div>

                <div className={styles.panel}>
                  {loadingProjects ? (
                    <p className={styles.loadingText}>Loading projects...</p>
                  ) : projects.length > 0 ? (
                    projects.map((project) => (
                      <div key={project.id} className={styles.row}>
                        <div>
                          <h4>{project.name}</h4>
                          <span>{project.service}</span>
                        </div>
                        <div className={styles.rowRight}>
                          <strong>{project.status}</strong>
                          <small>{project.deadline}</small>
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
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Designs</h1>
                    <p>Review your designs and send approval actions.</p>
                  </div>
                </div>

                <div className={styles.designsGrid}>
                  {loadingDesigns ? (
                    <p className={styles.loadingText}>Loading designs...</p>
                  ) : designs.length > 0 ? (
                    designs.map((design) => (
                      <div key={design.id} className={styles.designCard}>
                        <div className={styles.cardTop}>
                          <div>
                            <h3>{design.title}</h3>
                            <span className={styles.designType}>{design.type}</span>
                          </div>

                          <span
                            className={`${styles.designStatus} ${getDesignStatusClass(
                              design.status,
                              styles
                            )}`}
                          >
                            {design.status}
                          </span>
                        </div>

                        <div className={styles.cardBody}>
                          <p>
                            <strong>Date:</strong> {design.date}
                          </p>
                          <p>
                            <strong>Note:</strong> {design.note}
                          </p>
                        </div>

                        <div className={styles.cardActions}>
                          {design.previewPath ? (
                            <a
                              className={styles.viewBtn}
                              href={design.previewPath}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View Design
                            </a>
                          ) : (
                            <button className={styles.viewBtn} type="button">
                              Preview Soon
                            </button>
                          )}

                          <button
                            className={styles.approveBtn}
                            onClick={() => handleDesignAction(design.id, "approve")}
                          >
                            Approve
                          </button>
                          <button
                            className={styles.revisionBtn}
                            onClick={() => handleDesignAction(design.id, "revision")}
                          >
                            Request Revision
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleDesignAction(design.id, "reject")}
                          >
                            Reject
                          </button>
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
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Videos</h1>
                    <p>Review your videos and send approval actions.</p>
                  </div>
                </div>

                <div className={styles.designsGrid}>
                  {loadingVideos ? (
                    <p className={styles.loadingText}>Loading videos...</p>
                  ) : videos.length > 0 ? (
                    videos.map((video) => (
                      <div key={video.id} className={styles.designCard}>
                        <div className={styles.cardTop}>
                          <div>
                            <h3>{video.title}</h3>
                            <span className={styles.designType}>{video.type}</span>
                          </div>

                          <span
                            className={`${styles.designStatus} ${getVideoStatusClass(
                              video.status,
                              styles
                            )}`}
                          >
                            {video.status}
                          </span>
                        </div>

                        <div className={styles.cardBody}>
                          <p>
                            <strong>Date:</strong> {video.date}
                          </p>
                          <p>
                            <strong>Note:</strong> {video.note}
                          </p>
                        </div>

                        <div className={styles.cardActions}>
                          {video.videoPath ? (
                            <a
                              className={styles.viewBtn}
                              href={video.videoPath}
                              target="_blank"
                              rel="noreferrer"
                            >
                              View Video
                            </a>
                          ) : (
                            <button className={styles.viewBtn} type="button">
                              Video Soon
                            </button>
                          )}

                          <button
                            className={styles.approveBtn}
                            onClick={() => handleVideoAction(video.id, "approve")}
                          >
                            Approve
                          </button>
                          <button
                            className={styles.revisionBtn}
                            onClick={() => handleVideoAction(video.id, "revision")}
                          >
                            Request Revision
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() => handleVideoAction(video.id, "reject")}
                          >
                            Reject
                          </button>
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
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Approvals</h1>
                    <p>Review all items waiting for your action.</p>
                  </div>
                </div>

                <div className={styles.designsGrid}>
                  {loadingDesigns || loadingVideos ? (
                    <p className={styles.loadingText}>Loading approvals...</p>
                  ) : approvalItemsCount > 0 ? (
                    <>
                      {designs
                        .filter((d) => d.status === "Waiting Review")
                        .map((design) => (
                          <div key={`design-${design.id}`} className={styles.designCard}>
                            <div className={styles.cardTop}>
                              <div>
                                <h3>{design.title}</h3>
                                <span className={styles.designType}>
                                  Design • {design.type}
                                </span>
                              </div>
                              <span className={`${styles.designStatus} ${styles.waiting}`}>
                                {design.status}
                              </span>
                            </div>

                            <div className={styles.cardBody}>
                              <p>
                                <strong>Date:</strong> {design.date}
                              </p>
                              <p>
                                <strong>Note:</strong> {design.note}
                              </p>
                            </div>

                            <div className={styles.cardActions}>
                              <button
                                className={styles.approveBtn}
                                onClick={() => handleDesignAction(design.id, "approve")}
                              >
                                Approve
                              </button>
                              <button
                                className={styles.revisionBtn}
                                onClick={() => handleDesignAction(design.id, "revision")}
                              >
                                Request Revision
                              </button>
                              <button
                                className={styles.rejectBtn}
                                onClick={() => handleDesignAction(design.id, "reject")}
                              >
                                Reject
                              </button>
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
                                <span className={styles.designType}>
                                  Video • {video.type}
                                </span>
                              </div>
                              <span className={`${styles.designStatus} ${styles.videoEditing}`}>
                                {video.status}
                              </span>
                            </div>

                            <div className={styles.cardBody}>
                              <p>
                                <strong>Date:</strong> {video.date}
                              </p>
                              <p>
                                <strong>Note:</strong> {video.note}
                              </p>
                            </div>

                            <div className={styles.cardActions}>
                              <button
                                className={styles.approveBtn}
                                onClick={() => handleVideoAction(video.id, "approve")}
                              >
                                Approve
                              </button>
                              <button
                                className={styles.revisionBtn}
                                onClick={() => handleVideoAction(video.id, "revision")}
                              >
                                Request Revision
                              </button>
                              <button
                                className={styles.rejectBtn}
                                onClick={() => handleVideoAction(video.id, "reject")}
                              >
                                Reject
                              </button>
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
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Files</h1>
                    <p>Manage and follow all your files in one place.</p>
                  </div>

                  <button className={styles.primaryBtn} onClick={handleAddFile}>
                    <Plus size={16} />
                    <span>Add File</span>
                  </button>
                </div>

                <div className={styles.panel}>
                  {loadingFiles ? (
                    <p className={styles.loadingText}>Loading files...</p>
                  ) : files.length > 0 ? (
                    files.map((file) => (
                      <div key={file.id} className={styles.row}>
                        <div>
                          <h4>{file.name}</h4>
                          <span>{file.type}</span>
                        </div>
                        <div className={styles.rowRight}>
                          <strong>{file.status}</strong>
                          <small>{file.size}</small>
                          <a
                            className={styles.fileLink}
                            href={file.filePath}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View / Download
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyMiniBox}>
                      <p>No files found yet.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeSection === "reports" && (
              <section className={styles.singleSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Reports</h1>
                    <p>View all reports shared with your account.</p>
                  </div>
                </div>

                <div className={styles.panel}>
                  {loadingReports ? (
                    <p className={styles.loadingText}>Loading reports...</p>
                  ) : reports.length > 0 ? (
                    reports.map((report) => (
                      <div key={report.id} className={styles.row}>
                        <div>
                          <h4>{report.title}</h4>
                          <span>{report.period}</span>
                        </div>
                        <div className={styles.rowRight}>
                          <strong>{report.status}</strong>
                          <small>{report.result}</small>
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

            {activeSection === "messages" && (
              <section className={styles.singleSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Messages</h1>
                    <p>Search by person name only and start real conversations.</p>
                  </div>
                </div>

                <div className={styles.chatLayout}>
                  <div className={styles.chatSidebar}>
                    <div className={styles.chatSearchBox}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search people only..."
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                      />
                    </div>

                    <div className={styles.chatListSection}>
                      <h3>People</h3>
                      <div className={styles.chatList}>
                        {loadingChatUsers ? (
                          <p className={styles.loadingText}>Searching...</p>
                        ) : chatUsers.length > 0 ? (
                          chatUsers.map((user) => (
                            <button
                              key={user.id}
                              className={styles.chatUserBtn}
                              onClick={() => handleOpenConversation(user)}
                            >
                              <div>
                                <strong>{user.name}</strong>
                                <span>{user.role}</span>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className={styles.emptyText}>No matching users found.</p>
                        )}
                      </div>
                    </div>

                    <div className={styles.chatListSection}>
                      <h3>Conversations</h3>
                      <div className={styles.chatList}>
                        {loadingConversations ? (
                          <p className={styles.loadingText}>Loading conversations...</p>
                        ) : conversations.length > 0 ? (
                          conversations.map((conversation) => (
                            <button
                              key={conversation.id}
                              className={`${styles.chatConversationBtn} ${
                                selectedConversationId === conversation.id
                                  ? styles.chatConversationBtnActive
                                  : ""
                              }`}
                              onClick={() => handleSelectConversation(conversation)}
                            >
                              <div>
                                <strong>{conversation.otherUser.name}</strong>
                                <span>{conversation.otherUser.role}</span>
                              </div>
                              <small>
                                {conversation.lastMessage?.text ||
                                  conversation.lastMessage?.fileName ||
                                  "Open chat"}
                              </small>
                            </button>
                          ))
                        ) : (
                          <p className={styles.emptyText}>No conversations yet.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.chatMain}>
                    {selectedConversationId && selectedChatUser ? (
                      <>
                        <div className={styles.chatHeader}>
                          <div>
                            <h3>{selectedChatUser.name}</h3>
                            <p>{selectedChatUser.role}</p>
                          </div>
                        </div>

                        <div className={styles.messagesArea}>
                          {loadingMessages ? (
                            <p className={styles.loadingText}>Loading messages...</p>
                          ) : messages.length > 0 ? (
                            messages.map((message) => {
                              const isMine = message.sender.email !== selectedChatUser.email;

                              return (
                                <div
                                  key={message.id}
                                  className={`${styles.messageBubble} ${
                                    isMine ? styles.myMessage : styles.otherMessage
                                  }`}
                                >
                                  <span className={styles.messageSender}>
                                    {message.sender.name}
                                  </span>

                                  {message.text && <p>{message.text}</p>}

                                  {message.fileUrl && (
                                    <a
                                      href={message.fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={styles.messageFile}
                                    >
                                      {message.fileName || "Open File"}
                                    </a>
                                  )}

                                  <small>
                                    {new Date(message.createdAt).toLocaleString()}
                                  </small>
                                </div>
                              );
                            })
                          ) : (
                            <p className={styles.emptyText}>No messages yet.</p>
                          )}
                        </div>

                        <div className={styles.messageComposer}>
                          <input
                            type="text"
                            placeholder="Write your message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <button onClick={handleSendMessage} disabled={sendingMessage}>
                            Send
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.chatPlaceholder}>
                        <h3>Select a person or conversation</h3>
                        <p>
                          Search for a real user by name, then open the conversation and
                          start chatting.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeSection === "settings" && (
              <section className={styles.singleSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h1>Settings</h1>
                    <p>Manage your application preferences.</p>
                  </div>
                </div>

                <div className={styles.settingsGrid}>
                  <div className={styles.settingCard}>
                    <div>
                      <h3>Theme Mode</h3>
                      <p>Choose between light mode and dark mode.</p>
                    </div>

                    <div className={styles.themeButtons}>
                      <button
                        className={`${styles.themeModeBtn} ${
                          theme === "light" ? styles.themeModeBtnActive : ""
                        }`}
                        onClick={() => handleThemeChange("light")}
                        disabled={savingTheme}
                      >
                        <Sun size={16} />
                        <span>Light</span>
                      </button>

                      <button
                        className={`${styles.themeModeBtn} ${
                          theme === "dark" ? styles.themeModeBtnActive : ""
                        }`}
                        onClick={() => handleThemeChange("dark")}
                        disabled={savingTheme}
                      >
                        <Moon size={16} />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === "notifications" &&
              emptySection("Notifications", "No notifications found yet.")}
          </>
        )}
      </main>
    </div>
  );
}