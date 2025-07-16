"use client"

import IShop from "@/interfaces/Shop.interface"
import { createSlice } from "@reduxjs/toolkit"

const initialState: IShop[] = []

const shopsSlice = createSlice({
    name: "shops",
    initialState,
    reducers: {
        addShop: (state, { payload }) => {
            state.push(payload)
        },
        addProduct: (state, { payload }) => {
            const shop = state.find((shop) => shop.id === payload.shopId)
            
            if (shop) {
                shop.products.push(payload.product)
            }
        }
    }
})

export const { addShop, addProduct } = shopsSlice.actions
export default shopsSlice.reducer