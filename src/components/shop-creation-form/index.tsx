"use client"

import { FormEventHandler, useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useAppDispatch, useAppSelector } from "@/store"
import { addShop } from "@/store/features/shopsSlice"
import { Plus, Store, Image as ImageIcon, FileText, Loader2, AlertCircle } from "lucide-react"

const initialForm = {
    name: "",
    description: "",
    image: ""
}

const ShopCreationForm = () => {
    const shops = useAppSelector(state => state.shops)
    const [isOpen, setIsOpen] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const dispatch = useAppDispatch()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (!form.name.trim()) {
            newErrors.name = "El nombre es obligatorio"
        } else if (form.name.length < 2) {
            newErrors.name = "El nombre debe tener al menos 2 caracteres"
        }
        
        if (!form.description.trim()) {
            newErrors.description = "La descripción es obligatoria"
        } else if (form.description.length < 10) {
            newErrors.description = "La descripción debe tener al menos 10 caracteres"
        }
        
        if (!form.image.trim()) {
            newErrors.image = "La imagen es obligatoria"
        } else if (!isValidUrl(form.image)) {
            newErrors.image = "Debe ser una URL válida"
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

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        const { name, value } = event.target
        setForm(prev => ({ ...prev, [name]: value }))
        
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
            // Simular delay de API de 500ms para mostrar el loader
            await new Promise(resolve => setTimeout(resolve, 500))
            
            dispatch(addShop({
                ...form,
                id: (shops[shops.length - 1]?.id || 0) + 1,
                createdAt: new Date(),
                products: []
            }))

            setForm(initialForm)
            setErrors({})
            setIsOpen(false)
        } catch (error) {
            console.error("Error al crear tienda:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setForm(initialForm)
        setErrors({})
        setIsSubmitting(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button 
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Tienda
                </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Crear Nueva Tienda</DialogTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Completa la información para agregar una nueva tienda
                            </p>
                        </div>
                    </div>
                </DialogHeader>
                
                <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                    {/* Campo Nombre */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Store className="w-4 h-4" />
                            Nombre de la tienda
                        </label>
                        <Input 
                            type="text" 
                            name="name" 
                            placeholder="Ej: Supermercado Central" 
                            value={form.name} 
                            onChange={handleChange}
                            className={`transition-colors ${errors.name ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
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
                            Imagen de la tienda
                        </label>
                        <Input 
                            type="url" 
                            name="image" 
                            placeholder="https://ejemplo.com/imagen.jpg" 
                            value={form.image} 
                            onChange={handleChange}
                            className={`transition-colors ${errors.image ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
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
                            placeholder="Describe la tienda, productos que vende, ubicación, etc." 
                            value={form.description} 
                            onChange={handleChange}
                            className={`resize-none min-h-[80px] transition-colors ${errors.description ? 'border-red-300 focus:border-red-500' : 'focus:border-blue-500'}`}
                            disabled={isSubmitting}
                        />
                        <div className="flex justify-between items-center">
                            {errors.description ? (
                                <p className="text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.description}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    Mínimo 10 caracteres
                                </p>
                            )}
                            <p className="text-xs text-gray-400">
                                {form.description.length}/200
                            </p>
                        </div>
                    </div>

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
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Crear Tienda
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ShopCreationForm