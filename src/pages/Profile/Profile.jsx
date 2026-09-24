import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import toast from "react-hot-toast";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================
  // FORM DATA
  // =========================================

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // =========================================
  // IMAGE
  // =========================================

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // =========================================
  // LOAD PROFILE
  // =========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================
  // FETCH PROFILE
  // =========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        toast.error("User is not logged in.");
    return;
}

      setUser(user);

      // Get profile
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(data);

      // Set form values
      setFormData({
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
      });

      // Set avatar
      if (data.avatar_url) {
        setAvatarPreview(data.avatar_url);
      }
    } catch (error) {
      console.error("Profile error:", error);

      toast.error(error.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE IMAGE
  // =========================================

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be smaller than 5 MB.");
      return;
    }

    setError("");
    setAvatarFile(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  // =========================================
  // UPLOAD AVATAR
  // =========================================

  const uploadAvatar = async () => {
    if (!avatarFile || !user) {
      return profile?.avatar_url || null;
    }

    const fileExtension = avatarFile.name.split(".").pop();

    const filePath = `${user.id}/avatar-${Date.now()}.${fileExtension}`;

    console.log("UPLOAD PATH:", filePath);
    console.log("UPLOAD USER ID:", user.id);
    // Upload
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        upsert: false,
        contentType: avatarFile.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  // =========================================
  // SAVE PROFILE
  // =========================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!user) {
        throw new Error("User is not logged in.");
      }

      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url || null;

      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      // Update profile
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          avatar_url: avatarUrl,
        })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data);

      setAvatarFile(null);

      setEditing(false);

      toast.success("Profile updated successfully.");


    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================
  // CANCEL EDIT
  // =========================================

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setFormData({
      full_name: profile.full_name || "",
      phone: profile.phone || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      pincode: profile.pincode || "",
    });

    setAvatarFile(null);

    setAvatarPreview(profile.avatar_url || "");

    setError("");
    setMessage("");

    setEditing(false);
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Loading your profile...</div>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-error">⚠️ {error}</div>
      </div>
    );
  }

  // =========================================
  // PROFILE UI
  // =========================================

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* =========================================
                    HEADER
                ========================================== */}

        <div className="profile-header">
          <div className="profile-header-content">
            <div
              className="profile-avatar"
              style={
                avatarPreview
                  ? {
                      backgroundImage: `url(${avatarPreview})`,
                    }
                  : {}
              }
            >
              {!avatarPreview && "👤"}
            </div>

            <div className="profile-header-text">
              <h1>{profile?.full_name || "My Profile"}</h1>

              <p>Manage your personal information</p>

              <div className="profile-status">
                <span className="profile-status-dot"></span>
                Profile Active
              </div>
            </div>
          </div>

          {!editing ? (
            <button
              className="profile-edit-btn"
              onClick={() => {
                setEditing(true);
                setError("");
                setMessage("");
              }}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="profile-actions">
              <button
                className="profile-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="profile-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* =========================================
                    MESSAGES
                ========================================== */}

        {message && <div className="profile-success">✅ {message}</div>}

        {error && <div className="profile-error">⚠️ {error}</div>}

        {/* =========================================
                    PROFILE CARD
                ========================================== */}

        <div className="profile-card">
          {/* =========================================
                        PROFILE PHOTO
                    ========================================== */}

          {editing && (
            <div className="avatar-upload">
              <label htmlFor="avatar-input" className="avatar-upload-btn">
                📷 Change Photo
              </label>

              <input
                id="avatar-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                hidden
              />

              <small>JPG, PNG or WebP • Max 5 MB</small>
            </div>
          )}

          {/* =========================================
                        PERSONAL INFORMATION
                    ========================================== */}

          <div className="profile-section">
            <h2>Personal Information</h2>

            {/* FULL NAME */}

            <div className="profile-field">
              <span className="profile-label">Full Name</span>

              {editing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Enter your full name"
                />
              ) : (
                <span className="profile-value">
                  {profile?.full_name || "Not available"}
                </span>
              )}
            </div>

            {/* EMAIL */}

            <div className="profile-field">
              <span className="profile-label">Email</span>

              <span className="profile-value">
                {user?.email || "Email not available"}

                <span className="email-badge">🔒</span>
              </span>
            </div>

            {/* PHONE */}

            <div className="profile-field">
              <span className="profile-label">Phone</span>

              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Enter phone number"
                />
              ) : (
                <span className="profile-value">
                  {profile?.phone || "Not available"}
                </span>
              )}
            </div>
          </div>

          {/* =========================================
                        ADDRESS
                    ========================================== */}

          <div className="profile-section">
            <h2>Address</h2>

            {/* ADDRESS */}

            <div className="profile-field">
              <span className="profile-label">Address</span>

              {editing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="profile-input profile-textarea"
                  placeholder="Enter your address"
                  rows="3"
                />
              ) : (
                <span className="profile-value">
                  {profile?.address || "Not available"}
                </span>
              )}
            </div>

            {/* CITY */}

            <div className="profile-field">
              <span className="profile-label">City</span>

              {editing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Enter your city"
                />
              ) : (
                <span className="profile-value">
                  {profile?.city || "Not available"}
                </span>
              )}
            </div>

            {/* STATE */}

            <div className="profile-field">
              <span className="profile-label">State</span>

              {editing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Enter your state"
                />
              ) : (
                <span className="profile-value">
                  {profile?.state || "Not available"}
                </span>
              )}
            </div>

            {/* PINCODE */}

            <div className="profile-field">
              <span className="profile-label">Pincode</span>

              {editing ? (
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Enter pincode"
                />
              ) : (
                <span className="profile-value">
                  {profile?.pincode || "Not available"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
