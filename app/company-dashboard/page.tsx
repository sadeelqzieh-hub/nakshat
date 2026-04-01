"use client";

import { useState } from "react";
import styles from "./company-dashboard.module.css";

const clients = [
  { id: 1, name: "Taste House", type: "Restaurant", status: "Active" },
  { id: 2, name: "Glow Beauty", type: "Cosmetics", status: "Active" },
  { id: 3, name: "Power Gym", type: "Fitness", status: "Pending" },
];

const projects = [
  { id: 1, name: "Restaurant Branding", client: "Taste House", status: "In Progress" },
  { id: 2, name: "Summer Campaign", client: "Glow Beauty", status: "Pending Approval" },
  { id: 3, name: "Promo Video", client: "Power Gym", status: "Reviewing" },
];

const teamMembers = [
  { id: 1, name: "Ahmad Ali", role: "Designer", status: "Available" },
  { id: 2, name: "Sara Omar", role: "Project Manager", status: "Busy" },
  { id: 3, name: "Lina Hamed", role: "Content Creator", status: "Available" },
];

const approvals = [
  {
    id: 1,
    title: "Restaurant Logo Design",
    client: "Taste House",
    type: "Design",
    submittedDate: "Apr 02, 2026",
    status: "Pending Review",
    note: "Client needs to review the final logo colors and typography.",
  },
  {
    id: 2,
    title: "Summer Campaign Poster",
    client: "Glow Beauty",
    type: "Poster Design",
    submittedDate: "Apr 01, 2026",
    status: "Revision Needed",
    note: "Client requested a softer background and bigger product image.",
  },
  {
    id: 3,
    title: "Promo Video Storyboard",
    client: "Power Gym",
    type: "Video",
    submittedDate: "Mar 30, 2026",
    status: "Approved",
    note: "Approved by client and ready for production stage.",
  },
];

const reports = [
  { id: 1, title: "Monthly Performance Report", date: "Mar 25, 2026", status: "Ready" },
  { id: 2, title: "Client Engagement Report", date: "Mar 22, 2026", status: "Shared" },
  { id: 3, title: "Paid Ads Summary", date: "Mar 20, 2026", status: "Draft" },
];

const initialConversations = [
  {
    id: 1,
    name: "Taste House",
    role: "Client",
    messages: [
      { id: 1, sender: "them", text: "Can you send us the latest logo update?" },
      { id: 2, sender: "me", text: "Yes, we will upload it today." },
    ],
  },
  {
    id: 2,
    name: "Design Team",
    role: "Internal Team",
    messages: [
      { id: 1, sender: "them", text: "We finished the first campaign draft." },
      { id: 2, sender: "me", text: "Great, send it for review." },
    ],
  },
  {
    id: 3,
    name: "Project Manager",
    role: "Internal Team",
    messages: [{ id: 1, sender: "them", text: "Two client approvals are still pending." }],
  },
];

function getStatusClass(status: string) {
  if (status === "Approved") return styles.approved;
  if (status === "Revision Needed") return styles.revision;
  return styles.pending;
}

export default function CompanyDashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedChatId, setSelectedChatId] = useState(initialConversations[0].id);
  const [newMessage, setNewMessage] = useState("");

  const selectedChat =
    conversations.find((chat) => chat.id === selectedChatId) || conversations[0];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedConversations = conversations.map((chat) => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: "me",
              text: newMessage,
            },
          ],
        };
      }
      return chat;
    });

    setConversations(updatedConversations);
    setNewMessage("");
  };

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
            className={activeSection === "clients" ? styles.active : ""}
            onClick={() => setActiveSection("clients")}
          >
            Clients
          </li>
          <li
            className={activeSection === "projects" ? styles.active : ""}
            onClick={() => setActiveSection("projects")}
          >
            Projects
          </li>
          <li
            className={activeSection === "team" ? styles.active : ""}
            onClick={() => setActiveSection("team")}
          >
            Team
          </li>
          <li
            className={activeSection === "approvals" ? styles.active : ""}
            onClick={() => setActiveSection("approvals")}
          >
            Approvals
          </li>
          <li
            className={activeSection === "reports" ? styles.active : ""}
            onClick={() => setActiveSection("reports")}
          >
            Reports
          </li>
          <li
            className={activeSection === "messages" ? styles.active : ""}
            onClick={() => setActiveSection("messages")}
          >
            Messages
          </li>
        </ul>
      </aside>

      <main className={styles.main}>
        {activeSection === "dashboard" && (
          <>
            <header className={styles.topbar}>
              <div>
                <h1>Company Dashboard</h1>
                <p>Manage clients, projects, approvals, and team workflow.</p>
              </div>
              <button className={styles.profileBtn}>Company Profile</button>
            </header>

            <section className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <h3>Total Clients</h3>
                <p>3</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Active Projects</h3>
                <p>3</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Pending Approvals</h3>
                <p>2</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Team Members</h3>
                <p>3</p>
              </div>
            </section>

            <section className={styles.contentGrid}>
              <div className={styles.card}>
                <h2>Projects Overview</h2>
                {projects.map((project) => (
                  <div key={project.id} className={styles.row}>
                    <div>
                      <h4>{project.name}</h4>
                      <span>{project.client}</span>
                    </div>
                    <strong>{project.status}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <h2>Clients Overview</h2>
                {clients.map((client) => (
                  <div key={client.id} className={styles.row}>
                    <div>
                      <h4>{client.name}</h4>
                      <span>{client.type}</span>
                    </div>
                    <strong>{client.status}</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === "clients" && (
          <section className={styles.singleSection}>
            <h1>Clients</h1>
            <div className={styles.card}>
              {clients.map((client) => (
                <div key={client.id} className={styles.row}>
                  <div>
                    <h4>{client.name}</h4>
                    <span>{client.type}</span>
                  </div>
                  <strong>{client.status}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "projects" && (
          <section className={styles.singleSection}>
            <h1>Projects</h1>
            <div className={styles.card}>
              {projects.map((project) => (
                <div key={project.id} className={styles.row}>
                  <div>
                    <h4>{project.name}</h4>
                    <span>{project.client}</span>
                  </div>
                  <strong>{project.status}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "team" && (
          <section className={styles.singleSection}>
            <h1>Team</h1>
            <div className={styles.card}>
              {teamMembers.map((member) => (
                <div key={member.id} className={styles.row}>
                  <div>
                    <h4>{member.name}</h4>
                    <span>{member.role}</span>
                  </div>
                  <strong>{member.status}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "approvals" && (
          <section className={styles.singleSection}>
            <h1>Approvals</h1>

            <div className={styles.approvalsGrid}>
              {approvals.map((item) => (
                <div key={item.id} className={styles.approvalCard}>
                  <div className={styles.cardTop}>
                    <div>
                      <h3>{item.title}</h3>
                      <span className={styles.clientName}>{item.client}</span>
                    </div>

                    <span className={`${styles.status} ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <p>
                      <strong>Type:</strong> {item.type}
                    </p>
                    <p>
                      <strong>Submitted:</strong> {item.submittedDate}
                    </p>
                    <p>
                      <strong>Note:</strong> {item.note}
                    </p>
                  </div>

                  <div className={styles.cardActions}>
                    <button className={styles.viewBtn}>View</button>
                    <button className={styles.approveBtn}>Approve</button>
                    <button className={styles.revisionBtn}>Request Revision</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "reports" && (
          <section className={styles.singleSection}>
            <h1>Reports</h1>
            <div className={styles.card}>
              {reports.map((report) => (
                <div key={report.id} className={styles.row}>
                  <div>
                    <h4>{report.title}</h4>
                    <span>{report.date}</span>
                  </div>
                  <strong>{report.status}</strong>
                </div>
              ))}
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
                    selectedChatId === chat.id ? styles.chatUserActive : ""
                  }`}
                  onClick={() => setSelectedChatId(chat.id)}
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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}