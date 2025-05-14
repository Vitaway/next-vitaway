import React from 'react';
import '../../styles/alert-modal.css';

type AlertModalProps = {
    title?: string;
    message: string | React.ReactNode;
    status: 'success' | 'error' | 'info';
    actionUrl?: string;
    onOk?: () => void;
    onClose: () => void;
};

function AlertModal({ title, message, status, actionUrl, onOk, onClose }: AlertModalProps) {
    const handleOkClick = () => {
        if (onOk) {
            onOk();
        } else if (actionUrl) {
            window.location.href = actionUrl;
        }
        onClose();
    };

    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black/15'>
            <div className="notifications-container max-w-2xl">
                <div className={status}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`${status}-svg`}
                            >
                                <path
                                    clipRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    fillRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <div className="success-prompt-wrap">
                            {title && <p className="success-prompt-heading">{title}</p>}
                            <div className="success-prompt-prompt">
                                {typeof message === 'string' ? <p>{message}</p> : message}
                            </div>
                            <div className="success-button-container">
                                <button className="success-button-main" type="button" onClick={handleOkClick}>
                                    OK
                                </button>
                                <button className="success-button-secondary" type="button" onClick={onClose}>
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AlertModal;