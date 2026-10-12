import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: { cartItems: [] },
    reducers: {
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
        addToCart: (state, action) => {
            const item = state.cartItems.find(
                x => String(x.sellerproduct_id) === String(action.payload.sellerproduct_id)
            );
            if (item) item.needed_quantity += 1;
            else state.cartItems.push({ ...action.payload, needed_quantity: 1 });
        },
        removeSelectedItems: (state, action) => {
            state.cartItems = state.cartItems.filter(
                item => !action.payload.map(String).includes(String(item.sellerproduct_id))
            );
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
        increaseQuantity: (state, action) => {
            const item = state.cartItems.find(
                x => String(x.sellerproduct_id) === String(action.payload)
            );
            if (item) item.needed_quantity += 1;
        },
        decreaseQuantity: (state, action) => {
            const item = state.cartItems.find(
                x => String(x.sellerproduct_id) === String(action.payload)
            );
            if (item && item.needed_quantity > 1) item.needed_quantity -= 1;
        }
    }
});

export const {
    setCartItems, addToCart, removeSelectedItems,
    clearCart, increaseQuantity, decreaseQuantity
} = cartSlice.actions;

export default cartSlice.reducer; 