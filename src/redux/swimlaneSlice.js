import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch lanes
export const fetchLanes = createAsyncThunk("swimlane/fetchLanes", async () => {
  const response = await axios.get("/api/lanes");
  return response.data.lanes;
});

// Async thunk to move blocks
export const moveBlock = createAsyncThunk(
  "swimlane/moveBlock",
  async ({ sourceLaneId, targetLaneId, blockId }, { dispatch, getState }) => {
    try {
      const response = await axios.post("/api/moveBlock", {
        sourceLaneId,
        targetLaneId,
        blockId,
      });

      if (response.status === 400) {
        return { success: false }; // Indicate failure
      }

      if (response.status === 200) {
        const { lanes } = getState().swimlane;
        const sourceLane = lanes.find((lane) => lane.id === sourceLaneId);
        const targetLane = lanes.find((lane) => lane.id === targetLaneId);

        const blockToMove = sourceLane.blocks.find(
          (block) => block.id === blockId
        );

        // Add the movement history
        const newHistoryEntry = {
          fromLane: sourceLane.name,
          toLane: targetLane.name,
          timestamp: new Date().toISOString(),
        };

        const updatedBlock = {
          ...blockToMove,
          history: [...(blockToMove.history || []), newHistoryEntry], // Append the new history entry
        };

        // Remove block from source lane and add it to target lane
        const updatedSourceBlocks = sourceLane.blocks.filter(
          (block) => block.id !== blockId
        );
        const updatedTargetBlocks = [...targetLane.blocks, updatedBlock];

        // Update lanes
        const updatedLanes = lanes.map((lane) =>
          lane.id === sourceLaneId
            ? { ...lane, blocks: updatedSourceBlocks }
            : lane.id === targetLaneId
            ? { ...lane, blocks: updatedTargetBlocks }
            : lane
        );

        return { success: true, updatedLanes }; // Indicate success and return updated lanes
      }
    } catch (error) {
      console.error("Error moving block:", error);
      return { success: false }; // Indicate failure
    }
  }
);

const swimlaneSlice = createSlice({
  name: "swimlane",
  initialState: {
    lanes: [],
    filter: "",
    status: "idle",
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setLanes: (state, action) => {
      state.lanes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLanes.fulfilled, (state, action) => {
        state.lanes = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchLanes.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(moveBlock.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.lanes = action.payload.updatedLanes; // Update lanes with new state
        }
      });
  },
});

export const selectFilteredLanes = createSelector(
  (state) => state.swimlane.lanes,
  (state) => state.swimlane.filter,
  (lanes = [], filter = "") => {
    if (!Array.isArray(lanes)) return []; // Ensure lanes is always an array
    if (!filter) return lanes;
    const lowerCaseFilter = filter.toLowerCase();

    return lanes.map((lane) => ({
      ...lane,
      blocks: lane.blocks.filter(
        (block) => block.content.toLowerCase().includes(lowerCaseFilter)
      ),
    }));
  }
);

export const { setFilter, setLanes } = swimlaneSlice.actions;
export default swimlaneSlice.reducer;
