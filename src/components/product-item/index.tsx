"use client"

import IProduct from "@/interfaces/Product.interface"
import Image from "next/image"
import React, { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Edit3, Minus, Plus, X, Package } from "lucide-react"
import { useAppDispatch } from "@/store"
import { updateProductQuantity, removeProduct } from "@/store/features/shopsSlice"

const format = (number: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
    }).format(number)
}

interface ProductItemProps {
    data: IProduct
    shopId: number
}

const ProductItem: React.FC<ProductItemProps> = ({ data, shopId }) => {
    const dispatch = useAppDispatch()
    const [editable, setEditable] = useState(false)
    const [tempQuantity, setTempQuantity] = useState(data.quantity.toString())

    const handleIncrement = () => {
        dispatch(updateProductQuantity({
            shopId,
            productId: data.id,
            newQuantity: data.quantity + 1
        }))
    }

    const handleDecrement = () => {
        if (data.quantity > 0) {
            dispatch(updateProductQuantity({
                shopId,
                productId: data.id,
                newQuantity: data.quantity - 1
            }))
        }
    }

    const handleEditClick = () => {
        setEditable(true)
        setTempQuantity(data.quantity.toString())
    }

    const handleConfirmEdit = () => {
        const newQuantity = parseInt(tempQuantity)
        if (!isNaN(newQuantity) && newQuantity >= 0) {
            dispatch(updateProductQuantity({
                shopId,
                productId: data.id,
                newQuantity
            }))
        }
        setEditable(false)
    }

    const handleCancelEdit = () => {
        setEditable(false)
        setTempQuantity(data.quantity.toString())
    }

    const handleRemove = () => {
        if (window.confirm(`¿Estás seguro de eliminar "${data.name}"?`)) {
            dispatch(removeProduct({
                shopId,
                productId: data.id
            }))
        }
    }

    const isOutOfStock = data.quantity === 0

    return (
        <div className="group relative bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Badge de stock */}
            {isOutOfStock && (
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Sin stock
                </div>
            )}

            <div className="flex items-center gap-4 p-4">
                {/* Imagen mejorada */}
                <div className="relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                    {data.image ? (
                        <Image
                            src={data.image}
                            alt={data.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Información del producto */}
                <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {data.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate leading-relaxed">
                        {data.description}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600">
                            ${format(data.price)}
                        </span>
                        <span className="text-xs text-gray-400">por unidad</span>
                    </div>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-3">
                    {editable ? (
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <Input 
                                type="number" 
                                value={tempQuantity}
                                onChange={(e) => setTempQuantity(e.target.value)}
                                className="w-16 h-8 text-center border-0 bg-white shadow-sm"
                                min="0"
                                autoFocus
                            />
                            <Button
                                size="sm"
                                onClick={handleConfirmEdit}
                                className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600 text-white"
                            >
                                ✓
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className="h-8 w-8 p-0 hover:bg-gray-200"
                            >
                                ✕
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleDecrement}
                                disabled={data.quantity <= 0}
                                className="h-10 w-10 rounded-none hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleEditClick}
                                className="h-10 px-4 rounded-none font-semibold hover:bg-blue-50 hover:text-blue-600 border-x border-gray-200"
                            >
                                {data.quantity}
                                <Edit3 className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Button>

                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleIncrement}
                                className="h-10 w-10 rounded-none hover:bg-green-50 hover:text-green-600"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Precio total */}
                <div className="text-right min-w-[80px]">
                    <div className="text-lg font-bold text-gray-900">
                        ${format(data.price * data.quantity)}
                    </div>
                    <div className="text-xs text-gray-500">
                        total
                    </div>
                </div>

                {/* Botón eliminar */}
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleRemove}
                    className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {/* Línea de progreso visual (opcional) */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    )
}

export default ProductItem