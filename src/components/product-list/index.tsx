"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import IShop from "@/interfaces/Shop.interface"
import { useAppSelector } from "@/store"
import ProductCreationForm from "../product-creation-form"
import ProductItem from "../product-item"
import { Store, Package, ShoppingCart, DollarSign } from "lucide-react"

const format = (number: number): string => {
    return new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(number)
}

const ProductList: React.FC<{ shopId: number | null }> = ({ shopId }) => {
    const [shop, setShop] = useState<IShop | null>(null)
    const shops = useAppSelector(state => state.shops)

    useEffect(() => {
        const foundShop = shops.find((data) => data.id === shopId)
        setShop(foundShop || null)
    }, [shops, shopId])

    if (!shop) {
        return (
            <Card className="h-full">
                <CardContent className="flex flex-col items-center justify-center h-[500px] text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <Store className="w-10 h-10 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900">Selecciona una tienda</h3>
                        <p className="text-gray-500 max-w-md">
                            Elige una tienda del panel izquierdo para gestionar sus productos y ver el inventario
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const totalQuantity = shop.products.reduce((total, product) => total + product.quantity, 0)
    const totalValue = shop.products.reduce((total, product) => total + (product.price * product.quantity), 0)
    const productsCount = shop.products.length

    return (
        <div className="space-y-6">
            {/* Header de la tienda */}
            <Card>
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Store className="w-6 h-6 text-blue-500" />
                                {shop.name}
                            </h2>
                            <p className="text-gray-600">{shop.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium">
    {productsCount} {productsCount === 1 ? 'producto' : 'productos'}
</span>
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-700">{totalQuantity}</p>
                                    <p className="text-sm text-blue-600">Unidades totales</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-700">${format(totalValue)}</p>
                                    <p className="text-sm text-green-600">Valor total</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Lista de productos */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Productos
                        </h3>
                        <ProductCreationForm shop={shop} />
                    </div>
                </CardHeader>
                <CardContent>
                    {shop.products.length > 0 ? (
                        <div className="space-y-3">
                            {shop.products.map((product) => (
                                <ProductItem 
                                    key={product.id} 
                                    data={product} 
                                    shopId={shop.id} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-medium text-gray-900">No hay productos</h4>
                                <p className="text-gray-500">
                                    Agrega tu primer producto para comenzar a gestionar el inventario
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductList