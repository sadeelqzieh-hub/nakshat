import styles from "./projects.module.css";

const projects = [
  {
    id: 1,
    name: "Restaurant Branding",
    client: "Taste House",
    service: "Brand Identity",
    status: "In Progress",
    deadline: "Apr 10, 2026",
  },
  {
    id: 2,
    name: "Summer Campaign",
    client: "Sun Mall",
    service: "Social Media Ads",
    status: "Pending Approval",
    deadline: "Apr 15, 2026",
  },
  {
    id: 3,
    name: "Glow Beauty Launch",
    client: "Glow Beauty",
    service: "Content Design",
    status: "Completed",
    deadline: "Apr 02, 2026",
  },
  {
    id: 4,
    name: "Fitness Promo Video",
    client: "Power Gym",
    service: "Video Production",
    status: "Reviewing",
    deadline: "Apr 18, 2026",
  },
  {
    id: 5,
    name: "Eid Offer Campaign",
    client: "Al Noor Store",
    service: "Marketing Campaign",
    status: "In Progress",
    deadline: "Apr 20, 2026",
  },
  {
    id: 6,
    name: "Fashion Ads Package",
    client: "Luna Fashion",
    service: "Paid Ads Management",
    status: "Pending",
    deadline: "Apr 25, 2026",
  },
];

export default function ProjectsPage() {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>NAKSHET ADS</h2>

        <ul className={styles.menu}>
          <li>Dashboard</li>
          <li className={styles.active}>Projects</li>
          <li>Clients</li>
          <li>Designs</li>
          <li>Videos</li>
          <li>Approvals</li>
          <li>Reports</li>
          <li>Messages</li>
        </ul>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1>Projects</h1>
            <p>Manage and follow all project details in one place.</p>
          </div>
          <button className={styles.addBtn}>+ Add New Project</button>
        </header>

        <section className={styles.cardsGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.cardTop}>
                <h3>{project.name}</h3>
                <span className={styles.status}>{project.status}</span>
              </div>

              <div className={styles.cardBody}>
                <p>
                  <strong>Client:</strong> {project.client}
                </p>
                <p>
                  <strong>Service:</strong> {project.service}
                </p>
                <p>
                  <strong>Deadline:</strong> {project.deadline}
                </p>
              </div>

              <button className={styles.detailsBtn}>Show Details</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}