import { Box, Typography } from "@mui/material";
import { WorkOutlined, CheckCircleOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const FEATURES = [
  "50,000+ active job listings",
  "Top companies hiring now",
  "Save jobs & track applications",
  "One-click apply to any role",
];

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* LEFT PANEL */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A855F7 100%)",
          p: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background blobs */}
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WorkOutlined sx={{ color: "white", fontSize: 22 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "1.3rem",
                color: "white",
              }}
            >
              JobHunter
            </Typography>
          </Box>
        </Link>

        {/* Middle content */}
        <Box>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
              color: "white",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Find your dream job faster than ever.
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.75)",
              mb: 4,
            }}
          >
            Join thousands of professionals who found their perfect role through
            JobHunter.
          </Typography>

          {/* Feature list */}
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 5 }}
          >
            {FEATURES.map((feature) => (
              <Box
                key={feature}
                sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
              >
                <CheckCircleOutlined sx={{ color: "#A7F3D0", fontSize: 20 }} />
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {feature}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Testimonial */}
          <Box
            sx={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              p: 3,
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "white",
                fontStyle: "italic",
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              "Landing my dream job at Google was so easy with JobHunter. I had
              3 interviews within a week of signing up!"
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  color: "white",
                  fontSize: 14,
                }}
              >
                P
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "white",
                  }}
                >
                  Priya Sharma
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.65)",
                  }}
                >
                  Software Engineer at Google
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom */}
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          © 2026 JobHunter. All rights reserved.
        </Typography>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          flex: { xs: 1, md: "0 0 480px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 6 },
          py: 6,
          background: "white",
          overflowY: "auto",
        }}
      >
        {/* Mobile logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WorkOutlined sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#0F0A27",
              }}
            >
              Job
              <Box component="span" sx={{ color: "#7C3AED" }}>
                Hunter
              </Box>
            </Typography>
          </Box>
        </Link>

        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: "#0F0A27",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#6B7280",
            mb: 4,
          }}
        >
          {subtitle}
        </Typography>

        {children}
      </Box>
    </Box>
  );
}
