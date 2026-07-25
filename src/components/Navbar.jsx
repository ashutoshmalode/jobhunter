import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Tooltip,
  Badge,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close,
  WorkOutlined,
  Favorite,
  PersonOutlined,
  LogoutOutlined,
  AddBoxOutlined,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { clearUser } from "../features/auth/authSlice";

const NAV_LINKS = [
  { label: "Browse Jobs", path: "/" },
  { label: "Companies", path: "/companies" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { savedJobs } = useSelector((state) => state.saved);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    setAnchorEl(null);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const avatarLetters = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  const mobileMenuItems = user
    ? [
        {
          label: "Saved Jobs",
          path: "/saved",
          icon: <Favorite sx={{ fontSize: 20, color: "#7C3AED" }} />,
        },
        {
          label: "Post a Job",
          path: "/post-job",
          icon: <AddBoxOutlined sx={{ fontSize: 20, color: "#7C3AED" }} />,
        },
        {
          label: "Profile",
          path: "/profile",
          icon: <PersonOutlined sx={{ fontSize: 20, color: "#7C3AED" }} />,
        },
      ]
    : [];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E5E7EB",
          color: "#0F0A27",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1280px",
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 4 },
            minHeight: { xs: 64, md: 72 },
          }}
          disableGutters
        >
          {/* LOGO */}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
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
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#0F0A27",
                fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.02em",
              }}
            >
              Job
              <Box component="span" sx={{ color: "#7C3AED" }}>
                Hunter
              </Box>
            </Typography>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 0.5,
              ml: 4,
            }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{ textDecoration: "none" }}
              >
                <Button
                  sx={{
                    color: isActive(link.path) ? "#7C3AED" : "#374151",
                    fontWeight: isActive(link.path) ? 700 : 500,
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                    textTransform: "none",
                    borderBottom: isActive(link.path)
                      ? "2px solid #7C3AED"
                      : "2px solid transparent",
                    borderRadius: 0,
                    px: 2,
                    py: 1,
                    "&:hover": { color: "#7C3AED", background: "transparent" },
                  }}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* DESKTOP RIGHT SIDE */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {user ? (
              <>
                <Tooltip title="Saved Jobs">
                  <IconButton
                    onClick={() => navigate("/saved")}
                    sx={{ color: "#374151" }}
                  >
                    <Badge badgeContent={savedJobs.length} color="error">
                      <Favorite sx={{ fontSize: 20 }} />
                    </Badge>
                  </IconButton>
                </Tooltip>

                <Button
                  onClick={() => navigate("/post-job")}
                  startIcon={<AddBoxOutlined />}
                  variant="outlined"
                  sx={{
                    borderColor: "#7C3AED",
                    color: "#7C3AED",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "14px",
                    borderRadius: "8px",
                    "&:hover": {
                      background: "#F5F3FF",
                      borderColor: "#7C3AED",
                    },
                  }}
                >
                  Post a Job
                </Button>

                <Tooltip title={user.displayName || user.email}>
                  <Button
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      textTransform: "none",
                      color: "#374151",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      borderRadius: "8px",
                      "&:hover": { background: "#F9FAFB" },
                    }}
                  >
                    <Avatar
                      src={user.photoURL || ""}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#7C3AED",
                        fontSize: 13,
                        mr: 1,
                      }}
                    >
                      {avatarLetters}
                    </Avatar>
                    {user.displayName?.split(" ")[0] || "Account"}
                  </Button>
                </Tooltip>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  slotProps={{
                    paper: {
                      elevation: 3,
                      sx: {
                        mt: 1,
                        borderRadius: "12px",
                        minWidth: 180,
                        border: "1px solid #E5E7EB",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      setAnchorEl(null);
                    }}
                    sx={{ fontFamily: "Inter", fontSize: 14, gap: 1.5 }}
                  >
                    <PersonOutlined fontSize="small" /> Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate("/saved");
                      setAnchorEl(null);
                    }}
                    sx={{ fontFamily: "Inter", fontSize: 14, gap: 1.5 }}
                  >
                    <Favorite fontSize="small" /> Saved Jobs
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      fontFamily: "Inter",
                      fontSize: 14,
                      gap: 1.5,
                      color: "#EF4444",
                    }}
                  >
                    <LogoutOutlined fontSize="small" /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button
                    sx={{
                      color: "#374151",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "14px",
                      "&:hover": { background: "#F9FAFB" },
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    sx={{
                      background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "14px",
                      borderRadius: "8px",
                      px: 3,
                      boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Box>

          {/* MOBILE HAMBURGER */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "#374151" }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: { sx: { width: 280, p: 2 } },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              fontFamily: "Inter",
              color: "#0F0A27",
            }}
          >
            Job
            <Box component="span" sx={{ color: "#7C3AED" }}>
              Hunter
            </Box>
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <List disablePadding>
          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <ListItem key={link.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(link.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: "8px",
                  mb: 0.5,
                  color: isActive(link.path) ? "#7C3AED" : "#374151",
                  fontWeight: isActive(link.path) ? 700 : 500,
                }}
              >
                <ListItemText>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: 15,
                      fontWeight: isActive(link.path) ? 700 : 500,
                      color: isActive(link.path) ? "#7C3AED" : "#374151",
                    }}
                  >
                    {link.label}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}

          <Divider sx={{ my: 1 }} />

          {/* Logged-in items */}
          {mobileMenuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{ borderRadius: "8px", mb: 0.5, gap: 1.5 }}
              >
                {item.icon}
                <ListItemText>
                  <Typography
                    sx={{ fontFamily: "Inter", fontSize: 15, color: "#374151" }}
                  >
                    {item.label}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}

          {user && <Divider sx={{ my: 1 }} />}

          {/* Auth buttons */}
          {user ? (
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: "8px", gap: 1.5 }}
              >
                <LogoutOutlined sx={{ fontSize: 20, color: "#EF4444" }} />
                <ListItemText>
                  <Typography
                    sx={{ fontFamily: "Inter", fontSize: 15, color: "#EF4444" }}
                  >
                    Logout
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                  sx={{ borderRadius: "8px", mb: 0.5 }}
                >
                  <ListItemText>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: 15,
                        color: "#374151",
                      }}
                    >
                      Login
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/signup");
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                    },
                  }}
                >
                  <ListItemText>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: 15,
                        color: "white",
                        fontWeight: 700,
                      }}
                    >
                      Sign Up
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
