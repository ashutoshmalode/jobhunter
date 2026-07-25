import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { WorkOffOutlined } from "@mui/icons-material";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { setJobs } from "../features/jobs/jobsSlice";
import { MOCK_JOBS } from "../data/mockJobs";
import JobCard from "./JobCard";

const PAGE_SIZE = 6;
import { useState } from "react";

export default function JobsGrid() {
  const dispatch = useDispatch();
  const { filteredJobs, loading } = useSelector((state) => state.jobs);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function loadJobs() {
      try {
        // Fetch real posted jobs from Firestore
        const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const firestoreJobs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp to ISO string so Redux can serialize it
          createdAt:
            doc.data().createdAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
        }));

        // Merge: Firestore jobs first, then mock jobs that aren't duplicates
        const merged = [...firestoreJobs, ...MOCK_JOBS];
        dispatch(setJobs(merged));
      } catch (err) {
        console.error("Failed to load jobs from Firestore:", err);
        // Fallback to mock jobs if Firestore fails
        dispatch(setJobs(MOCK_JOBS));
      }
    }

    loadJobs();
  }, [dispatch]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "20px",
            background: "#F5F3FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WorkOffOutlined sx={{ fontSize: 40, color: "#7C3AED" }} />
        </Box>
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#0F0A27",
          }}
        >
          No jobs found
        </Typography>
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#6B7280",
            maxWidth: 320,
          }}
        >
          Try adjusting your search or filter to find what you're looking for.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
          mb: 5,
        }}
      >
        {visibleJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </Box>

      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            variant="outlined"
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              borderColor: "#7C3AED",
              color: "#7C3AED",
              borderRadius: "100px",
              px: 4,
              py: 1.2,
              fontSize: 14,
              "&:hover": { background: "#F5F3FF", borderColor: "#7C3AED" },
            }}
          >
            Load More Jobs ({filteredJobs.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}
