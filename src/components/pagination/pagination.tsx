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


    function getVisiblePages(totalPages: number, currentPage: number): number[] {
        let startPage = currentPage - 2;
        let endPage = currentPage + 2;

        if (startPage < 1) {
            startPage = 1;
            endPage = 5;
        }

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, totalPages - 4);
        }

        return Array.from({ length: Math.min(5, totalPages) }, (_, i) => startPage + i);
    }

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
                {currentPage > 3 &&
                    <>
                        <button
                            onClick={() => handlePageClick(1)}
                            className={`${styles.pageButton} ${1 === currentPage ? styles.active : ''
                                }`}
                        >
                            {1}
                        </button>
                        <span>...</span>
                    </>
                }
                {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => ( */}
                {getVisiblePages(totalPages, currentPage).map((page: number) => (
                    <React.Fragment key={page}>
                        <button onClick={() => handlePageClick(page)}>
                        {page}
                        </button>
                    </React.Fragment>
                ))}
                {currentPage < (totalPages - 2) &&
                    <>
                        <span>...</span>
                        <button
                            onClick={() => handlePageClick(totalPages)}
                            className={`${styles.pageButton} ${totalPages === currentPage ? styles.active : ''
                                }`}
                        >
                            {totalPages}
                        </button>
                    </>
                }
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