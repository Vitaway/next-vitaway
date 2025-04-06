import { useEffect } from 'react';

// Extend the Window interface to include IremboPay
declare global {
    interface Window {
        IremboPay?: {
            initiate: (config: {
                publicKey: string;
                invoiceNumber: string;
                locale: string;
                callback: (err: Error | null, resp: { status: string; data?: unknown }) => void;
            }) => void;
            locale: {
                EN: string;
            };
        };
    }
}

const IremboPayment = () => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://dashboard.sandbox.irembopay.com/assets/payment/inline.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const makePayment = () => {
        if (typeof window.IremboPay !== 'undefined') {
            window.IremboPay.initiate({
                publicKey: "pk_live_da91b566a86e4341a1348103256f6195",
                invoiceNumber: "xxx",
                locale: window.IremboPay.locale.EN,
                callback: (err, resp) => {
                    if (!err) {
                        console.log("Success:", resp);
                        // window.IremboPay.closeModal(); // Optional
                    } else {
                        console.error("Error:", err);
                    }
                }
            });
        } else {
            console.error("IremboPay script not loaded yet.");
        }
    };

    return (
        <button onClick={makePayment} className="bg-blue-600 text-white px-4 py-2 rounded">
            Pay
        </button>
    );
};

export default IremboPayment;
