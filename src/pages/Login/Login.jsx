import { useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { supabase } from "../../services/supabaseClient";
// import { useToast } from "../../context/ToastContext";
import "./Login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  // const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

//   const [error, setError] = useState("");

  const location = useLocation();

  const navigate = useNavigate();

  // =========================================
  // WHERE USER ORIGINALLY WANTED TO GO
  // =========================================

  const from = location.state?.from || "/doctors";

  // =========================================
  // HANDLE LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    // setError("");

    // Basic validation
    if (!email || !password) {
//       showToast(
//     "Please enter your email and password.",
//     "warning"
// );
      return;
    }

    try {
      setLoading(true);

      // =========================================
      // SUPABASE LOGIN
      // =========================================

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      // Supabase returned an error
      if (error) {
        throw error;
      }

      // CONSOLE LOG FOR DEBUGGING

      console.log(
        "%c✓ LOGIN SUCCESSFUL\n%cWelcome back! 🎉",
        "color: #00ff88; font-size: 26px; font-weight: 900; font-family: Arial;",
        "color: #ffd700; font-size: 18px; font-weight: bold; font-family: 'Courier New';",
      );

      console.log(
        "%c╔══════════════════════════════════════╗\n" +
          "║          🔐 LOGIN DATA               ║\n" +
          "╚══════════════════════════════════════╝",
        "color: #ff4ecd; font-size: 18px; font-weight: bold; font-family: 'Courier New';",
      );

      console.log(
        "%c👤 USER: %c%s",
        "color: #00bfff; font-size: 20px; font-weight: 900; font-family: Arial;",
        "color: #ffd700; font-size: 22px; font-weight: bold; font-family: 'Courier New';",
        data.user?.user_metadata?.full_name || "Unknown User",
      );

      console.log(
        "%cUser ID:      %c%s\n" +
          "%cEmail:        %c%s\n" +
          "%cName:         %c%s\n" +
          "%cEmail Verified: %c%s",
        "color: #aaa; font-weight: bold;",
        "color: #fff; font-weight: bold;",
        data.user?.id,

        "color: #aaa; font-weight: bold;",
        "color: #00ff88; font-weight: bold;",
        data.user?.email,

        "color: #aaa; font-weight: bold;",
        "color: #ffd700; font-weight: bold;",
        data.user?.user_metadata?.full_name || "N/A",

        "color: #aaa; font-weight: bold;",
        "color: #00ff88; font-weight: bold;",
        data.user?.email_confirmed_at ? "YES ✓" : "NO ✗",
      );

      console.log(
        "%c📦 COMPLETE RESPONSE",
        "color: #ff8c00; font-size: 20px; font-weight: 900; font-family: Arial;",
      );

      console.dir(data, { depth: null });

      // END OF CONSOLE LOG FOR DEBUGGING

      // =========================================
      // LOGIN SUCCESS
      // =========================================

      // showToast("Login successful! 🎉", "success");

      // Redirect user
      navigate(from, {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      // Handle common Supabase errors
      if (error.message?.toLowerCase().includes("email not confirmed")) {
//         showToast(
//     "Please confirm your email address before logging in.",
//     "warning"
// );
      } else if (
        error.message?.toLowerCase().includes("invalid login credentials")
      ) {
//        showToast(
//     "Invalid email or password.",
//     "error"
// );
      } else {
        // showToast(error.message || "Login failed. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* =========================================
                BACKGROUND EFFECTS
            ========================================= */}

      <div className="login-orb login-orb-1"></div>

      <div className="login-orb login-orb-2"></div>

      <div className="login-orb login-orb-3"></div>

      {/* =========================================
                FLOATING MEDICAL ICONS
            ========================================= */}

      <div className="login-floating-icon login-icon-1">✚</div>

      <div className="login-floating-icon login-icon-2">🩺</div>

      <div className="login-floating-icon login-icon-3">♡</div>

      <div className="login-floating-icon login-icon-4">⚕</div>

      <div className="container login-container">
        {/* =========================================
                    LEFT SIDE
                ========================================= */}

        <div className="login-intro">
          <span className="login-label">WELCOME BACK</span>

          <h1>
            Your Health.
            <br />
            <strong>Our Priority.</strong>
          </h1>

          <p>
            Access your healthcare journey, manage appointments and stay
            connected with trusted doctors — all from one simple place.
          </p>

          {/* Benefits */}

          <div className="login-benefits">
            <div className="login-benefit">
              <div className="benefit-check">✓</div>

              <div>
                <strong>Easy Appointment Booking</strong>

                <span>Find and book trusted doctors quickly.</span>
              </div>
            </div>

            <div className="login-benefit">
              <div className="benefit-check">✓</div>

              <div>
                <strong>Manage Your Appointments</strong>

                <span>Keep your healthcare organized.</span>
              </div>
            </div>

            <div className="login-benefit">
              <div className="benefit-check">✓</div>

              <div>
                <strong>Trusted Healthcare</strong>

                <span>Connect with experienced professionals.</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
                    LOGIN CARD
                ========================================= */}

        <div className="login-card">
          {/* Card Header */}

          <div className="login-card-header">
            <div className="login-user-icon">👤</div>

            <div>
              <span>ACCOUNT LOGIN</span>

              <h2>Welcome Back</h2>

              <p>Sign in to continue to DoctorApp.</p>
            </div>
          </div>

          {/* =====================================
                        FORM
                    ===================================== */}

          <form onSubmit={handleLogin}>
            {/* Email */}

            <div className="login-field">
              <label>
                Email Address
                <span>*</span>
              </label>

              <div className="login-input-wrapper">
                <span className="login-input-icon">✉</span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}

            <div className="login-field">
              <div className="password-label-row">
                <label>
                  Password
                  <span>*</span>
                </label>

                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <div className="login-input-wrapper">
                <span className="login-input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* =================================
                            ERROR MESSAGE
                        ================================== */}

            {/* {error && <div className="login-error">⚠️ {error}</div>} */}

            {/* Remember Me */}

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />

                <span>Remember me</span>
              </label>
            </div>

            {/* =================================
                            LOGIN BUTTON
                        ================================== */}

            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              <span>{loading ? "Logging in..." : "Login to DoctorApp"}</span>

              <strong>{loading ? "..." : "→"}</strong>
            </button>
          </form>

          {/* =================================
                        REGISTER
                    ================================== */}

          <div className="register-link">
            <span>Don't have an account?</span>

            <Link to="/register">Create an account →</Link>
          </div>

          {/* Security */}

          <div className="login-security">
            🔒 Your information is secure and protected.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
