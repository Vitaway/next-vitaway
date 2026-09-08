import React from 'react';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    from: number;
    to: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    lastPage,
    total,
    from,
    to,
    onPageChange,
    loading = false,
}) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (lastPage <= maxVisiblePages) {
            // Show all pages if total pages are less than or equal to maxVisiblePages
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            // Show pages around current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(lastPage - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < lastPage - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(lastPage);
        }

        return pages;
    };

    const handlePageClick = (page: number | string) => {
        if (typeof page === 'number' && page !== currentPage && !loading) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1 && !loading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < lastPage && !loading) {
            onPageChange(currentPage + 1);
        }
    };

    if (lastPage <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    return (
        <div className="flex flex-col items-center justify-center mt-12 space-y-4">
            {/* Results Info */}
            <div className="text-sm text-[#003E48]/60">
                Showing <span className="font-semibold text-[#003E48]">{from}</span> to{' '}
                <span className="font-semibold text-[#003E48]">{to}</span> of{' '}
                <span className="font-semibold text-[#003E48]">{total}</span> results
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1 || loading}
                    className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        currentPage === 1 || loading
                            ? 'bg-[#F6F3EE] text-[#003E48]/35 cursor-not-allowed'
                            : 'bg-white text-[#003E48] hover:bg-[#F6F3EE]'
                    }`}
                    aria-label="Previous page"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    <span className="ml-1 hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="hidden md:flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageClick(page)}
                                    disabled={loading}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                        page === currentPage
                                            ? 'bg-[#003E48] text-white'
                                            : 'bg-white text-[#003E48] hover:bg-[#F6F3EE]'
                                    } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                    aria-label={`Page ${page}`}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Mobile Page Indicator */}
                <div className="md:hidden px-4 py-2 text-sm font-medium text-[#003E48] bg-white rounded-full">
                    {currentPage} / {lastPage}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === lastPage || loading}
                    className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                        currentPage === lastPage || loading
                            ? 'bg-[#F6F3EE] text-[#003E48]/35 cursor-not-allowed'
                            : 'bg-white text-[#003E48] hover:bg-[#F6F3EE]'
                    }`}
                    aria-label="Next page"
                >
                    <span className="mr-1 hidden sm:inline">Next</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
