
import {
    createContext,
    useCallback,
    useContext,
    useState,
} from "react";

import "../components/Toast/Toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);

    const showToast = useCallback(
        (
            message,
            type = "success",
            duration = 3500
        ) => {
            setToast({
                id: Date.now(),
                message,
                type,
            });

            if (duration > 0) {
                setTimeout(() => {
                    setToast(null);
                }, duration);
            }
        },
        []
    );

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                hideToast,
            }}
        >
            {children}

            {toast && (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onClose={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}

function Toast({ toast, onClose }) {
    return (
        <div
            className={`global-toast global-toast-${toast.type}`}
        >
            <div className="global-toast-icon">
                {toast.type === "success" && "✓"}
                {toast.type === "error" && "!"}
                {toast.type === "warning" && "!"}
                {toast.type === "info" && "i"}
            </div>

            <div className="global-toast-content">
                <strong>
                    {toast.type === "success" && "Success"}
                    {toast.type === "error" && "Error"}
                    {toast.type === "warning" && "Warning"}
                    {toast.type === "info" && "Information"}
                </strong>

                <span>{toast.message}</span>
            </div>

            <button
                type="button"
                className="global-toast-close"
                onClick={onClose}
                aria-label="Close notification"
            >
                ×
            </button>

            <div className="global-toast-progress" />
        </div>
    );
}
