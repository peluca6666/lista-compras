"use client"

import Image from "next/image"
import { Card, CardContent } from "../ui/card"
import IShop from "@/interfaces/Shop.interface"
import { Store, Package, ShoppingCart } from "lucide-react"

interface ShopItemProps {
    data: IShop
    onSelect?: () => void
    isSelected?: boolean
}

const ShopItem: React.FC<ShopItemProps> = ({ data, onSelect = () => {}, isSelected = false }) => {
    const totalProducts = data.products.length
    const totalItems = data.products.reduce((sum, product) => sum + product.quantity, 0)
    const hasProducts = totalProducts > 0

    return (
        <Card 
            onClick={onSelect} 
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                isSelected 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg" 
                    : "bg-white hover:border-blue-200 border-gray-100"
            }`}
        >
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {/* Imagen de la tienda */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <div className={`absolute inset-0 rounded-full ${
                            isSelected ? 'ring-4 ring-white/30' : 'ring-2 ring-gray-100'
                        } transition-all duration-300`}>
                            {data.image ? (
                                <Image 
                                    className="rounded-full object-cover" 
                                    src={data.image} 
                                    alt={data.name} 
                                    fill
                                />
                            ) : (
                                <div className={`w-full h-full rounded-full flex items-center justify-center ${
                                    isSelected 
                                        ? 'bg-white/20' 
                                        : 'bg-gradient-to-br from-blue-100 to-purple-100'
                                }`}>
                                    <Store className={`w-8 h-8 ${
                                        isSelected ? 'text-white' : 'text-blue-500'
                                    }`} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información de la tienda */}
                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-semibold text-lg truncate ${
                                isSelected ? 'text-white' : 'text-gray-900'
                            }`}>
                                {data.name}
                            </h3>
                            {hasProducts && (
                                <div className={`w-2 h-2 rounded-full ${
                                    isSelected ? 'bg-white/60' : 'bg-green-500'
                                } animate-pulse`} />
                            )}
                        </div>
                        
                        <p className={`text-sm truncate ${
                            isSelected ? 'text-white/80' : 'text-gray-600'
                        }`}>
                            {data.description}
                        </p>

                        {/* Estadísticas rápidas */}
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                                <Package className={`w-3 h-3 ${
                                    isSelected ? 'text-white/70' : 'text-gray-400'
                                }`} />
                                <span className={`text-xs ${
                                    isSelected ? 'text-white/70' : 'text-gray-500'
                                }`}>
                                    {totalProducts} {totalProducts === 1 ? 'producto' : 'productos'}
                                </span>
                            </div>
                            
                            {hasProducts && (
                                <div className="flex items-center gap-1">
                                    <ShoppingCart className={`w-3 h-3 ${
                                        isSelected ? 'text-white/70' : 'text-gray-400'
                                    }`} />
                                    <span className={`text-xs ${
                                        isSelected ? 'text-white/70' : 'text-gray-500'
                                    }`}>
                                        {totalItems} unidades
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Indicador visual de selección */}
                    <div className={`w-1 h-8 rounded-full transition-all duration-300 ${
                        isSelected 
                            ? 'bg-white/50' 
                            : 'bg-transparent group-hover:bg-blue-200'
                    }`} />
                </div>

                {/* Barra de progreso sutil */}
                <div className={`h-0.5 mt-3 rounded-full transition-all duration-500 ${
                    isSelected 
                        ? 'bg-white/30' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100'
                }`} />
            </CardContent>
        </Card>
    )
}

export default ShopItem