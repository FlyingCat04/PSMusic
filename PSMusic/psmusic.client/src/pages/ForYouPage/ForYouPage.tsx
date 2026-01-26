import styles from "./ForYouPage.module.css";

export default function ForYouPage() {
  return (
    <div className={styles.forYouPage}>
      <div className={styles.header}>
        <span>Gợi ý cho bạn</span>
      </div>
      <div className={styles.recommendSys}></div>
    </div>
  );
}