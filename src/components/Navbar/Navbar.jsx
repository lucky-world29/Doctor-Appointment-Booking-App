import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { supabase } from "../../services/supabaseClient";

import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [navHidden, setNavHidden] = useState(false);

  const [session, setSession] = useState(null);
 const [profile, setProfile] = useState(null);

  const location = useLocation();

  const navigate = useNavigate();

  // =========================================
  // CLOSE MOBILE MENU
  // =========================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =========================================
  // CHECK AUTHENTICATION
  // =========================================

  useEffect(() => {
    const getSession = async () => {
        const {
            data,
            error,
        } = await supabase.auth.getSession();

        if (error) {
            console.error(
                "Error getting session:",
                error
            );
            return;
        }

        setSession(data.session);

        // Fetch profile image
        if (data.session?.user) {
            const { data: profileData, error: profileError } =
                await supabase
                    .from("profiles")
                    .select("avatar_url, full_name")
                    .eq("id", data.session.user.id)
                    .single();

            if (profileError) {
                console.error(
                    "Error getting profile:",
                    profileError
                );
            } else {
                setProfile(profileData);
            }
        }
    };

    getSession();

    const {
        data: authListener,
    } = supabase.auth.onAuthStateChange(
        async (_event, newSession) => {

            setSession(newSession);

            if (newSession?.user) {
                const {
                    data: profileData,
                    error: profileError,
                } = await supabase
                    .from("profiles")
                    .select("avatar_url, full_name")
                    .eq("id", newSession.user.id)
                    .single();

                if (profileError) {
                    console.error(
                        "Error getting profile:",
                        profileError
                    );
                    setProfile(null);
                } else {
                    setProfile(profileData);
                }
            } else {
                setProfile(null);
            }
        }
    );

    return () => {
        authListener?.subscription?.unsubscribe();
    };
}, []);

  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = async () => {
    closeMenu();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    navigate("/login");
  };

  // =========================================
  // SCROLL NAVBAR
  // =========================================

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show navbar at top

      if (currentScrollY <= 20) {
        setNavHidden(false);
      }

      // Scrolling DOWN
      else if (currentScrollY > lastScrollY) {
        setNavHidden(true);
        setMenuOpen(false);
      }

      // Scrolling UP
      else if (currentScrollY < lastScrollY) {
        setNavHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================================
  // USER NAME
  // =========================================

  const userName =
    session?.user?.user_metadata?.full_name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  return (
    <nav className={`doctor-navbar ${navHidden ? "nav-hidden" : ""}`}>
      <div className="floating-navbar">
        {/* =================================
                    LOGO
                ================================== */}

        <Link to="/" className="floating-logo" onClick={closeMenu}>
          <div className="floating-logo-icon">+</div>
        </Link>

        {/* =================================
                    NAVIGATION
                ================================== */}

        <div className={`floating-nav ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            onClick={closeMenu}
            className={
              location.pathname === "/"
                ? "floating-nav-link active"
                : "floating-nav-link"
            }
          >
            Home
          </Link>

          <Link
            to="/doctors"
            onClick={closeMenu}
            className={
              location.pathname === "/doctors"
                ? "floating-nav-link active"
                : "floating-nav-link"
            }
          >
            Doctors
          </Link>

          <Link
            to="/appointments"
            onClick={closeMenu}
            className={
              location.pathname === "/appointments"
                ? "floating-nav-link active"
                : "floating-nav-link"
            }
          >
            Appointments
          </Link>
        </div>

        {/* =================================
                    LOGIN / USER
                ================================== */}

        {session ? (
          <div className="floating-user">
            <Link
    to="/profile"
    className="floating-user-profile"
    onClick={closeMenu}
>
    <span className="floating-user-icon">
        {profile?.avatar_url ? (
            <img
                src={profile.avatar_url}
                alt={userName}
            />
        ) : (
            "👤"
        )}
    </span>

    <span className="floating-user-name">
        {userName}
    </span>
</Link>

            <button
              type="button"
              className="floating-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="floating-login" onClick={closeMenu}>
            <span>Login</span>

            <span className="floating-login-arrow">→</span>
          </Link>
        )}

        {/* =================================
                    MOBILE BUTTON
                ================================== */}

        <button
          className={`floating-menu-button ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
