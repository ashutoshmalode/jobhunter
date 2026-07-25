import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  Avatar,
} from "@mui/material";
import {
  AddOutlined,
  CheckCircleOutlined,
  // WorkOutlined,
  LocationOnOutlined,
  AttachMoneyOutlined,
  AccessTimeOutlined,
  LightbulbOutlined,
} from "@mui/icons-material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Internship",
  "Contract",
];

const TIPS = [
  "A clear job title gets 3x more applicants",
  "Including salary range attracts better candidates",
  "List 3-5 specific requirements",
  "Mention remote/hybrid options clearly",
];

const TYPE_COLORS = {
  "Full-time": { bg: "#EEF2FF", color: "#4338CA" },
  "Part-time": { bg: "#FFF7ED", color: "#C2410C" },
  Remote: { bg: "#ECFDF5", color: "#065F46" },
  Internship: { bg: "#FFF1F2", color: "#BE123C" },
  Contract: { bg: "#F5F3FF", color: "#6D28D9" },
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    "&:hover fieldset": { borderColor: "#7C3AED" },
    "&.Mui-focused fieldset": { borderColor: "#7C3AED" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#7C3AED" },
};

export default function PostJob() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    title: "",
    company: "",
    type: "Full-time",
    location: "",
    salary: "",
    description: "",
    requirements: "",
    tagInput: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleAddTag = () => {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag) && form.tags.length < 6) {
      update("tags", [...form.tags, tag]);
      update("tagInput", "");
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    update(
      "tags",
      form.tags.filter((t) => t !== tag),
    );
  };

  const validate = () => {
    if (!form.title.trim()) return "Job title is required.";
    if (!form.company.trim()) return "Company name is required.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.description.trim()) return "Job description is required.";
    if (form.description.trim().length < 50)
      return "Description must be at least 50 characters.";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const requirements = form.requirements
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);

      // Firestore version — includes serverTimestamp() for the database
      const firestoreData = {
        title: form.title.trim(),
        company: form.company.trim(),
        type: form.type,
        location: form.location.trim(),
        salary: form.salary.trim() || "Not specified",
        description: form.description.trim(),
        requirements,
        tags: form.tags,
        postedBy: user.uid,
        postedByName: user.displayName || user.email,
        postedAt: new Date().toISOString(),
        companyColor: "#7C3AED",
        createdAt: serverTimestamp(), // only goes to Firestore
      };

      await addDoc(collection(db, "jobs"), firestoreData);
      // No Redux dispatch needed here anymore —
      // JobsGrid re-fetches from Firestore on mount,
      // so navigating to "/" will show the new job automatically

      setSuccess(true);
      setSnackbar({ open: true, message: "Job posted successfully! 🎉" });

      // Reset form
      setForm({
        title: "",
        company: "",
        type: "Full-time",
        location: "",
        salary: "",
        description: "",
        requirements: "",
        tagInput: "",
        tags: [],
      });
    } catch (err) {
      setError("Failed to post job. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sectionCard = (title, children) => (
    <Box
      sx={{
        background: "white",
        borderRadius: "20px",
        border: "1.5px solid #E5E7EB",
        p: { xs: 3, md: 4 },
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#0F0A27",
          mb: 3,
          pb: 1.5,
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );

  // Live preview data
  const preview = {
    id: "preview",
    title: form.title || "Job Title",
    company: form.company || "Company Name",
    companyColor: "#7C3AED",
    location: form.location || "Location",
    salary: form.salary || "Salary",
    type: form.type,
    tags: form.tags.length > 0 ? form.tags : ["Tag"],
    postedAt: new Date().toISOString(),
  };
  const typeStyle = TYPE_COLORS[preview.type] || {
    bg: "#F3F4F6",
    color: "#374151",
  };

  if (!user) return null;

  return (
    <Box sx={{ background: "#F8F7FF", minHeight: "100vh", py: 5 }}>
      <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 } }}>
        {/* Page header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: { xs: "1.6rem", md: "2rem" },
              color: "#0F0A27",
              mb: 0.5,
            }}
          >
            Post a New Job
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: 14,
              color: "#6B7280",
            }}
          >
            Fill in the details below to reach thousands of qualified
            candidates.
          </Typography>
        </Box>

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: "12px", fontFamily: "Inter" }}
            action={
              <Button
                size="small"
                onClick={() => navigate("/")}
                sx={{
                  color: "#065F46",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  textTransform: "none",
                }}
              >
                View Jobs
              </Button>
            }
          >
            Your job has been posted successfully and is now live!
          </Alert>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: "12px", fontFamily: "Inter" }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 340px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* ---- LEFT: FORM ---- */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Basic Info */}
            {sectionCard(
              "Basic Information",
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Job Title *"
                  placeholder="e.g. Senior React Developer"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  fullWidth
                  sx={inputSx}
                />
                <TextField
                  label="Company Name *"
                  placeholder="e.g. Google"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  fullWidth
                  sx={inputSx}
                />

                <FormControl fullWidth sx={inputSx}>
                  <InputLabel sx={{ fontFamily: "Inter", fontSize: 14 }}>
                    Job Type *
                  </InputLabel>
                  <Select
                    value={form.type}
                    label="Job Type *"
                    onChange={(e) => update("type", e.target.value)}
                    sx={{
                      borderRadius: "10px",
                      fontFamily: "Inter",
                      fontSize: 14,
                    }}
                  >
                    {JOB_TYPES.map((type) => (
                      <MenuItem
                        key={type}
                        value={type}
                        sx={{ fontFamily: "Inter", fontSize: 14 }}
                      >
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Location *"
                    placeholder="e.g. Remote"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    fullWidth
                    sx={inputSx}
                  />
                  <TextField
                    label="Salary (optional)"
                    placeholder="e.g. $120k – $150k"
                    value={form.salary}
                    onChange={(e) => update("salary", e.target.value)}
                    fullWidth
                    sx={inputSx}
                  />
                </Box>
              </Box>,
            )}

            {/* Job Details */}
            {sectionCard(
              "Job Details",
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <TextField
                  label="Job Description *"
                  placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  multiline
                  rows={5}
                  fullWidth
                  sx={inputSx}
                  helperText={`${form.description.length} characters (minimum 50)`}
                />

                <TextField
                  label="Requirements (one per line)"
                  placeholder={
                    "5+ years of React experience\nStrong TypeScript skills\nExperience with large-scale apps"
                  }
                  value={form.requirements}
                  onChange={(e) => update("requirements", e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                  sx={inputSx}
                  helperText="Each line will become a separate requirement bullet point"
                />

                {/* Tags input */}
                <Box>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                    }}
                  >
                    Skills & Tags (max 6)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                    <TextField
                      placeholder="e.g. React"
                      value={form.tagInput}
                      onChange={(e) => update("tagInput", e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      size="small"
                      sx={{ flex: 1, ...inputSx }}
                    />
                    <Button
                      onClick={handleAddTag}
                      variant="outlined"
                      startIcon={<AddOutlined />}
                      disabled={form.tags.length >= 6}
                      sx={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "10px",
                        borderColor: "#7C3AED",
                        color: "#7C3AED",
                        "&:hover": { background: "#F5F3FF" },
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  {form.tags.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {form.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          sx={{
                            background: "#F5F3FF",
                            color: "#7C3AED",
                            border: "1px solid #DDD6FE",
                            fontFamily: "Inter",
                            fontWeight: 500,
                            fontSize: 12,
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>,
            )}

            {/* Submit buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                pb: 4,
              }}
            >
              <Button
                onClick={() => navigate("/")}
                variant="outlined"
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 14,
                  borderColor: "#E5E7EB",
                  color: "#374151",
                  borderRadius: "10px",
                  px: 3,
                  "&:hover": { borderColor: "#374151" },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                sx={{
                  background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 15,
                  borderRadius: "10px",
                  px: 4,
                  boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Post Job →"
                )}
              </Button>
            </Box>
          </Box>

          {/* ---- RIGHT: PREVIEW + TIPS ---- */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: { md: "sticky" },
              top: { md: 90 },
            }}
          >
            {/* Live preview */}
            <Box
              sx={{
                background: "white",
                borderRadius: "20px",
                border: "1.5px solid #E5E7EB",
                p: 3,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#0F0A27",
                  mb: 2,
                }}
              >
                Live Preview
              </Typography>

              <Box
                sx={{
                  border: "1.5px solid #E5E7EB",
                  borderRadius: "16px",
                  p: 2.5,
                  background: "#FAFAFA",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      background: "#7C3AED",
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    {form.company ? form.company[0].toUpperCase() : "?"}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 12,
                        color: "#374151",
                      }}
                    >
                      {form.company || "Company Name"}
                    </Typography>
                    <Chip
                      label={preview.type}
                      size="small"
                      sx={{
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: 10,
                        height: 18,
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#0F0A27",
                    mb: 1.5,
                  }}
                >
                  {form.title || "Job Title"}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    mb: 1.5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <LocationOnOutlined
                      sx={{ fontSize: 13, color: "#9CA3AF" }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      {form.location || "Location"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <AttachMoneyOutlined
                      sx={{ fontSize: 13, color: "#9CA3AF" }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: 12,
                        color: "#6B7280",
                      }}
                    >
                      {form.salary || "Salary"}
                    </Typography>
                  </Box>
                </Box>

                {form.tags.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                      mb: 1.5,
                    }}
                  >
                    {form.tags.slice(0, 3).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          background: "#F8F7FF",
                          color: "#7C3AED",
                          border: "1px solid #DDD6FE",
                          fontFamily: "Inter",
                          fontSize: 10,
                        }}
                      />
                    ))}
                  </Box>
                )}

                <Divider sx={{ mb: 1.5 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeOutlined
                      sx={{ fontSize: 12, color: "#9CA3AF" }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: 11,
                        color: "#9CA3AF",
                      }}
                    >
                      Just now
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: 12,
                      color: "#7C3AED",
                      fontWeight: 600,
                    }}
                  >
                    View Details →
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Tips */}
            <Box
              sx={{
                background: "white",
                borderRadius: "20px",
                border: "1.5px solid #E5E7EB",
                p: 3,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <LightbulbOutlined sx={{ color: "#F59E0B", fontSize: 20 }} />
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#0F0A27",
                  }}
                >
                  Tips for a great post
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {TIPS.map((tip, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <CheckCircleOutlined
                      sx={{
                        fontSize: 15,
                        color: "#10B981",
                        mt: 0.3,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: 13,
                        color: "#374151",
                        lineHeight: 1.5,
                      }}
                    >
                      {tip}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: "10px", fontFamily: "Inter" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
