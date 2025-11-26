import React from "react";
import styles from "./Pagination.module.css";

const Pagination = ({ page, totalPages, onChange }) => {
    if (!totalPages || totalPages < 1) return null;

    const handleChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === page) return;
        onChange(newPage);
    };

    const buildPages = () => {
        const pages = [];

        // Nếu tổng trang <= 7: hiện hết
        if (totalPages <= 7) {
            for (let p = 1; p <= totalPages; p++) {
                pages.push(p);
            }
            return pages;
        }

        // Trường hợp ở gần đầu: 1 2 3 4 5 ... last
        if (page <= 4) {
            pages.push(1, 2, 3, 4, 5, "dots-right", totalPages);
            return pages;
        }

        // Trường hợp ở gần cuối: 1 ... last-4 last-3 last-2 last-1 last
        if (page >= totalPages - 3) {
            pages.push(
                1,
                "dots-left",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );
            return pages;
        }

        // Các trang ở giữa: 1 ... page-1 page page+1 ... last
        pages.push(
            1,
            "dots-left",
            page - 1,
            page,
            page + 1,
            "dots-right",
            totalPages
        );
        return pages;
    };

    const pages = buildPages();

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

            {pages.map((item, index) => {
                if (typeof item === "string" && item.startsWith("dots")) {
                    return (
                        <span
                            key={item + index}
                            style={{ opacity: 0.6, padding: "0 4px" }}
                        >
                            …
                        </span>
                    );
                }

                const p = item;
                return (
                    <button
                        key={p}
                        type="button"
                        className={`${styles["page-button"]} ${p === page ? styles["page-button-active"] : ""
                            }`}
                        onClick={() => handleChange(p)}
                    >
                        {p}
                    </button>
                );
            })}

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
