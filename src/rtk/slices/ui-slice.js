import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openDB } from "idb";

// Async thunk to load trainings
export const loadTrainingsAsync = createAsyncThunk(
  "UISlice/loadTrainings",
  async () => {
    const db = await openDB("gym-trainings", 1, {
      upgrade(db) {
        const store = db.createObjectStore("trainings", {
          keyPath: "category",
        });
        store.createIndex("categoryIndex", "category");
      },
    });

    const transaction = db.transaction("trainings", "readonly");
    const store = transaction.objectStore("trainings");

    const trainings = await store.getAll();

    // Transform the data to the desired structure
    const transformedTrainings = trainings.map((training) => ({
      split: training.split,
      category: training.category,
      trainings: training.trainings,
    }));

    return transformedTrainings;
  }
);

const UISlice = createSlice({
  name: "UISlice",
  initialState: { viewMode: "table", trainings: [] },
  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTrainingsAsync.fulfilled, (state, action) => {
      state.trainings = action.payload;
    });
  },
});

export const { setViewMode } = UISlice.actions;
export const loadTrainings = loadTrainingsAsync;
export default UISlice.reducer;
