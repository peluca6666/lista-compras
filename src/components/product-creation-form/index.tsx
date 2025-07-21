"use client"

import { DialogTitle } from "@radix-ui/react-dialog"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog"
import { FormEventHandler, useState } from "react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useAppDispatch } from "@/store"
import { addProduct } from "@/store/features/shopsSlice"
import IShop from "@/interfaces/Shop.interface"
import { Plus, Package, Image as ImageIcon, FileText, DollarSign, Hash, Loader2, AlertCircle } from "lucide-react"

const initialForm = {
    name: "",
    description: "",
    image: "",
    price: "",
    quantity: "",
}

const ProductCreationForm: React.FC<{ shop: IShop }> = ({ shop }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const dispatch = useAppDispatch()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        // Validar nombre
        if (!form.name.trim()) {
            newErrors.name = "El nombre es obligatorio"
        } else if (form.name.length < 2) {
            newErrors.name = "El nombre debe tener al menos 2 caracteres"
        }
        
        // Validar descripción
        if (!form.description.trim()) {
            newErrors.description = "La descripción es obligatoria"
        } else if (form.description.length < 5) {
            newErrors.description = "La descripción debe tener al menos 5 caracteres"
        }
        
        // Validar imagen
        if (!form.image.trim()) {
            newErrors.image = "La imagen es obligatoria"
        } else if (!isValidUrl(form.image)) {
            newErrors.image = "Debe ser una URL válida"
        }
        
        // Validar precio
        const price = Number(form.price)
        if (!form.price) {
            newErrors.price = "El precio es obligatorio"
        } else if (isNaN(price) || price < 0) {
            newErrors.price = "El precio debe ser un número positivo"
        } else if (price === 0) {
            newErrors.price = "El precio debe ser mayor a 0"
        }
        
        // Validar cantidad
        const quantity = Number(form.quantity)
        if (!form.quantity) {
            newErrors.quantity = "La cantidad es obligatoria"
        } else if (isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
            newErrors.quantity = "La cantidad debe ser un número entero positivo"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValidUrl = (string: string) => {
        try {
            new URL(string)
            return true
        } catch (_) {
            return false
        }
    }

    const formatPrice = (value: string) => {
        // Solo permitir números y punto decimal
        const cleaned = value.replace(/[^\d.]/g, '')
        const parts = cleaned.split('.')
        if (parts.length > 2) {
            return parts[0] + '.' + parts.slice(1).join('')
        }
        return cleaned
    }

    const formatQuantity = (value: string) => {
        // Solo permitir números enteros
        return value.replace(/[^\d]/g, '')
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        const { name, value } = event.target
        let formattedValue = value

        // Formatear valores específicos
        if (name === 'price') {
            formattedValue = formatPrice(value)
        } else if (name === 'quantity') {
            formattedValue = formatQuantity(value)
        }

        setForm(prev => ({ ...prev, [name]: formattedValue }))
        
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }))
        }
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        
        if (!validateForm()) return
        
        setIsSubmitting(true)
        
        try {
            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 500))
            
            dispatch(addProduct({
                shopId: shop.id,
                product: {
                    ...form,
                    id: (shop.products[shop.products.length - 1]?.id || 0) + 1,
                    price: Number(form.price),
                    quantity: Number(form.quantity),
                    createdAt: new Date()
                }
            }))

            setForm(initialForm)
            setErrors({})
            setIsOpen(false)
        } catch (error) {
            console.error("Error al crear producto:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setForm(initialForm)
        setErrors({})
        setIsSubmitting(false)
    }

    const previewPrice = form.price ? `$${Number(form.price).toLocaleString('es-AR')}` : ""

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className="border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Producto
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Nuevo Producto</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Agregar producto a <span className="font-medium text-blue-600">{shop.name}</span>
                            </p>
                        </div>
                    </div>
                </DialogHeader>
                
                <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                    {/* Campo Nombre */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Nombre del producto
                        </label>
                        <Input 
                            type="text" 
                            name="name" 
                            placeholder="Ej: Leche Entera 1L" 
                            value={form.name} 
                            onChange={handleChange}
                            className={`transition-colors ${errors.name ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'}`}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Campo Imagen */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" />
                            Imagen del producto
                        </label>
                        <Input 
                            type="url" 
                            name="image" 
                            placeholder="https://ejemplo.com/producto.jpg" 
                            value={form.image} 
                            onChange={handleChange}
                            className={`transition-colors ${errors.image ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'}`}
                            disabled={isSubmitting}
                        />
                        {errors.image && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.image}
                            </p>
                        )}
                        {form.image && !errors.image && (
                            <p className="text-xs text-green-600">✓ URL válida</p>
                        )}
                    </div>

                    {/* Campo Descripción */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Descripción
                        </label>
                        <Textarea 
                            name="description" 
                            placeholder="Describe el producto, marca, características, etc." 
                            value={form.description} 
                            onChange={handleChange}
                            className={`resize-none min-h-[60px] transition-colors ${errors.description ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'}`}
                            disabled={isSubmitting}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Campos Precio y Cantidad */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Campo Precio */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Precio
                            </label>
                            <Input 
                                type="text" 
                                name="price" 
                                placeholder="0.00" 
                                value={form.price} 
                                onChange={handleChange}
                                className={`transition-colors ${errors.price ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'}`}
                                disabled={isSubmitting}
                            />
                            {previewPrice && !errors.price && (
                                <p className="text-xs text-green-600">{previewPrice}</p>
                            )}
                            {errors.price && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        {/* Campo Cantidad */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Hash className="w-4 h-4" />
                                Cantidad
                            </label>
                            <Input 
                                type="text" 
                                name="quantity" 
                                placeholder="0" 
                                value={form.quantity} 
                                onChange={handleChange}
                                className={`transition-colors ${errors.quantity ? 'border-red-300 focus:border-red-500' : 'focus:border-green-500'}`}
                                disabled={isSubmitting}
                            />
                            {errors.quantity && (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.quantity}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Preview del total */}
                    {form.price && form.quantity && !errors.price && !errors.quantity && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-600">Valor total del stock:</p>
                            <p className="text-lg font-semibold text-green-600">
                                ${(Number(form.price) * Number(form.quantity)).toLocaleString('es-AR')}
                            </p>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsOpen(false)}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Producto
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ProductCreationForm