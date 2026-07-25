import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { FavoriteOutlined, SearchOutlined } from "@mui/icons-material";
import JobCard from "../components/JobCard";

export default function SavedJobs() {
  const { user } = useSelector((state) => state.auth);
  const { savedJobs } = useSelector((state) => state.saved);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Box sx={{ background: "#F8F7FF", minHeight: "100vh", py: 5 }}>
      <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 } }}>
        {/* Page header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}
            >
              <FavoriteOutlined sx={{ color: "#EF4444", fontSize: 28 }} />
              <Typography
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  color: "#0F0A27",
                }}
              >
                Saved Jobs
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Jobs you've bookmarked for later
            </Typography>
          </Box>

          <Box
            sx={{
              background: "white",
              border: "1.5px solid #E5E7EB",
              borderRadius: "12px",
              px: 2.5,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <FavoriteOutlined sx={{ color: "#EF4444", fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#0F0A27",
              }}
            >
              {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
            </Typography>
          </Box>
        </Box>

        {/* Empty state */}
        {savedJobs.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 14,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 88,
                height: 88,
                borderRadius: "24px",
                background: "#FFF1F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <FavoriteOutlined sx={{ fontSize: 44, color: "#EF4444" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
                color: "#0F0A27",
              }}
            >
              No saved jobs yet
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#6B7280",
                maxWidth: 320,
                lineHeight: 1.6,
              }}
            >
              Start browsing jobs and click the heart icon to save ones you
              like.
            </Typography>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              startIcon={<SearchOutlined />}
              sx={{
                mt: 1,
                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                textTransform: "none",
                fontSize: 14,
                borderRadius: "10px",
                px: 3,
                py: 1.2,
                boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                },
              }}
            >
              Browse Jobs
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {savedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
