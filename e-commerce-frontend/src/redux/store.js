import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "./features/cart/cartSlice";
import shippingReducer from "./features/cart/shippingSlice";

const store = configureStore({
    reducer: {
        "cart": cartSliceReducer,
        "shipping": shippingReducer,
    }
})

export default store