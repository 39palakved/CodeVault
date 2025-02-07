import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "./Redux/noteSlice.js";  // Import the noteReducer from your slice

const store = configureStore({
  reducer: {
    note: noteReducer,  // Assign noteReducer to manage the 'note' state
  },
});

export { store };  // Export the store to use it in your app
