import { createSlice } from "@reduxjs/toolkit";

const requestReducer = createSlice({
  name: "request",
  initialState: null,
  reducers: {
    addRequest: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      //remove the clicked item from list
      const newRequests = state.filter((r) => r._id !== action.payload);
      return newRequests;
    },
  },
});

export const { addRequest, removeRequest } = requestReducer.actions;

export default requestReducer.reducer;
