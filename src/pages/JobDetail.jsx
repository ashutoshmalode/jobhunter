import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ArrowBackOutlined,
  LocationOnOutlined,
  AttachMoneyOutlined,
  AccessTimeOutlined,
  CalendarTodayOutlined,
  FavoriteOutlined,
  Favorite,
  ShareOutlined,
  CheckCircleOutlined,
  WorkOutlined,
  BusinessOutlined,
  PeopleOutlined,
  OpenInNewOutlined,
} from "@mui/icons-material";
import { MOCK_JOBS } from "../data/mockJobs";
import { addSavedJob, removeSavedJob } from "../features/saved/savedSlice";
import JobCard from "../components/JobCard";

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

const TYPE_COLORS = {
  "Full-time": { bg: "#EEF2FF", color: "#4338CA" },
  "Part-time": { bg: "#FFF7ED", color: "#C2410C" },
  Remote: { bg: "#ECFDF5", color: "#065F46" },
  Internship: { bg: "#FFF1F2", color: "#BE123C" },
  Contract: { bg: "#F5F3FF", color: "#6D28D9" },
};

const COMPANY_INFO = {
  Google: {
    industry: "Technology",
    size: "100,000+ employees",
    location: "Mountain View, CA",
  },
  Meta: {
    industry: "Social Media",
    size: "70,000+ employees",
    location: "Menlo Park, CA",
  },
  Stripe: {
    industry: "Fintech",
    size: "8,000+ employees",
    location: "San Francisco, CA",
  },
  Netflix: {
    industry: "Entertainment",
    size: "12,000+ employees",
    location: "Los Gatos, CA",
  },
  Apple: {
    industry: "Technology",
    size: "150,000+ employees",
    location: "Cupertino, CA",
  },
  Airbnb: {
    industry: "Travel & Hospitality",
    size: "6,000+ employees",
    location: "San Francisco, CA",
  },
  Figma: {
    industry: "Design Tools",
    size: "1,000+ employees",
    location: "San Francisco, CA",
  },
  Shopify: {
    industry: "E-commerce",
    size: "10,000+ employees",
    location: "Ottawa, Canada",
  },
  OpenAI: {
    industry: "Artificial Intelligence",
    size: "500+ employees",
    location: "San Francisco, CA",
  },
  Microsoft: {
    industry: "Technology",
    size: "200,000+ employees",
    location: "Redmond, WA",
  },
  Uber: {
    industry: "Transportation",
    size: "30,000+ employees",
    location: "San Francisco, CA",
  },
  HubSpot: {
    industry: "Marketing Software",
    size: "7,000+ employees",
    location: "Cambridge, MA",
  },
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs } = useSelector((state) => state.saved);
  const { user } = useSelector((state) => state.auth);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [applied, setApplied] = useState(false);

  const job = MOCK_JOBS.find((j) => j.id === id);
  const isSaved = savedJobs.some((j) => j.id === id);
  const similarJobs = MOCK_JOBS.filter(
    (j) => j.id !== id && j.type === job?.type,
  ).slice(0, 3);
  const typeStyle = TYPE_COLORS[job?.type] || {
    bg: "#F3F4F6",
    color: "#374151",
  };
  const companyInfo = COMPANY_INFO[job?.company] || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!job) {
    return (
      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: 4,
          py: 8,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{ fontFamily: "Inter", fontSize: "1.2rem", color: "#374151" }}
        >
          Job not found.
        </Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2, color: "#7C3AED" }}>
          ← Back to Jobs
        </Button>
      </Box>
    );
  }

  const handleSave = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isSaved) {
      dispatch(removeSavedJob(job.id));
      setSnackbar({
        open: true,
        message: "Removed from saved jobs",
        severity: "info",
      });
    } else {
      dispatch(addSavedJob(job));
      setSnackbar({
        open: true,
        message: "Job saved successfully!",
        severity: "success",
      });
    }
  };

  const handleApply = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setApplied(true);
    setSnackbar({
      open: true,
      message: "Application submitted! Good luck 🎉",
      severity: "success",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSnackbar({
      open: true,
      message: "Link copied to clipboard!",
      severity: "success",
    });
  };

  const sectionTitle = (title) => (
    <Typography
      sx={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "1.1rem",
        color: "#0F0A27",
        mb: 2,
      }}
    >
      {title}
    </Typography>
  );

  return (
    <Box sx={{ background: "#F8F7FF", minHeight: "100vh", pb: 10 }}>
      {/* Back button */}
      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, md: 4 },
          pt: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackOutlined />}
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            color: "#374151",
            textTransform: "none",
            fontSize: 14,
            "&:hover": { background: "transparent", color: "#7C3AED" },
          }}
        >
          Back to Jobs
        </Button>
      </Box>

      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, md: 4 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* ---- LEFT COLUMN ---- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Job header card */}
          <Box
            sx={{
              background: "white",
              borderRadius: "20px",
              border: "1.5px solid #E5E7EB",
              p: { xs: 3, md: 4 },
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "16px",
                  background: job.companyColor || "#7C3AED",
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {job.company[0]}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#6B7280",
                    mb: 0.3,
                  }}
                >
                  {job.company}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: "1.3rem", md: "1.6rem" },
                    color: "#0F0A27",
                    lineHeight: 1.2,
                  }}
                >
                  {job.title}
                </Typography>
              </Box>
            </Box>

            {/* Meta row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 3,
              }}
            >
              {[
                {
                  icon: <LocationOnOutlined sx={{ fontSize: 16 }} />,
                  text: job.location,
                },
                {
                  icon: <AttachMoneyOutlined sx={{ fontSize: 16 }} />,
                  text: job.salary,
                },
                {
                  icon: <AccessTimeOutlined sx={{ fontSize: 16 }} />,
                  text: job.type,
                },
                {
                  icon: <CalendarTodayOutlined sx={{ fontSize: 16 }} />,
                  text: `Posted ${timeAgo(job.postedAt)}`,
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    color: "#6B7280",
                  }}
                >
                  {item.icon}
                  <Typography
                    sx={{ fontFamily: "Inter, sans-serif", fontSize: 13 }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Tags */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              <Chip
                label={job.type}
                size="small"
                sx={{
                  background: typeStyle.bg,
                  color: typeStyle.color,
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              />
              {job.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    background: "#F8F7FF",
                    color: "#7C3AED",
                    border: "1px solid #DDD6FE",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: 12,
                  }}
                />
              ))}
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button
                onClick={handleSave}
                variant="outlined"
                startIcon={
                  isSaved ? (
                    <Favorite sx={{ color: "#EF4444" }} />
                  ) : (
                    <FavoriteOutlined />
                  )
                }
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 14,
                  borderColor: isSaved ? "#EF4444" : "#E5E7EB",
                  color: isSaved ? "#EF4444" : "#374151",
                  borderRadius: "10px",
                  "&:hover": {
                    borderColor: "#EF4444",
                    color: "#EF4444",
                    background: "#FFF1F2",
                  },
                }}
              >
                {isSaved ? "Saved" : "Save Job"}
              </Button>
              <Tooltip title="Copy link to clipboard">
                <Button
                  onClick={handleShare}
                  variant="outlined"
                  startIcon={<ShareOutlined />}
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: 14,
                    borderColor: "#E5E7EB",
                    color: "#374151",
                    borderRadius: "10px",
                    "&:hover": {
                      borderColor: "#7C3AED",
                      color: "#7C3AED",
                      background: "#F5F3FF",
                    },
                  }}
                >
                  Share
                </Button>
              </Tooltip>
            </Box>
          </Box>

          {/* About this role */}
          <Box
            sx={{
              background: "white",
              borderRadius: "20px",
              border: "1.5px solid #E5E7EB",
              p: { xs: 3, md: 4 },
            }}
          >
            {sectionTitle("About this role")}
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: 15,
                color: "#374151",
                lineHeight: 1.8,
              }}
            >
              {job.description}
            </Typography>
          </Box>

          {/* Requirements */}
          <Box
            sx={{
              background: "white",
              borderRadius: "20px",
              border: "1.5px solid #E5E7EB",
              p: { xs: 3, md: 4 },
            }}
          >
            {sectionTitle("Requirements")}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {job.requirements.map((req, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <CheckCircleOutlined
                    sx={{
                      fontSize: 18,
                      color: "#10B981",
                      mt: 0.2,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 14,
                      color: "#374151",
                      lineHeight: 1.6,
                    }}
                  >
                    {req}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Skills */}
          <Box
            sx={{
              background: "white",
              borderRadius: "20px",
              border: "1.5px solid #E5E7EB",
              p: { xs: 3, md: 4 },
            }}
          >
            {sectionTitle("Skills & Technologies")}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {job.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{
                    background: "#F5F3FF",
                    color: "#7C3AED",
                    border: "1px solid #DDD6FE",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>

        {/* ---- RIGHT COLUMN ---- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Apply card */}
          <Box
            sx={{
              background: "white",
              borderRadius: "20px",
              border: "1.5px solid #E5E7EB",
              p: 3,
              position: { md: "sticky" },
              top: { md: 100 },
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0F0A27",
                mb: 2,
              }}
            >
              Apply for this role
            </Typography>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}
            >
              {[
                {
                  icon: (
                    <AttachMoneyOutlined
                      sx={{ fontSize: 16, color: "#7C3AED" }}
                    />
                  ),
                  label: "Salary",
                  value: job.salary,
                },
                {
                  icon: (
                    <LocationOnOutlined
                      sx={{ fontSize: 16, color: "#7C3AED" }}
                    />
                  ),
                  label: "Location",
                  value: job.location,
                },
                {
                  icon: (
                    <WorkOutlined sx={{ fontSize: 16, color: "#7C3AED" }} />
                  ),
                  label: "Job Type",
                  value: job.type,
                },
                {
                  icon: (
                    <CalendarTodayOutlined
                      sx={{ fontSize: 16, color: "#7C3AED" }}
                    />
                  ),
                  label: "Posted",
                  value: timeAgo(job.postedAt),
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1,
                    borderBottom: i < 3 ? "1px solid #F3F4F6" : "none",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.icon}
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: 13,
                        color: "#6B7280",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0F0A27",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              onClick={handleApply}
              variant="contained"
              fullWidth
              disabled={applied}
              sx={{
                background: applied
                  ? "linear-gradient(135deg, #10B981, #059669)"
                  : "linear-gradient(135deg, #7C3AED, #6D28D9)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                textTransform: "none",
                fontSize: 15,
                borderRadius: "10px",
                py: 1.5,
                mb: 1.5,
                boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                "&:hover": {
                  background: applied
                    ? "linear-gradient(135deg, #059669, #047857)"
                    : "linear-gradient(135deg, #6D28D9, #5B21B6)",
                },
              }}
            >
              {applied ? "✓ Applied!" : "Apply Now →"}
            </Button>

            <Button
              onClick={handleSave}
              variant="outlined"
              fullWidth
              startIcon={
                isSaved ? (
                  <Favorite sx={{ color: "#EF4444" }} />
                ) : (
                  <FavoriteOutlined />
                )
              }
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                fontSize: 14,
                borderColor: isSaved ? "#EF4444" : "#E5E7EB",
                color: isSaved ? "#EF4444" : "#374151",
                borderRadius: "10px",
                py: 1.2,
                "&:hover": {
                  borderColor: "#EF4444",
                  color: "#EF4444",
                  background: "#FFF1F2",
                },
              }}
            >
              {isSaved ? "Saved" : "Save Job"}
            </Button>
          </Box>

          {/* Company card */}
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
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#0F0A27",
                mb: 2,
              }}
            >
              About {job.company}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: job.companyColor || "#7C3AED",
                  fontSize: 20,
                  fontWeight: 700,
                  fontFamily: "Inter",
                }}
              >
                {job.company[0]}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#0F0A27",
                  }}
                >
                  {job.company}
                </Typography>
                <Typography
                  sx={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280" }}
                >
                  {companyInfo.industry || "Technology"}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {[
                {
                  icon: (
                    <PeopleOutlined sx={{ fontSize: 15, color: "#9CA3AF" }} />
                  ),
                  text: companyInfo.size || "1,000+ employees",
                },
                {
                  icon: (
                    <LocationOnOutlined
                      sx={{ fontSize: 15, color: "#9CA3AF" }}
                    />
                  ),
                  text: companyInfo.location || "United States",
                },
                {
                  icon: (
                    <BusinessOutlined sx={{ fontSize: 15, color: "#9CA3AF" }} />
                  ),
                  text: companyInfo.industry || "Technology",
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  {item.icon}
                  <Typography
                    sx={{ fontFamily: "Inter", fontSize: 13, color: "#6B7280" }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Similar jobs */}
          {similarJobs.length > 0 && (
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
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0F0A27",
                  mb: 2,
                }}
              >
                Similar Jobs
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {similarJobs.map((sJob) => (
                  <Box
                    key={sJob.id}
                    onClick={() => navigate(`/job/${sJob.id}`)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      cursor: "pointer",
                      p: 1.5,
                      borderRadius: "12px",
                      transition: "background 0.2s",
                      "&:hover": { background: "#F8F7FF" },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        background: sJob.companyColor || "#7C3AED",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {sJob.company[0]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: "Inter",
                          fontWeight: 600,
                          fontSize: 13,
                          color: "#0F0A27",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sJob.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Inter",
                          fontSize: 12,
                          color: "#6B7280",
                        }}
                      >
                        {sJob.company} · {sJob.location}
                      </Typography>
                    </Box>
                    <OpenInNewOutlined
                      sx={{ fontSize: 14, color: "#9CA3AF", flexShrink: 0 }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: "10px", fontFamily: "Inter, sans-serif" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
