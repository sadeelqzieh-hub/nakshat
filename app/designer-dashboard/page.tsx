"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styles from "./designer-dashboard.module.css";
import {
  Bell,
  Briefcase,
  CheckCheck,
  CheckCircle2,
  FolderOpen,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Palette,
  Pencil,
  Plus,
  Search,
  Send,
  Smile,
  Trash2,
  Upload,
  Users,
  Video,
  X,
  Paperclip,
  Moon,
  Sun,
  Settings,
  LogOut,
} from "lucide-react";

type Project = {
  id: number;
  name: string;
  service: string;
  status: string;
  deadline: string;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  uploads: UploadItem[];
};

type UploadItem = {
  id: number;
  title: string;
  fileUrl: string;
  fileType: string;
  category: string;
  status: string;
  note?: string | null;
  createdAt: string;
  project?: {
    id: number;
    name: string;
    deadline?: string;
  } | null;
};

type Conversation = {
  id: number;
  title?: string;
  project?: {
    id: number;
    name?: string;
  } | null;
  members?: {
    id: number;
    user: {
      id: number;
      name?: string;
      email?: string;
      role?: string;
    };
  }[];
  messages?: {
    id: number;
    text: string;
    createdAt: string;
    sender: {
      id: number;
      name: string;
      role: string;
    };
  }[];
};

type Participant = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type ParsedMediaMessage = {
  kind: "text" | "media";
  text?: string;
  mediaType?: "image" | "video";
  url?: string;
  caption?: string;
};

const DEMO_DESIGNER_ID = 2;
const STORAGE_KEY = "designer_selected_conversation";
const THEME_KEY = "designer_dashboard_theme";
const EMOJIS = ["😀", "😂", "😍", "🔥", "👏", "🎉", "❤️", "👍", "🤝", "😎"];

function parseMessageContent(text: string): ParsedMediaMessage {
  if (typeof text === "string" && text.startsWith("__CHAT_MEDIA__")) {
    try {
      const raw = text.replace("__CHAT_MEDIA__", "");
      const parsed = JSON.parse(raw);

      return {
        kind: "media",
        mediaType: parsed.mediaType,
        url: parsed.url,
        caption: parsed.caption || "",
      };
    } catch {
      return {
        kind: "text",
        text,
      };
    }
  }

  return {
    kind: "text",
    text,
  };
}

function formatRole(role?: string) {
  if (!role) return "User";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function DesignerDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [projects, setProjects] = useState<Project[]>([]);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);

  const [messageText, setMessageText] = useState("");
  const [conversationSearch, setConversationSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingUploadId, setEditingUploadId] = useState<number | null>(null);

  const [showCreateChatModal, setShowCreateChatModal] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<number[]>([]);
  const [deletingChat, setDeletingChat] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [sendingMedia, setSendingMedia] = useState(false);

  const mediaInputRef = useRef<HTMLInputElement | null>(null);
  const messageAreaRef = useRef<HTMLDivElement | null>(null);

  const [createChatForm, setCreateChatForm] = useState({
    title: "",
    projectId: "",
  });

  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "design",
    status: "Pending Review",
    note: "",
    projectId: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  async function loadData() {
    try {
      setLoading(true);

      const [projectsRes, uploadsRes, chatRes] = await Promise.all([
        fetch(`/api/designer/projects?designerId=${DEMO_DESIGNER_ID}`),
        fetch(`/api/uploads?designerId=${DEMO_DESIGNER_ID}`),
        fetch(`/api/chat/conversations?userId=${DEMO_DESIGNER_ID}`),
      ]);

      const projectsData = await projectsRes.json();
      const uploadsData = await uploadsRes.json();
      const chatData = await chatRes.json();

      const loadedProjects = projectsData.success ? projectsData.projects || [] : [];
      const loadedUploads = uploadsData.success ? uploadsData.uploads || [] : [];
      const loadedConversations = chatData.success
        ? (chatData.conversations as Conversation[]) || []
        : [];

      setProjects(loadedProjects);
      setUploads(loadedUploads);
      setConversations(loadedConversations);

      const savedConversationId = Number(localStorage.getItem(STORAGE_KEY));

      if (
        savedConversationId &&
        loadedConversations.some((item) => item.id === savedConversationId)
      ) {
        setSelectedConversationId(savedConversationId);
      } else if (loadedConversations.length > 0) {
        setSelectedConversationId(loadedConversations[0].id);
      } else {
        setSelectedConversationId(null);
      }
    } catch (error) {
      console.error("LOAD DESIGNER DATA ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  useEffect(() => {
    if (selectedConversationId) {
      localStorage.setItem(STORAGE_KEY, String(selectedConversationId));
    }
  }, [selectedConversationId]);

  useEffect(() => {
    async function loadParticipants() {
      if (!createChatForm.projectId) {
        setAvailableParticipants([]);
        setSelectedParticipantIds([]);
        return;
      }

      try {
        setParticipantsLoading(true);

        const res = await fetch(
          `/api/chat/participants?projectId=${createChatForm.projectId}`
        );
        const data = await res.json();

        if (data.success) {
          const participants = ((data.participants as Participant[]) || []).filter(
            (item) => item.id !== DEMO_DESIGNER_ID
          );

          setAvailableParticipants(participants);
          setSelectedParticipantIds(participants.map((item) => item.id));
        }
      } catch (error) {
        console.error("LOAD PARTICIPANTS ERROR:", error);
      } finally {
        setParticipantsLoading(false);
      }
    }

    if (showCreateChatModal) {
      loadParticipants();
    }
  }, [createChatForm.projectId, showCreateChatModal]);

  const filteredConversations = useMemo(() => {
    const search = conversationSearch.trim().toLowerCase();

    if (!search) return conversations;

    return conversations.filter((chat) => {
      return (chat.members ?? []).some((member) => {
        const memberName = member.user.name?.toLowerCase() || "";
        const memberEmail = member.user.email?.toLowerCase() || "";
        return memberName.includes(search) || memberEmail.includes(search);
      });
    });
  }, [conversationSearch, conversations]);

  const selectedConversation = useMemo(() => {
    return conversations.find((item) => item.id === selectedConversationId) || null;
  }, [conversations, selectedConversationId]);

  const selectedConversationMessages = selectedConversation?.messages ?? [];
  const selectedConversationMembers = selectedConversation?.members ?? [];

  const getLastMessage = (chat: Conversation) => {
    const messages = chat.messages ?? [];

    if (messages.length === 0) {
      return {
        text: "No messages yet.",
        time: "",
      };
    }

    const last = messages[messages.length - 1];
    const parsed = parseMessageContent(last.text);

    let preview = "No messages yet.";

    if (parsed.kind === "media") {
      preview = parsed.mediaType === "video" ? "🎬 Video" : "🖼️ Image";
      if (parsed.caption) {
        preview += ` • ${parsed.caption}`;
      }
    } else {
      preview = parsed.text || "No messages yet.";
    }

    return {
      text: preview,
      time: new Date(last.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  useLayoutEffect(() => {
    const el = messageAreaRef.current;
    if (!el || activeSection !== "messages") return;

    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };

    scrollToBottom();
    const timeout = setTimeout(scrollToBottom, 80);

    return () => clearTimeout(timeout);
  }, [
    activeSection,
    selectedConversationId,
    selectedConversationMessages.length,
    conversations,
  ]);

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedConversationId) return;

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          senderId: DEMO_DESIGNER_ID,
          text: messageText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessageText("");
        setShowEmojiBar(false);
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);
      alert("Failed to send message.");
    }
  }

  async function handleEditMessage(messageId: number) {
    if (!editingMessageText.trim()) return;

    try {
      const res = await fetch(`/api/chat/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editingMessageText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setEditingMessageId(null);
        setEditingMessageText("");
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to update message.");
      }
    } catch (error) {
      console.error("EDIT MESSAGE ERROR:", error);
      alert("Failed to update message.");
    }
  }

  async function handleDeleteMessage(messageId: number) {
    const confirmed = window.confirm("Delete this message?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/chat/messages/${messageId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to delete message.");
      }
    } catch (error) {
      console.error("DELETE MESSAGE ERROR:", error);
      alert("Failed to delete message.");
    }
  }

  async function handleMediaUpload(file: File) {
    if (!selectedConversationId) return;

    try {
      setSendingMedia(true);

      const formData = new FormData();
      formData.append("conversationId", String(selectedConversationId));
      formData.append("senderId", String(DEMO_DESIGNER_ID));
      formData.append("caption", messageText);
      formData.append("file", file);

      const res = await fetch("/api/chat/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessageText("");
        setShowEmojiBar(false);
        if (mediaInputRef.current) {
          mediaInputRef.current.value = "";
        }
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Failed to upload media.");
      }
    } catch (error) {
      console.error("UPLOAD MEDIA ERROR:", error);
      alert("Failed to upload media.");
    } finally {
      setSendingMedia(false);
    }
  }

  function toggleParticipant(id: number) {
    setSelectedParticipantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  async function handleCreateChat() {
    if (!createChatForm.title.trim() || !createChatForm.projectId) {
      alert("Please enter chat title and select a project.");
      return;
    }

    try {
      setCreatingChat(true);

      const res = await fetch("/api/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: createChatForm.title,
          projectId: Number(createChatForm.projectId),
          creatorId: DEMO_DESIGNER_ID,
          memberIds: selectedParticipantIds,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const newConversation = data.conversation as Conversation;
        setConversations((prev) => [newConversation, ...prev]);
        setSelectedConversationId(newConversation.id);
        setActiveSection("messages");
        setShowCreateChatModal(false);
        setAvailableParticipants([]);
        setSelectedParticipantIds([]);
        setCreateChatForm({
          title: "",
          projectId: "",
        });
        localStorage.setItem(STORAGE_KEY, String(newConversation.id));
      } else {
        alert(data.message || "Failed to create chat.");
      }
    } catch (error) {
      console.error("CREATE CHAT ERROR:", error);
      alert("Failed to create chat.");
    } finally {
      setCreatingChat(false);
    }
  }

  async function handleDeleteChat() {
    if (!selectedConversationId) return;

    const confirmed = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmed) return;

    try {
      setDeletingChat(true);

      const res = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversationId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const remaining = conversations.filter(
          (item) => item.id !== selectedConversationId
        );

        setConversations(remaining);

        if (remaining.length > 0) {
          setSelectedConversationId(remaining[0].id);
          localStorage.setItem(STORAGE_KEY, String(remaining[0].id));
        } else {
          setSelectedConversationId(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        alert(data.message || "Failed to delete chat.");
      }
    } catch (error) {
      console.error("DELETE CHAT ERROR:", error);
      alert("Failed to delete chat.");
    } finally {
      setDeletingChat(false);
    }
  }

  async function handleUploadFile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const fileInput = document.getElementById("designerFile") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (!editingUploadId && !file) {
      alert("Please choose a file first.");
      return;
    }

    try {
      setUploading(true);

      if (editingUploadId) {
        const res = await fetch(`/api/uploads/${editingUploadId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: uploadForm.title,
            category: uploadForm.category,
            status: uploadForm.status,
            note: uploadForm.note,
            projectId: uploadForm.projectId ? Number(uploadForm.projectId) : null,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message || "Update failed.");
          return;
        }

        alert("Upload updated successfully.");
      } else {
        const formData = new FormData();
        formData.append("title", uploadForm.title);
        formData.append("category", uploadForm.category);
        formData.append("status", uploadForm.status);
        formData.append("note", uploadForm.note);
        formData.append("uploaderId", String(DEMO_DESIGNER_ID));
        formData.append("file", file as File);

        if (uploadForm.projectId) {
          formData.append("projectId", uploadForm.projectId);
        }

        const res = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.message || "Upload failed.");
          return;
        }

        alert("File uploaded successfully.");
      }

      setUploadForm({
        title: "",
        category: "design",
        status: "Pending Review",
        note: "",
        projectId: "",
      });

      setEditingUploadId(null);

      if (fileInput) {
        fileInput.value = "";
      }

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("UPLOAD/UPDATE FILE ERROR:", error);
      alert("Operation failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleEditUpload(item: UploadItem) {
    setActiveSection("uploads");
    setEditingUploadId(item.id);
    setUploadForm({
      title: item.title,
      category: item.category,
      status: item.status,
      note: item.note || "",
      projectId: item.project?.id ? String(item.project.id) : "",
    });
  }

  async function handleDeleteUpload(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this file?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/uploads/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setRefreshKey((prev) => prev + 1);
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch (error) {
      console.error("DELETE UPLOAD ERROR:", error);
      alert("Delete failed.");
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "/";
      } else {
        alert("Logout failed.");
      }
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      alert("Logout failed.");
    }
  }

  const totalProjects = projects.length;
  const totalUploads = uploads.length;

  const designUploads = uploads.filter((item) => item.category === "design");
  const videoUploads = uploads.filter((item) => item.category === "video");

  const designCount = designUploads.length;
  const videoCount = videoUploads.length;

  const pendingReviewCount = uploads.filter(
    (item) => item.status === "Pending Review"
  ).length;

  const waitingApprovalCount = uploads.filter(
    (item) => item.status === "Waiting Client Approval"
  ).length;

  const approvedCount = uploads.filter(
    (item) => item.status === "Approved"
  ).length;

  const designTasks = designUploads.map((item) => ({
    id: item.id,
    title: item.title,
    type: "Design File",
    project: item.project?.name || "No project linked",
    deadline: item.project?.deadline || "No deadline",
    status: item.status,
    clientComment: item.note || "No client note yet.",
  }));

  const videoTasks = videoUploads.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.fileType || "Video File",
    project: item.project?.name || "No project linked",
    stage: item.status,
    deadline: item.project?.deadline || "No deadline",
  }));

  const approvalItems = uploads
    .filter((item) =>
      ["Pending Review", "Waiting Client Approval", "Approved"].includes(item.status)
    )
    .map((item) => ({
      id: item.id,
      itemName: item.title,
      type: item.category,
      status: item.status,
      feedback: item.note || "No additional feedback.",
    }));

  const notifications = [
    ...(pendingReviewCount > 0
      ? [
          {
            id: 1,
            title: `${pendingReviewCount} file(s) pending review`,
            time: "Now",
          },
        ]
      : []),
    ...(waitingApprovalCount > 0
      ? [
          {
            id: 2,
            title: `${waitingApprovalCount} file(s) waiting client approval`,
            time: "Now",
          },
        ]
      : []),
    ...(videoCount > 0
      ? [
          {
            id: 3,
            title: `${videoCount} video file(s) available`,
            time: "Now",
          },
        ]
      : []),
    ...(projects.length > 0
      ? [
          {
            id: 4,
            title: `${projects.length} active assigned project(s)`,
            time: "Now",
          },
        ]
      : []),
  ];

  const recentActivities = uploads.slice(0, 4).map((item, index) => ({
    id: item.id,
    title:
      item.category === "video"
        ? "Video file updated"
        : "Design file updated",
    detail: `${item.title} is currently marked as ${item.status}.`,
    time: `${index + 1} hour ago`,
  }));

  return (
    <>
      <div className={`${styles.page} ${theme === "dark" ? styles.darkPage : ""}`}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>N</div>
            <div>
              <h2>NAKSHET</h2>
              <p>Designer Workspace</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <button
              className={activeSection === "dashboard" ? styles.activeNav : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              className={activeSection === "projects" ? styles.activeNav : ""}
              onClick={() => setActiveSection("projects")}
            >
              <Briefcase size={18} />
              Projects
            </button>

            <button
              className={activeSection === "designs" ? styles.activeNav : ""}
              onClick={() => setActiveSection("designs")}
            >
              <Palette size={18} />
              Designs
            </button>

            <button
              className={activeSection === "videos" ? styles.activeNav : ""}
              onClick={() => setActiveSection("videos")}
            >
              <Video size={18} />
              Videos
            </button>

            <button
              className={activeSection === "uploads" ? styles.activeNav : ""}
              onClick={() => setActiveSection("uploads")}
            >
              <Upload size={18} />
              Upload Center
            </button>

            <button
              className={activeSection === "messages" ? styles.activeNav : ""}
              onClick={() => setActiveSection("messages")}
            >
              <MessageSquare size={18} />
              Messages
            </button>

            <button
              className={activeSection === "approvals" ? styles.activeNav : ""}
              onClick={() => setActiveSection("approvals")}
            >
              <CheckCheck size={18} />
              Approvals
            </button>

            <button
              className={activeSection === "notifications" ? styles.activeNav : ""}
              onClick={() => setActiveSection("notifications")}
            >
              <Megaphone size={18} />
              Notifications
            </button>

            <button
              className={activeSection === "settings" ? styles.activeNav : ""}
              onClick={() => setActiveSection("settings")}
            >
              <Settings size={18} />
              Settings
            </button>
          </nav>

          <div className={styles.sidebarCard}>
            <h4>Quick Notes</h4>
            <p>
              Track design tasks, video stages, approvals, uploads, and real chats
              with people linked to your projects.
            </p>
          </div>

          <div className={styles.sidebarActions}>
            <button
              className={styles.themeToggle}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.topbar}>
            <div>
              <h1>Designer Dashboard</h1>
              <p>
                Manage projects, upload designs and videos, and chat with clients
                and team members from one place.
              </p>
            </div>

            <div className={styles.topbarRight}>
              <button className={styles.alertBtn}>
                <Bell size={18} />
              </button>

              <div className={styles.profileBox}>
                <div className={styles.avatar}>S</div>
                <div>
                  <strong>Sara Designer</strong>
                  <span>designer@nakshet.com</span>
                </div>
              </div>
            </div>
          </header>

          {loading ? (
            <div className={styles.loading}>Loading dashboard...</div>
          ) : (
            <>
              {activeSection === "dashboard" && (
                <>
                  <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <FolderOpen size={18} />
                      </div>
                      <div>
                        <h3>{totalProjects}</h3>
                        <p>Assigned Projects</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Upload size={18} />
                      </div>
                      <div>
                        <h3>{totalUploads}</h3>
                        <p>Total Uploads</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <ImageIcon size={18} />
                      </div>
                      <div>
                        <h3>{designCount}</h3>
                        <p>Design Files</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Video size={18} />
                      </div>
                      <div>
                        <h3>{videoCount}</h3>
                        <p>Video Files</p>
                      </div>
                    </div>
                  </section>

                  <section className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <Palette size={18} />
                      </div>
                      <div>
                        <h3>{pendingReviewCount}</h3>
                        <p>Pending Review</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <CheckCheck size={18} />
                      </div>
                      <div>
                        <h3>{waitingApprovalCount}</h3>
                        <p>Waiting Approval</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <CheckCircle2 size={18} />
                      </div>
                      <div>
                        <h3>{approvedCount}</h3>
                        <p>Approved Files</p>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <h3>{conversations.length}</h3>
                        <p>Open Chats</p>
                      </div>
                    </div>
                  </section>

                  <section className={styles.doubleGrid}>
                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Recent Activities</h3>
                      </div>

                      <div className={styles.cardList}>
                        {recentActivities.length > 0 ? (
                          recentActivities.map((activity) => (
                            <div key={activity.id} className={styles.infoCard}>
                              <div>
                                <h4>{activity.title}</h4>
                                <p>{activity.detail}</p>
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.emptyState}>No recent activity yet.</div>
                        )}
                      </div>
                    </div>

                    <div className={styles.panel}>
                      <div className={styles.panelHead}>
                        <h3>Notifications</h3>
                      </div>

                      <div className={styles.cardList}>
                        {notifications.length > 0 ? (
                          notifications.map((item) => (
                            <div key={item.id} className={styles.infoCard}>
                              <div>
                                <h4>{item.title}</h4>
                                <span>{item.time}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={styles.emptyState}>No notifications right now.</div>
                        )}
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeSection === "projects" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Assigned Projects</h3>
                  </div>

                  <div className={styles.projectGrid}>
                    {projects.length > 0 ? (
                      projects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/designer-dashboard/projects/${project.id}`}
                          className={styles.projectCard}
                        >
                          <div className={styles.projectTop}>
                            <div>
                              <h4>{project.name}</h4>
                              <p>{project.service}</p>
                            </div>
                            <span className={styles.statusBadge}>{project.status}</span>
                          </div>

                          <div className={styles.projectMeta}>
                            <span>Deadline: {project.deadline}</span>
                            <span>Client: {project.owner.name}</span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No assigned projects yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "designs" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Design Tasks</h3>
                  </div>

                  <div className={styles.cardList}>
                    {designTasks.length > 0 ? (
                      designTasks.map((task) => (
                        <div key={task.id} className={styles.infoCard}>
                          <div>
                            <h4>{task.title}</h4>
                            <p>{task.project}</p>
                            <span>
                              {task.status} • {task.deadline}
                            </span>
                          </div>
                          <span className={styles.statusBadge}>{task.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No design tasks yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "videos" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Video Tasks</h3>
                  </div>

                  <div className={styles.cardList}>
                    {videoTasks.length > 0 ? (
                      videoTasks.map((task) => (
                        <div key={task.id} className={styles.infoCard}>
                          <div>
                            <h4>{task.title}</h4>
                            <p>{task.project}</p>
                            <span>
                              {task.stage} • {task.deadline}
                            </span>
                          </div>
                          <span className={styles.statusBadge}>{task.type}</span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No video tasks yet.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "uploads" && (
                <section className={styles.uploadLayout}>
                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <h3>{editingUploadId ? "Edit Upload" : "Upload New File"}</h3>
                    </div>

                    <form className={styles.uploadForm} onSubmit={handleUploadFile}>
                      <input
                        type="text"
                        placeholder="File title"
                        value={uploadForm.title}
                        onChange={(e) =>
                          setUploadForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                        required
                      />

                      <select
                        value={uploadForm.category}
                        onChange={(e) =>
                          setUploadForm((prev) => ({ ...prev, category: e.target.value }))
                        }
                      >
                        <option value="design">Design</option>
                        <option value="video">Video</option>
                      </select>

                      <select
                        value={uploadForm.status}
                        onChange={(e) =>
                          setUploadForm((prev) => ({ ...prev, status: e.target.value }))
                        }
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Waiting Client Approval">
                          Waiting Client Approval
                        </option>
                        <option value="Approved">Approved</option>
                      </select>

                      <select
                        value={uploadForm.projectId}
                        onChange={(e) =>
                          setUploadForm((prev) => ({ ...prev, projectId: e.target.value }))
                        }
                      >
                        <option value="">Select project</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>

                      {!editingUploadId && <input id="designerFile" type="file" required />}

                      <textarea
                        placeholder="Notes"
                        rows={5}
                        value={uploadForm.note}
                        onChange={(e) =>
                          setUploadForm((prev) => ({ ...prev, note: e.target.value }))
                        }
                      />

                      <div className={styles.formActions}>
                        <button type="submit" disabled={uploading}>
                          {uploading
                            ? "Saving..."
                            : editingUploadId
                            ? "Update File"
                            : "Upload File"}
                        </button>

                        {editingUploadId && (
                          <button
                            type="button"
                            className={styles.cancelBtn}
                            onClick={() => {
                              setEditingUploadId(null);
                              setUploadForm({
                                title: "",
                                category: "design",
                                status: "Pending Review",
                                note: "",
                                projectId: "",
                              });
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  <div className={styles.panel}>
                    <div className={styles.panelHead}>
                      <h3>Uploaded Files</h3>
                    </div>

                    <div className={styles.cardList}>
                      {uploads.length > 0 ? (
                        uploads.map((item) => (
                          <div key={item.id} className={styles.uploadCard}>
                            <div className={styles.uploadInfo}>
                              <h4>{item.title}</h4>
                              <p>
                                {item.category} • {item.status}
                              </p>
                              <span>
                                {item.project?.name || "No project linked"} •{" "}
                                {new Date(item.createdAt).toLocaleString()}
                              </span>
                            </div>

                            <div className={styles.uploadActions}>
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.fileLink}
                              >
                                Open
                              </a>

                              <button
                                className={styles.actionBtn}
                                onClick={() => handleEditUpload(item)}
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                className={styles.deleteBtn}
                                onClick={() => handleDeleteUpload(item.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyState}>No uploads yet.</div>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "messages" && (
                <section className={styles.messagesLayout}>
                  <div className={styles.chatSidebar}>
                    <div className={styles.panelHead}>
                      <h3>Chats</h3>
                      <button
                        className={styles.newChatBtn}
                        onClick={() => setShowCreateChatModal(true)}
                      >
                        <Plus size={16} />
                        New Chat
                      </button>
                    </div>

                    <div className={styles.searchBox}>
                      <Search size={16} />
                      <input
                        type="text"
                        placeholder="Search people only..."
                        value={conversationSearch}
                        onChange={(e) => setConversationSearch(e.target.value)}
                      />
                    </div>

                    <div className={styles.chatList}>
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((chat) => {
                          const last = getLastMessage(chat);
                          const memberNames = (chat.members ?? [])
                            .map((member) => member.user.name || "Unknown")
                            .join(", ");

                          return (
                            <button
                              key={chat.id}
                              className={`${styles.chatListItem} ${
                                selectedConversationId === chat.id ? styles.chatActive : ""
                              }`}
                              onClick={() => setSelectedConversationId(chat.id)}
                            >
                              <div className={styles.chatListTop}>
                                <strong>{chat.title || "Untitled Chat"}</strong>
                                <span className={styles.chatTime}>{last.time}</span>
                              </div>

                              <p className={styles.chatProjectName}>
                                {(chat.project?.name ?? "No linked project") || "No linked project"}
                              </p>

                              <p className={styles.chatPreviewText}>{memberNames}</p>
                              <p className={styles.chatPreviewText}>{last.text}</p>
                            </button>
                          );
                        })
                      ) : (
                        <div className={styles.noSearchResults}>
                          No chats found for this person search.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.chatPanel}>
                    {selectedConversation ? (
                      <>
                        <div className={styles.chatHeader}>
                          <div className={styles.chatHeaderTop}>
                            <div>
                              <h3>{selectedConversation.title || "Untitled Chat"}</h3>
                              <p>
                                {(selectedConversation.project?.name ?? "No linked project") ||
                                  "No linked project"}
                              </p>
                            </div>

                            <button
                              className={styles.deleteChatBtn}
                              onClick={handleDeleteChat}
                              disabled={deletingChat}
                            >
                              <Trash2 size={15} />
                              {deletingChat ? "Deleting..." : "Delete Chat"}
                            </button>
                          </div>

                          <div className={styles.membersList}>
                            <Users size={15} />
                            {(selectedConversationMembers ?? []).map((member) => {
                              const isYou = member.user.id === DEMO_DESIGNER_ID;
                              return (
                                <span key={member.id} className={styles.memberChip}>
                                  {member.user.name || "Unknown"}{" "}
                                  {isYou ? "(You)" : `(${formatRole(member.user.role)})`}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className={styles.messageArea} ref={messageAreaRef}>
                          {selectedConversationMessages.length > 0 ? (
                            selectedConversationMessages.map((msg) => {
                              const mine = msg.sender.id === DEMO_DESIGNER_ID;
                              const parsed = parseMessageContent(msg.text);

                              return (
                                <div
                                  key={msg.id}
                                  className={`${styles.messageBubble} ${
                                    mine ? styles.myMessage : styles.otherMessage
                                  }`}
                                >
                                  <div className={styles.messageMeta}>
                                    <strong>{msg.sender.name}</strong>
                                    <span>
                                      {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                  </div>

                                  {editingMessageId === msg.id ? (
                                    <div className={styles.editMessageBox}>
                                      <textarea
                                        value={editingMessageText}
                                        onChange={(e) =>
                                          setEditingMessageText(e.target.value)
                                        }
                                        rows={3}
                                      />
                                      <div className={styles.editActions}>
                                        <button
                                          className={styles.smallPrimaryBtn}
                                          onClick={() => handleEditMessage(msg.id)}
                                        >
                                          Save
                                        </button>
                                        <button
                                          className={styles.smallGhostBtn}
                                          onClick={() => {
                                            setEditingMessageId(null);
                                            setEditingMessageText("");
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      {parsed.kind === "media" ? (
                                        <div className={styles.mediaMessage}>
                                          {parsed.mediaType === "image" ? (
                                            <img
                                              src={parsed.url}
                                              alt="Uploaded chat media"
                                              className={styles.chatMedia}
                                            />
                                          ) : (
                                            <video
                                              src={parsed.url}
                                              controls
                                              className={styles.chatMedia}
                                            />
                                          )}

                                          {parsed.caption ? <p>{parsed.caption}</p> : null}
                                        </div>
                                      ) : (
                                        <p className={styles.messageText}>{parsed.text}</p>
                                      )}

                                      {mine && (
                                        <div className={styles.messageTools}>
                                          <button
                                            className={styles.toolBtn}
                                            onClick={() => {
                                              setEditingMessageId(msg.id);
                                              setEditingMessageText(msg.text);
                                            }}
                                          >
                                            <Pencil size={14} />
                                          </button>
                                          <button
                                            className={styles.toolBtnDanger}
                                            onClick={() => handleDeleteMessage(msg.id)}
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className={styles.emptyState}>
                              No messages yet in this chat.
                            </div>
                          )}
                        </div>

                        <div className={styles.chatComposer}>
                          {showEmojiBar && (
                            <div className={styles.emojiBar}>
                              {EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  className={styles.emojiBtn}
                                  onClick={() => setMessageText((prev) => prev + emoji)}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className={styles.chatActionsRow}>
                            <button
                              className={styles.iconActionBtn}
                              onClick={() => setShowEmojiBar((prev) => !prev)}
                            >
                              <Smile size={16} />
                            </button>

                            <button
                              className={styles.iconActionBtn}
                              onClick={() => mediaInputRef.current?.click()}
                              disabled={sendingMedia}
                            >
                              <Paperclip size={16} />
                            </button>

                            <input
                              ref={mediaInputRef}
                              type="file"
                              accept="image/*,video/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleMediaUpload(file);
                              }}
                            />

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

                            <button
                              className={styles.sendBtn}
                              onClick={handleSendMessage}
                              disabled={!messageText.trim()}
                            >
                              <Send size={16} />
                              Send
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className={styles.emptyState}>
                        Select a chat to start messaging.
                      </div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "approvals" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Approvals</h3>
                  </div>

                  <div className={styles.cardList}>
                    {approvalItems.length > 0 ? (
                      approvalItems.map((item) => (
                        <div key={item.id} className={styles.infoCard}>
                          <div>
                            <h4>{item.itemName}</h4>
                            <p>
                              {item.type} • {item.status}
                            </p>
                            <span>{item.feedback}</span>
                          </div>
                          <span className={styles.statusBadge}>{item.status}</span>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No approvals right now.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "notifications" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Notifications</h3>
                  </div>

                  <div className={styles.cardList}>
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div key={item.id} className={styles.infoCard}>
                          <div>
                            <h4>{item.title}</h4>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.emptyState}>No notifications right now.</div>
                    )}
                  </div>
                </section>
              )}

              {activeSection === "settings" && (
                <section className={styles.panel}>
                  <div className={styles.panelHead}>
                    <h3>Settings</h3>
                  </div>

                  <div className={styles.settingsGrid}>
                    <div className={styles.settingCard}>
                      <div>
                        <h4>Theme Mode</h4>
                        <p>Switch between light mode and dark mode.</p>
                      </div>

                      <div className={styles.settingsActions}>
                        <button
                          className={`${styles.themeModeBtn} ${
                            theme === "light" ? styles.themeModeBtnActive : ""
                          }`}
                          onClick={() => setTheme("light")}
                        >
                          <Sun size={16} />
                          Light
                        </button>

                        <button
                          className={`${styles.themeModeBtn} ${
                            theme === "dark" ? styles.themeModeBtnActive : ""
                          }`}
                          onClick={() => setTheme("dark")}
                        >
                          <Moon size={16} />
                          Dark
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>

      {showCreateChatModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHead}>
              <div>
                <h3>Create New Chat</h3>
                <p>Select a project and the people you want in this chat.</p>
              </div>

              <button
                className={styles.closeBtn}
                onClick={() => setShowCreateChatModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <input
                type="text"
                placeholder="Chat title"
                value={createChatForm.title}
                onChange={(e) =>
                  setCreateChatForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />

              <select
                value={createChatForm.projectId}
                onChange={(e) =>
                  setCreateChatForm((prev) => ({ ...prev, projectId: e.target.value }))
                }
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              <div className={styles.participantsBox}>
                <h4>Participants</h4>

                {participantsLoading ? (
                  <p>Loading participants...</p>
                ) : availableParticipants.length > 0 ? (
                  <div className={styles.participantsList}>
                    {availableParticipants.map((participant) => (
                      <label key={participant.id} className={styles.participantItem}>
                        <input
                          type="checkbox"
                          checked={selectedParticipantIds.includes(participant.id)}
                          onChange={() => toggleParticipant(participant.id)}
                        />
                        <span>
                          {participant.name} ({formatRole(participant.role)})
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p>No participants available for this project.</p>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowCreateChatModal(false)}
              >
                Cancel
              </button>

              <button className={styles.createBtn} onClick={handleCreateChat}>
                {creatingChat ? "Creating..." : "Create Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}