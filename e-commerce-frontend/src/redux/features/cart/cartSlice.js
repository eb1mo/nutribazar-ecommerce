import { createSlice } from "@reduxjs/toolkit";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const storedCartItems = userInfo && userInfo.id
    ? JSON.parse(localStorage.getItem(`cartItems`)) || []
    : [];

const initialState = {
    cartItems: storedCartItems,
    cartTotalQuantity: 0,
    cartTotalAmount: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) =>
        {
            const itemExist = state.cartItems.find((item) => item._id === action.payload._id && item.name === action.payload.name);
            if (itemExist)
            {
                // Increment quantity of the existing item
                itemExist.quantity += 1;
            } else
            {
                // Add the new item with quantity 1
                state.cartItems.push({ ...action.payload, quantity: 1 });
            }

            // Save the updated cart to localStorage
            if (userInfo && userInfo.id)
            {
                localStorage.setItem(`cartItems`, JSON.stringify(state.cartItems));
            }
        },

        increasedQuantity: (state, action) =>
        {
            const item = state.cartItems.find((cartItem) => cartItem._id === action.payload);
            // console.log(action.payload)
            if (item)
            {
                item.quantity += 1;
            }
            localStorage.setItem(`cartItems`, JSON.stringify(state.cartItems));
        },
        decreasedQuantity: (state, action) =>
        {
            const item = state.cartItems.find((cartItem) => cartItem._id === action.payload);
            // console.log(action.payload)

            if (item)
            {
                item.quantity -= 1;
                if (item.quantity === 0)
                {
                    // const itemQTY = state.cartItems.find((cartItem) => cartItem.id === action.payload);
                    state.cartItems.splice(state.cartItems.indexOf(item), 1);
                }
            }

            localStorage.setItem(`cartItems`, JSON.stringify(state.cartItems));
        },
        resetCart: (state) =>
        {
            // Clear the cart
            state.cartItems = [];

            // Remove cart items from localStorage
            if (userInfo && userInfo.id)
            {
                localStorage.removeItem(`cartItems`);
            }
        },
    },
});


export const { addToCart, removeFromCart, resetCart, increasedQuantity, decreasedQuantity } = cartSlice.actions;

export default cartSlice.reducer;
