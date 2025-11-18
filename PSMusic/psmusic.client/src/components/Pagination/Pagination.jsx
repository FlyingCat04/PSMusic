import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({ page, totalPages, onChange }) => {
    // Nếu chỉ có 0 hoặc 1 trang thì không cần hiện phân trang
    if (!totalPages || totalPages < 1) return null;

    const pages = [];
    for (let p = 1; p <= totalPages; p++) {
        pages.push(p);
    }

    const handleChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === page) return;
        onChange(newPage); // gọi callback từ parent
    };

    return (
        <div className={styles.pagination}>
            <button
                type="button"
                className={styles["page-button"]}
                disabled={page === 1}
                onClick={() => handleChange(page - 1)}
            >
                Trước
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    className={`${styles["page-button"]} ${p === page ? styles["page-button-active"] : ""
                        }`}
                    onClick={() => handleChange(p)}
                >
                    {p}
                </button>
            ))}

            <button
                type="button"
                className={styles["page-button"]}
                disabled={page === totalPages}
                onClick={() => handleChange(page + 1)}
            >
                Sau
            </button>
        </div>
    );
};

export default Pagination;
