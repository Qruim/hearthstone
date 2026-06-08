import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GoldRootState } from "../../app/storeGold";

export interface CounterState {
    value: number;
}
const initialState: CounterState = {
    value: 150,
};

export const goldSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
        decrementByAmount: (state, action: PayloadAction<number>) => {
            console.log(action.payload);
            state.value -= action.payload;
        },
    },
});

export const { increment, decrement, incrementByAmount, decrementByAmount } = goldSlice.actions;
export const selectCount = (state: GoldRootState) => state.counter.value;

export default goldSlice.reducer;
