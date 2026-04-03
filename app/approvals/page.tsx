import styles from "./approvals.module.css";

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
  {
    id: 4,
    title: "Instagram Story Ad",
    client: "Sun Mall",
    type: "Story Design",
    submittedDate: "Apr 03, 2026",
    status: "Pending Review",
    note: "Waiting for final client confirmation.",
  },
  {
    id: 5,
    title: "Eid Offer Campaign Banner",
    client: "Al Noor Store",
    type: "Banner",
    submittedDate: "Apr 04, 2026",
    status: "Rejected",
    note: "Client rejected the first version and asked for a new concept.",
  },
  {
    id: 6,
    title: "Social Media Carousel",
    client: "Luna Fashion",
    type: "Carousel Design",
    submittedDate: "Apr 05, 2026",
    status: "Approved",
    note: "Approved and scheduled for publishing.",
  },
];

function getStatusClass(status: string) {
  if (status === "Approved") return styles.approved;
  if (status === "Revision Needed") return styles.revision;
  if (status === "Rejected") return styles.rejected;
  return styles.pending;
}

export default function ApprovalsPage() {
  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>NAKSHET ADS</h2>

        <ul className={styles.menu}>
          <li>Dashboard</li>
          <li>Projects</li>
          <li>Designs</li>
          <li>Videos</li>
          <li className={styles.active}>Approvals</li>
          <li>Reports</li>
          <li>Files</li>
          <li>Messages</li>
        </ul>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <h1>Approvals</h1>
            <p>Review submitted work and track client approval status.</p>
          </div>

          <button className={styles.filterBtn}>Filter Status</button>
        </header>

        <section className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <h3>Total Items</h3>
            <p>6</p>
          </div>

          <div className={styles.summaryCard}>
            <h3>Pending Review</h3>
            <p>2</p>
          </div>

          <div className={styles.summaryCard}>
            <h3>Approved</h3>
            <p>2</p>
          </div>

          <div className={styles.summaryCard}>
            <h3>Need Revision</h3>
            <p>1</p>
          </div>
        </section>

        <section className={styles.cardsGrid}>
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
        </section>
      </main>
    </div>
  );
}