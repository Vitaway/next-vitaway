import React, { useEffect, useState } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClose } from 'react-icons/ai';

interface AlertMessageProps {
    message: string;
    type?: 'success' | 'error';
    duration?: number;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
    message,
    type = 'success',
    duration = 5000,
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration]);

    if (!visible) return null;

    return (
        <div
            className={`fixed bottom-4 left-1/2 z-50 w-auto max-w-md transform -translate-x-1/2 rounded-lg border px-4 py-3 shadow-md transition-all duration-300 ${type === 'success'
                    ? 'bg-green-600 border-green-700 text-white'
                    : 'bg-red-600 border-red-700 text-white'
                }`}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    {type === 'success' ? (
                        <AiOutlineCheckCircle className="text-white text-xl" />
                    ) : (
                        <AiOutlineCloseCircle className="text-white text-xl" />
                    )}
                    <span className="text-sm font-medium">{message}</span>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    aria-label="Close"
                    className="ml-4 text-white hover:text-gray-200 transition"
                >
                    <AiOutlineClose />
                </button>
            </div>
        </div>
    );
};

export default AlertMessage;
