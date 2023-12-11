import { configureStore } from "@reduxjs/toolkit";
import UISlice from "./slices/ui-slice";

export const store = configureStore({
  reducer: {
    UI: UISlice,
  },
});
