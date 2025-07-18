import IProduct from "@/interfaces/Product.interface"
import Image from "next/image"
import React, { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Edit3, Minus, Plus, X } from "lucide-react"

const format = (number: number, options?: Intl.NumberFormatOptions): string => {
    return new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
    }).format(number)
}

const ProductItem: React.FC<{ data: IProduct }> = ({ data }) => {
    const [editable, setEditable] = useState(false)
    return (
        <div
            key={data.id}
            className="group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
        >
            {/* Imagen del producto */}
            <div className="w-16 h-12 relative flex-shrink-0 rounded-md overflow-hidden shadow-sm">
                <Image
                    src={data.image || "/placeholder.svg?height=48&width=64&query=product"}
                    alt={data.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {data.name}
                </h3>
                <p className="text-sm text-blue-600 italic truncate opacity-80">{data.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                    $ {format(data.price)} c/u
                </p>
            </div>

            {/* Controles de cantidad */}
            {editable ? (
                < div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Input type="number" value={data.quantity} />
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { }}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                            ✓
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { }}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        >
                            ✕
                        </Button>
                    </div>
                </div>
            ) : (
                < div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { }}
                            disabled={data.quantity <= 0}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Minus className="w-3 h-3" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { }}
                            className="h-8 px-3 font-medium hover:bg-blue-50 hover:text-blue-600"
                        >
                            {data.quantity}
                            <Edit3 className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Button>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { }}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-green-600 hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Plus className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            )}


            {/* Precio total y eliminar */}
            < div className="flex items-center gap-3" >
                <div className="text-right">
                    <div className="font-semibold text-gray-900">
                        $ {format(data.price * data.quantity)}
                    </div>
                </div>

                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { }}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div >
        </div >
    )
}

export default ProductItem