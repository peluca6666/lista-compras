"use client"

import IShop from "@/interfaces/Shop.interface"
import IProduct from "@/interfaces/Product.interface"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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
        },
        updateProductQuantity: (state, { payload }: PayloadAction<{
            shopId: number
            productId: number
            newQuantity: number
        }>) => {
            const shop = state.find((shop) => shop.id === payload.shopId)
            if (shop) {
                const product = shop.products.find(p => p.id === payload.productId)
                if (product) {
                    product.quantity = Math.max(0, payload.newQuantity)
                }
            }
        },
        //Editar producto completo
        updateProduct: (state, { payload }: PayloadAction<{
            shopId: number
            productId: number
            updatedProduct: Partial<IProduct>
        }>) => {
            const shop = state.find((shop) => shop.id === payload.shopId)
            if (shop) {
                const productIndex = shop.products.findIndex(p => p.id === payload.productId)
                if (productIndex !== -1) {
                    shop.products[productIndex] = {
                        ...shop.products[productIndex],
                        ...payload.updatedProduct,
                        id: shop.products[productIndex].id,
                        createdAt: shop.products[productIndex].createdAt
                    }
                }
            }
        },
        removeProduct: (state, { payload }: PayloadAction<{
            shopId: number
            productId: number
        }>) => {
            const shop = state.find((shop) => shop.id === payload.shopId)
            if (shop) {
                shop.products = shop.products.filter(p => p.id !== payload.productId)
            }
        }
    }
})

export const { 
    addShop, 
    addProduct, 
    updateProductQuantity, 
    updateProduct, 
    removeProduct 
} = shopsSlice.actions

export default shopsSlice.reducer