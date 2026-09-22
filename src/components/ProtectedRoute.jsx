
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

// =========================================
// PROTECTED ROUTE
// =========================================

function ProtectedRoute({ children }) {
    const location = useLocation();

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    // =========================================
    // CHECK SUPABASE SESSION
    // =========================================

    useEffect(() => {
        let mounted = true;

        const getSession = async () => {
            const { data, error } =
                await supabase.auth.getSession();

            if (error) {
                console.error(
                    "Error getting Supabase session:",
                    error
                );
            }

            if (mounted) {
                setSession(data?.session ?? null);
                setLoading(false);
            }
        };

        getSession();

        // =========================================
        // LISTEN FOR AUTH CHANGES
        // =========================================

        const {
            data: authListener,
        } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
                if (mounted) {
                    setSession(currentSession);
                }
            }
        );

        // =========================================
        // CLEANUP
        // =========================================

        return () => {
            mounted = false;
            authListener?.subscription?.unsubscribe();
        };
    }, []);

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                }}
            >
                Checking authentication...
            </div>
        );
    }

    // =========================================
    // NOT LOGGED IN
    // =========================================

    if (!session) {
        const currentPath =
            location.pathname + location.search;

        return (
            <Navigate
                to="/login"
                replace
                state={{
                    from: currentPath,
                }}
            />
        );
    }

    // =========================================
    // AUTHENTICATED
    // =========================================

    return children;
}

export default ProtectedRoute;
