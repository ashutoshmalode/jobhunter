import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  LocationOnOutlined,
  FavoriteOutlined,
  Favorite,
  AttachMoneyOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material";
import { addSavedJob, removeSavedJob } from "../features/saved/savedSlice";

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function isNew(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  return diff < 1000 * 60 * 60 * 24;
}

const TYPE_COLORS = {
  "Full-time": { bg: "#EEF2FF", color: "#4338CA" },
  "Part-time": { bg: "#FFF7ED", color: "#C2410C" },
  Remote: { bg: "#ECFDF5", color: "#065F46" },
  Internship: { bg: "#FFF1F2", color: "#BE123C" },
  Contract: { bg: "#F5F3FF", color: "#6D28D9" },
};

export default function JobCard({ job }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedJobs } = useSelector((state) => state.saved);
  const { user } = useSelector((state) => state.auth);
  const isSaved = savedJobs.some((j) => j.id === job.id);

  const handleSave = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (isSaved) {
      dispatch(removeSavedJob(job.id));
    } else {
      dispatch(addSavedJob(job));
    }
  };

  const typeStyle = TYPE_COLORS[job.type] || {
    bg: "#F3F4F6",
    color: "#374151",
  };

  return (
    <Box
      onClick={() => navigate(`/job/${job.id}`)}
      sx={{
        background: "white",
        border: "1.5px solid #E5E7EB",
        borderRadius: "16px",
        p: 3,
        cursor: "pointer",
        position: "relative",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: "#7C3AED",
          boxShadow: "0 8px 32px rgba(124,58,237,0.15)",
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* New badge */}
      {isNew(job.postedAt) && (
        <Box
          sx={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            px: 1,
            py: 0.3,
            borderRadius: "6px",
            letterSpacing: "0.05em",
          }}
        >
          NEW
        </Box>
      )}

      {/* Save button */}
      <Tooltip title={isSaved ? "Remove from saved" : "Save job"}>
        <IconButton
          onClick={handleSave}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: isSaved ? "#EF4444" : "#9CA3AF",
            "&:hover": { color: "#EF4444", background: "#FFF1F2" },
          }}
        >
          {isSaved ? (
            <Favorite fontSize="small" />
          ) : (
            <FavoriteOutlined fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {/* Company info */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          mb: 2,
          mt: isNew(job.postedAt) ? 2 : 0,
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            borderRadius: "10px",
            background: job.companyColor || "#7C3AED",
            fontSize: 16,
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {job.company[0]}
        </Avatar>
        <Box>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "#374151",
            }}
          >
            {job.company}
          </Typography>
          <Chip
            label={job.type}
            size="small"
            sx={{
              background: typeStyle.bg,
              color: typeStyle.color,
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 10,
              height: 20,
              mt: 0.3,
            }}
          />
        </Box>
      </Box>

      {/* Job title */}
      <Typography
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#0F0A27",
          mb: 1.5,
          lineHeight: 1.3,
        }}
      >
        {job.title}
      </Typography>

      {/* Location + Salary */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
          <LocationOnOutlined sx={{ fontSize: 15, color: "#9CA3AF" }} />
          <Typography
            sx={{
              fontSize: 13,
              color: "#6B7280",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {job.location}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
          <AttachMoneyOutlined sx={{ fontSize: 15, color: "#9CA3AF" }} />
          <Typography
            sx={{
              fontSize: 13,
              color: "#6B7280",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {job.salary}
          </Typography>
        </Box>
      </Box>

      {/* Tags */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, mb: 2.5 }}>
        {job.tags.slice(0, 3).map((tag) => (
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
              fontSize: 11,
            }}
          />
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pt: 2,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AccessTimeOutlined sx={{ fontSize: 13, color: "#9CA3AF" }} />
          <Typography
            sx={{
              fontSize: 12,
              color: "#9CA3AF",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {timeAgo(job.postedAt)}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: 13,
            color: "#7C3AED",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          View Details →
        </Typography>
      </Box>
    </Box>
  );
}
