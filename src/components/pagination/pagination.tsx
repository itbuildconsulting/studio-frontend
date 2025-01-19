import React from 'react';
import styles from './pagination.module.css';
import { PaginationModel } from '@/types/pagination';

interface PaginationProps {
    infoPage: PaginationModel;
    setPage?: (page: number) => void;
}

export const Pagination = ({ infoPage, setPage }: PaginationProps) => {
    const { totalPages, currentPage } = infoPage;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handlePrevPage = () => {
        if (currentPage > 1 && setPage) {
            setPage(currentPage - 1);
            scrollToTop();
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages && setPage) {
            setPage(currentPage + 1);
            scrollToTop();
        }
    };

    const handlePageClick = (page: number) => {
        if (setPage) {
            setPage(page);
            scrollToTop();
        }
    };

    return (
        <div className={styles.paginationContainer}>
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`${styles.button} ${currentPage === 1 ? styles.disabled : ''}`}
            >
                &#9664;
            </button>
            <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`${styles.pageButton} ${
                            page === currentPage ? styles.active : ''
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`${styles.button} ${currentPage === totalPages ? styles.disabled : ''}`}
            >
                &#9654;
            </button>
        </div>
    );
};