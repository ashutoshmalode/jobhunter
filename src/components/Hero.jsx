import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  InputBase,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  SearchOutlined,
  LocationOnOutlined,
  TrendingUp,
  Business,
  People,
} from "@mui/icons-material";
import {
  setSearchQuery,
  setLocationQuery,
  applyFilters,
} from "../features/jobs/jobsSlice";

const POPULAR_SEARCHES = [
  "React Developer",
  "UI/UX Designer",
  "Node.js",
  "DevOps",
  "Python",
  "Product Manager",
];

const STATS = [
  {
    icon: <TrendingUp sx={{ fontSize: 20, color: "#7C3AED" }} />,
    value: "50k+",
    label: "Jobs Posted",
  },
  {
    icon: <Business sx={{ fontSize: 20, color: "#7C3AED" }} />,
    value: "2k+",
    label: "Companies",
  },
  {
    icon: <People sx={{ fontSize: 20, color: "#7C3AED" }} />,
    value: "100k+",
    label: "Hired",
  },
];

export default function Hero() {
  const [titleInput, setTitleInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    dispatch(setSearchQuery(titleInput));
    dispatch(setLocationQuery(locationInput));
    dispatch(applyFilters());
    // Scroll to jobs grid
    document
      .getElementById("jobs-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePopularSearch = (term) => {
    setTitleInput(term);
    dispatch(setSearchQuery(term));
    dispatch(applyFilters());
    document
      .getElementById("jobs-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, #F8F7FF 0%, #EDE9FE 50%, #F3E8FF 100%)",
        pt: { xs: 8, md: 12 },
        pb: { xs: 6, md: 10 },
        px: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background grid pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          backgroundImage: "radial-gradient(#7C3AED22 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Background blobs */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, #7C3AED22, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, #A855F722, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Pill badge */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              background: "white",
              border: "1px solid #DDD6FE",
              borderRadius: "100px",
              px: 2,
              py: 0.8,
              boxShadow: "0 2px 8px rgba(124,58,237,0.1)",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10B981",
                boxShadow: "0 0 0 3px #D1FAE5",
                animation: "pulse 2s infinite",
              }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                fontFamily: "Inter, sans-serif",
              }}
            >
              500+ companies hiring right now
            </Typography>
          </Box>
        </Box>

        {/* Main headline */}
        <Typography
          component="h1"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: { xs: "2.4rem", md: "3.8rem" },
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "#0F0A27",
            mb: 2,
          }}
        >
          Find Your Next{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(135deg, #7C3AED, #A855F7, #EC4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Dream Job
          </Box>{" "}
          🚀
        </Typography>

        {/* Subheading */}
        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.15rem" },
            color: "#6B7280",
            fontFamily: "Inter, sans-serif",
            mb: 5,
            maxWidth: 520,
            mx: "auto",
            lineHeight: 1.7,
          }}
        >
          Discover opportunities from the world's best companies. Your dream
          role is one click away.
        </Typography>

        {/* Search box */}
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            border: "2px solid #E5E7EB",
            borderRadius: "16px",
            overflow: "hidden",
            mb: 3,
            boxShadow: "0 8px 32px rgba(124,58,237,0.12)",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
            "&:focus-within": {
              borderColor: "#7C3AED",
              boxShadow: "0 8px 32px rgba(124,58,237,0.25)",
            },
          }}
        >
          {/* Title input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              px: 2.5,
              py: { xs: 1.5, md: 0 },
            }}
          >
            <SearchOutlined sx={{ color: "#9CA3AF", mr: 1.5, fontSize: 22 }} />
            <InputBase
              placeholder="Job title, skill, or company"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                flex: 1,
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                "& input": { py: 1.5 },
              }}
            />
          </Box>

          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", md: "block" },
              borderColor: "#E5E7EB",
            }}
          />
          <Divider
            sx={{
              display: { xs: "block", md: "none" },
              borderColor: "#E5E7EB",
            }}
          />

          {/* Location input */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              px: 2.5,
              py: { xs: 1.5, md: 0 },
            }}
          >
            <LocationOnOutlined
              sx={{ color: "#9CA3AF", mr: 1.5, fontSize: 22 }}
            />
            <InputBase
              placeholder='City, state, or "Remote"'
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
                flex: 1,
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                "& input": { py: 1.5 },
              }}
            />
          </Box>

          {/* Search button */}
          <Button
            onClick={handleSearch}
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              textTransform: "none",
              px: 4,
              py: { xs: 1.8, md: 0 },
              borderRadius: 0,
              minHeight: { md: 60 },
              boxShadow: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                boxShadow: "none",
              },
            }}
          >
            Search Jobs
          </Button>
        </Paper>

        {/* Popular searches */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "center",
            mb: 6,
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: "#6B7280",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
            }}
          >
            Popular:
          </Typography>
          {POPULAR_SEARCHES.map((term) => (
            <Chip
              key={term}
              label={term}
              onClick={() => handlePopularSearch(term)}
              size="small"
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                background: "white",
                border: "1px solid #E5E7EB",
                color: "#374151",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "#F5F3FF",
                  borderColor: "#7C3AED",
                  color: "#7C3AED",
                },
              }}
            />
          ))}
        </Box>

        {/* Stats bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 3, md: 6 },
            flexWrap: "wrap",
          }}
        >
          {STATS.map((stat, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "10px",
                  background: "#F5F3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {stat.icon}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "#0F0A27",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "#6B7280",
                    mt: 0.3,
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
              {i < STATS.length - 1 && (
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    ml: { xs: 1.5, md: 3 },
                    borderColor: "#E5E7EB",
                    display: { xs: "none", md: "block" },
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
}
