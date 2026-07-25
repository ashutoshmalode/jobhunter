import { createSlice } from "@reduxjs/toolkit";

const jobsSlice = createSlice({
  name: "jobs",
  initialState: {
    allJobs: [],
    filteredJobs: [],
    searchQuery: "",
    locationQuery: "",
    activeFilter: "All",
    loading: false,
    error: null,
  },
  reducers: {
    setJobs: (state, action) => {
      state.allJobs = action.payload;
      state.filteredJobs = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLocationQuery: (state, action) => {
      state.locationQuery = action.payload;
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    applyFilters: (state) => {
      let result = [...state.allJobs];
      if (state.searchQuery.trim()) {
        result = result.filter(
          (job) =>
            job.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            job.company
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            job.tags?.some((tag) =>
              tag.toLowerCase().includes(state.searchQuery.toLowerCase()),
            ),
        );
      }
      if (state.locationQuery.trim()) {
        result = result.filter((job) =>
          job.location
            .toLowerCase()
            .includes(state.locationQuery.toLowerCase()),
        );
      }
      if (state.activeFilter !== "All") {
        result = result.filter((job) => job.type === state.activeFilter);
      }
      state.filteredJobs = result;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setJobs,
  setSearchQuery,
  setLocationQuery,
  setActiveFilter,
  applyFilters,
  setLoading,
  setError,
} = jobsSlice.actions;
export default jobsSlice.reducer;
