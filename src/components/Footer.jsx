import { Box, Typography, Divider, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { WorkOutlined } from "@mui/icons-material";

const LINKS = {
  "Quick Links": [
    { label: "Browse Jobs", path: "/" },
    { label: "Companies", path: "/companies" },
    { label: "Post a Job", path: "/post-job" },
    { label: "Login", path: "/login" },
    { label: "Sign Up", path: "/signup" },
  ],
  "For Job Seekers": [
    { label: "Browse Jobs", path: "/" },
    { label: "Saved Jobs", path: "/saved" },
    { label: "Profile", path: "/profile" },
  ],
  "For Employers": [
    { label: "Post a Job", path: "/post-job" },
    { label: "Why JobHunter", path: "/" },
  ],
};

const SOCIALS = [
  {
    label: "X (Twitter)",
    href: "https://x.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: "#0F0A27",
        color: "white",
        pt: 0,
        mt: "auto",
      }}
    >
      {/* Top accent line */}
      <Box
        sx={{
          height: 3,
          background:
            "linear-gradient(90deg, #7C3AED, #A855F7, #EC4899, #7C3AED)",
          backgroundSize: "200% 100%",
        }}
      />

      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 3, md: 6 },
          pt: 6,
          pb: 4,
        }}
      >
        {/* Main grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "2fr 1fr 1fr 1fr",
            },
            gap: { xs: 4, md: 6 },
            mb: 5,
          }}
        >
          {/* Brand column */}
          <Box>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WorkOutlined sx={{ color: "white", fontSize: 20 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  Job
                  <Box component="span" sx={{ color: "#A78BFA" }}>
                    Hunter
                  </Box>
                </Typography>
              </Box>
            </Link>

            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.7,
                mb: 3,
                maxWidth: 240,
              }}
            >
              Find your dream job faster than ever. Connecting talent with
              opportunity since 2026.
            </Typography>

            {/* Social icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {SOCIALS.map((social) => (
                <Tooltip key={social.label} title={social.label}>
                  <IconButton
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      width: 36,
                      height: 36,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#A78BFA",
                        borderColor: "#7C3AED",
                        background: "rgba(124,58,237,0.15)",
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <Box key={title}>
              <Typography
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "white",
                  mb: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {title}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: 13,
                        color: "rgba(255,255,255,0.55)",
                        transition: "color 0.2s ease",
                        "&:hover": { color: "#A78BFA" },
                        cursor: "pointer",
                      }}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom bar */}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 3 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            © 2026 JobHunter. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <Typography
                key={item}
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.35)",
                  cursor: "pointer",
                  "&:hover": { color: "#A78BFA" },
                  transition: "color 0.2s ease",
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
