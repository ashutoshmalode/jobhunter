import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PersonOutlined,
  EmailOutlined,
  CalendarTodayOutlined,
  FavoriteOutlined,
  WorkOutlined,
  DeleteOutlined,
  AddBoxOutlined,
  LogoutOutlined,
  LocationOnOutlined,
  AttachMoneyOutlined,
} from "@mui/icons-material";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { clearUser } from "../features/auth/authSlice";
import { setJobs } from "../features/jobs/jobsSlice";
import { MOCK_JOBS } from "../data/mockJobs";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const { savedJobs } = useSelector((state) => state.saved);
  const { allJobs } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [postedJobs, setPostedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPostedJobs();
  }, [user]);

  const fetchPostedJobs = async () => {
    setLoadingJobs(true);
    try {
      const q = query(
        collection(db, "jobs"),
        where("postedBy", "==", user.uid),
      );
      const snapshot = await getDocs(q);
      const jobs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPostedJobs(jobs);
    } catch (err) {
      console.error("Failed to fetch posted jobs:", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      setPostedJobs((prev) => prev.filter((j) => j.id !== jobId));
      // Remove from Redux store too
      dispatch(setJobs(allJobs.filter((j) => j.id !== jobId)));
      setSnackbar({
        open: true,
        message: "Job deleted successfully.",
        severity: "info",
      });
    } catch (err) {
      console.error("Failed to delete job:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete job.",
        severity: "error",
      });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(clearUser());
    navigate("/");
  };

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  const avatarLetters = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "U";

  if (!user) return null;

  return (
    <Box sx={{ background: "#F8F7FF", minHeight: "100vh", py: 5 }}>
      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, md: 4 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "320px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* ---- LEFT: PROFILE CARD ---- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              background: "white",
              borderRadius: "20px",
              border: "1.5px solid #E5E7EB",
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Avatar */}
            <Box sx={{ position: "relative", mb: 2 }}>
              <Avatar
                src={user.photoURL || ""}
                sx={{
                  width: 88,
                  height: 88,
                  background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                  fontSize: 28,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                  border: "4px solid #F5F3FF",
                }}
              >
                {avatarLetters}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#10B981",
                  border: "2px solid white",
                }}
              />
            </Box>

            {/* Name + email */}
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#0F0A27",
                mb: 0.3,
              }}
            >
              {user.displayName || "Anonymous User"}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "#6B7280",
                mb: 2,
              }}
            >
              {user.email}
            </Typography>

            <Divider sx={{ width: "100%", mb: 2 }} />

            {/* Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1.5,
                width: "100%",
                mb: 2,
              }}
            >
              {[
                {
                  icon: (
                    <FavoriteOutlined sx={{ fontSize: 16, color: "#EF4444" }} />
                  ),
                  value: savedJobs.length,
                  label: "Saved",
                },
                {
                  icon: (
                    <WorkOutlined sx={{ fontSize: 16, color: "#7C3AED" }} />
                  ),
                  value: postedJobs.length,
                  label: "Posted",
                },
              ].map((stat, i) => (
                <Box
                  key={i}
                  sx={{
                    background: "#F8F7FF",
                    borderRadius: "12px",
                    p: 1.5,
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      color: "#0F0A27",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11,
                      color: "#6B7280",
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Member since */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                background: "#F8F7FF",
                borderRadius: "10px",
                px: 2,
                py: 1,
                width: "100%",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <CalendarTodayOutlined sx={{ fontSize: 14, color: "#9CA3AF" }} />
              <Typography
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#6B7280",
                }}
              >
                Member since {memberSince}
              </Typography>
            </Box>

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <Button
                onClick={() => navigate("/post-job")}
                variant="contained"
                startIcon={<AddBoxOutlined />}
                fullWidth
                sx={{
                  background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  textTransform: "none",
                  fontSize: 14,
                  borderRadius: "10px",
                  py: 1.2,
                  boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                  },
                }}
              >
                Post a Job
              </Button>

              <Button
                onClick={() => navigate("/saved")}
                variant="outlined"
                startIcon={<FavoriteOutlined />}
                fullWidth
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 14,
                  borderColor: "#E5E7EB",
                  color: "#374151",
                  borderRadius: "10px",
                  py: 1.2,
                  "&:hover": {
                    borderColor: "#7C3AED",
                    color: "#7C3AED",
                    background: "#F5F3FF",
                  },
                }}
              >
                View Saved Jobs
              </Button>

              <Button
                onClick={handleLogout}
                variant="outlined"
                startIcon={<LogoutOutlined />}
                fullWidth
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: 14,
                  borderColor: "#FEE2E2",
                  color: "#EF4444",
                  borderRadius: "10px",
                  py: 1.2,
                  "&:hover": { borderColor: "#EF4444", background: "#FFF1F2" },
                }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ---- RIGHT: POSTED JOBS ---- */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              background: "white",
              borderRadius: "20px",
              border: "1.5px solid #E5E7EB",
              p: { xs: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#0F0A27",
                  }}
                >
                  My Posted Jobs
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "#6B7280",
                    mt: 0.3,
                  }}
                >
                  Jobs you've posted to JobHunter
                </Typography>
              </Box>
              <Chip
                label={`${postedJobs.length} posted`}
                sx={{
                  background: "#F5F3FF",
                  color: "#7C3AED",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: 12,
                  border: "1px solid #DDD6FE",
                }}
              />
            </Box>

            {loadingJobs ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "#7C3AED" }} />
              </Box>
            ) : postedJobs.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "20px",
                    background: "#F5F3FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WorkOutlined sx={{ fontSize: 36, color: "#7C3AED" }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#0F0A27",
                  }}
                >
                  No jobs posted yet
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: 13,
                    color: "#6B7280",
                    maxWidth: 260,
                  }}
                >
                  Post your first job and reach thousands of qualified
                  candidates.
                </Typography>
                <Button
                  onClick={() => navigate("/post-job")}
                  variant="contained"
                  sx={{
                    mt: 1,
                    background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                    fontFamily: "Inter",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: 14,
                    borderRadius: "10px",
                    px: 3,
                    "&:hover": {
                      background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                    },
                  }}
                >
                  Post a Job
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {postedJobs.map((job) => (
                  <Box
                    key={job.id}
                    sx={{
                      border: "1.5px solid #E5E7EB",
                      borderRadius: "16px",
                      p: 2.5,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#7C3AED",
                        boxShadow: "0 4px 16px rgba(124,58,237,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: "Inter",
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "#0F0A27",
                            mb: 0.3,
                          }}
                        >
                          {job.title}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Inter",
                            fontSize: 13,
                            color: "#6B7280",
                            mb: 1,
                          }}
                        >
                          {job.company}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1.5,
                            mb: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
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
                              {job.location}
                            </Typography>
                          </Box>
                          {job.salary && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
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
                                {job.salary}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.7 }}
                        >
                          <Chip
                            label={job.type}
                            size="small"
                            sx={{
                              background: "#EEF2FF",
                              color: "#4338CA",
                              fontFamily: "Inter",
                              fontWeight: 600,
                              fontSize: 10,
                            }}
                          />
                          {job.tags?.slice(0, 3).map((tag) => (
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
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                        <Tooltip title="Delete job">
                          <IconButton
                            onClick={() => handleDelete(job.id)}
                            size="small"
                            sx={{
                              color: "#9CA3AF",
                              border: "1px solid #E5E7EB",
                              borderRadius: "8px",
                              "&:hover": {
                                color: "#EF4444",
                                borderColor: "#EF4444",
                                background: "#FFF1F2",
                              },
                            }}
                          >
                            <DeleteOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: "10px", fontFamily: "Inter" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
