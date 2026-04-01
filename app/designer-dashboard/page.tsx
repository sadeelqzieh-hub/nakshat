"use client";

import { useState } from "react";
import styles from "./designer-dashboard.module.css";

const tasks = [
  { id: 1, title: "Create Instagram Post Set", project: "Summer Campaign", status: "In Progress" },
  { id: 2, title: "Revise Restaurant Logo", project: "Restaurant Branding", status: "Pending" },
  { id: 3, title: "Prepare Story Ad Design", project: "Glow Beauty Ads", status: "Completed" },
];

const projects = [
  { id: 1, name: "Summer Campaign", client: "Sun Mall", status: "Designing" },
  { id: 2, name: "Restaurant Branding", client: "Taste House", status: "Revision Needed" },
  { id: 3, name: "Glow Beauty Ads", client: "Glow Beauty", status: "In Progress" },
];

const uploads = [
  { id: 1, file: "Poster Design V2", date: "Today", status: "Uploaded" },
  { id: 2, file: "Story Board Draft", date: "Yesterday", status: "Pending Review" },
  { id: 3, file: "Video Thumbnail", date: "2 days ago", status: "Approved" },
];

const feedback = [
  { id: 1, item: "Poster Design", from: "Project Manager", status: "Needs Revision" },
  { id: 2, item: "Logo Concept", from: "Client", status: "Approved" },
  { id: 3, item: "Story Design", from: "Company", status: "Pending" },
];

const deadlines = [
  { id: 1, task: "Instagram Post Set", due: "Today", priority: "High" },
  { id: 2, task: "Restaurant Logo Revision", due: "Tomorrow", priority: "Medium" },
  { id: 3, task: "Story Ad Design", due: "Apr 3, 2026", priority: "Low" },
];

const initialConversations = [
  {
    id: 1,
    name: "Project Manager",
    role: "Company",
    messages: [
      { id: 1, sender: "them", text: "Please finish the story design today." },
      { id: 2, sender: "me", text: "Okay, I will upload it before the deadline." },
    ],
  },
  {
    id: 2,
    name: "Design Team",
    role: "Internal Team",
    messages: [
      { id: 1, sender: "them", text: "We need to align the brand colors first." },
      { id: 2, sender: "me", text: "Sure, I will update the design based on that." },
    ],
  },
  {
    id: 3,
    name: "Client Feedback",
    role: "Client",
    messages: [
      { id: 1, sender: "them", text: "The logo looks good, but the colors need revision." },
    ],
  },
];

export default function DesignerDashboardPage() {
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
            className={activeSection === "tasks" ? styles.active : ""}
            onClick={() => setActiveSection("tasks")}
          >
            My Tasks
          </li>
          <li
            className={activeSection === "projects" ? styles.active : ""}
            onClick={() => setActiveSection("projects")}
          >
            My Projects
          </li>
          <li
            className={activeSection === "uploads" ? styles.active : ""}
            onClick={() => setActiveSection("uploads")}
          >
            Uploads
          </li>
          <li
            className={activeSection === "feedback" ? styles.active : ""}
            onClick={() => setActiveSection("feedback")}
          >
            Feedback
          </li>
          <li
            className={activeSection === "deadlines" ? styles.active : ""}
            onClick={() => setActiveSection("deadlines")}
          >
            Deadlines
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
                <h1>Designer Dashboard</h1>
                <p>Manage your tasks, uploads, feedback, and deadlines.</p>
              </div>
              <button className={styles.profileBtn}>Designer Profile</button>
            </header>

            <section className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <h3>My Tasks</h3>
                <p>3</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>My Projects</h3>
                <p>3</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Uploads</h3>
                <p>3</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Feedback</h3>
                <p>3</p>
              </div>
            </section>

            <section className={styles.contentGrid}>
              <div className={styles.card}>
                <h2>Assigned Tasks</h2>
                {tasks.map((task) => (
                  <div key={task.id} className={styles.row}>
                    <div>
                      <h4>{task.title}</h4>
                      <span>{task.project}</span>
                    </div>
                    <strong>{task.status}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.card}>
                <h2>Recent Uploads</h2>
                {uploads.map((upload) => (
                  <div key={upload.id} className={styles.row}>
                    <div>
                      <h4>{upload.file}</h4>
                      <span>{upload.date}</span>
                    </div>
                    <strong>{upload.status}</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === "tasks" && (
          <section className={styles.singleSection}>
            <h1>My Tasks</h1>
            <div className={styles.card}>
              {tasks.map((task) => (
                <div key={task.id} className={styles.row}>
                  <div>
                    <h4>{task.title}</h4>
                    <span>{task.project}</span>
                  </div>
                  <strong>{task.status}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "projects" && (
          <section className={styles.singleSection}>
            <h1>My Projects</h1>
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

        {activeSection === "uploads" && (
          <section className={styles.singleSection}>
            <h1>Uploads</h1>
            <div className={styles.card}>
              {uploads.map((upload) => (
                <div key={upload.id} className={styles.row}>
                  <div>
                    <h4>{upload.file}</h4>
                    <span>{upload.date}</span>
                  </div>
                  <strong>{upload.status}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "feedback" && (
          <section className={styles.singleSection}>
            <h1>Feedback</h1>
            <div className={styles.card}>
              {feedback.map((item) => (
                <div key={item.id} className={styles.row}>
                  <div>
                    <h4>{item.item}</h4>
                    <span>{item.from}</span>
                  </div>
                  <strong>{item.status}</strong>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === "deadlines" && (
          <section className={styles.singleSection}>
            <h1>Deadlines</h1>
            <div className={styles.card}>
              {deadlines.map((item) => (
                <div key={item.id} className={styles.row}>
                  <div>
                    <h4>{item.task}</h4>
                    <span>{item.due}</span>
                  </div>
                  <strong>{item.priority}</strong>
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