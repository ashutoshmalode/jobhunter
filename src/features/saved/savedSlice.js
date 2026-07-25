import { createSlice } from "@reduxjs/toolkit";

const savedSlice = createSlice({
  name: "saved",
  initialState: {
    savedJobs: [],
  },
  reducers: {
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
    addSavedJob: (state, action) => {
      const exists = state.savedJobs.find((j) => j.id === action.payload.id);
      if (!exists) state.savedJobs.push(action.payload);
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter((j) => j.id !== action.payload);
    },
  },
});

export const { setSavedJobs, addSavedJob, removeSavedJob } = savedSlice.actions;
export default savedSlice.reducer;
