import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Typography, Select, MenuItem } from "@mui/material";
import { setActiveFilter, applyFilters } from "../features/jobs/jobsSlice";
import { useState } from "react";

const FILTERS = [
  "All",
  "Full-time",
  "Part-time",
  "Remote",
  "Internship",
  "Contract",
];

export default function FilterBar() {
  const dispatch = useDispatch();
  const { activeFilter, filteredJobs } = useSelector((state) => state.jobs);
  const [sortBy, setSortBy] = useState("latest");

  const handleFilter = (filter) => {
    dispatch(setActiveFilter(filter));
    dispatch(applyFilters());
  };

  return (
    <Box
      sx={{
        background: "white",
        borderBottom: "1px solid #E5E7EB",
        position: "sticky",
        top: { xs: 64, md: 72 },
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {/* Filter pills */}
        <Box
          sx={{
            display: "flex",
            gap: 0.8,
            flexWrap: "nowrap",
            overflowX: "auto",
            pb: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              onClick={() => handleFilter(filter)}
              variant={activeFilter === filter ? "contained" : "outlined"}
              size="small"
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 13,
                textTransform: "none",
                borderRadius: "100px",
                px: 2,
                whiteSpace: "nowrap",
                flexShrink: 0,
                ...(activeFilter === filter
                  ? {
                      background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #6D28D9, #5B21B6)",
                      },
                    }
                  : {
                      borderColor: "#E5E7EB",
                      color: "#374151",
                      "&:hover": {
                        borderColor: "#7C3AED",
                        color: "#7C3AED",
                        background: "#F5F3FF",
                      },
                    }),
              }}
            >
              {filter}
            </Button>
          ))}
        </Box>

        {/* Right side: count + sort */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: "#6B7280",
              fontFamily: "Inter, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {filteredJobs.length} jobs found
          </Typography>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: "#374151",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E5E7EB" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#7C3AED",
              },
              borderRadius: "8px",
            }}
          >
            <MenuItem value="latest" sx={{ fontFamily: "Inter", fontSize: 13 }}>
              Latest
            </MenuItem>
            <MenuItem value="salary" sx={{ fontFamily: "Inter", fontSize: 13 }}>
              Salary
            </MenuItem>
            <MenuItem
              value="company"
              sx={{ fontFamily: "Inter", fontSize: 13 }}
            >
              Company
            </MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
