import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shippingDetails: JSON.parse(localStorage.getItem("shippingDetails")) || null,
};

const shippingSlice = createSlice({
    name: "shipping",
    initialState,
    reducers: {
        saveShippingDetails: (state, action) =>
        {
            state.shippingDetails = action.payload;
            localStorage.setItem("shippingDetails", JSON.stringify(action.payload));
        },
        clearShippingDetails: (state) =>
        {
            state.shippingDetails = null;
            localStorage.removeItem("shippingDetails");
        },
    },
})

export const { saveShippingDetails, clearShippingDetails } = shippingSlice.actions;
export default shippingSlice.reducer;