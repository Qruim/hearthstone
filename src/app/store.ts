import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/hearstoneCardList/hearstoneCardListSlice";

export const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
});

export type GoldRootState = ReturnType<typeof store.getState>;
export type GoldDispatch = typeof store.dispatch;
export type GoldAppStore = typeof store;
