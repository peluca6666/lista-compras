import { DialogTitle } from "@radix-ui/react-dialog"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog"
import { FormEventHandler, useEffect, useState } from "react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useAppDispatch, useAppSelector } from "@/store"
import { addProduct } from "@/store/features/shopsSlice"
import IShop from "@/interfaces/Shop.interface"

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
    const dispatch = useAppDispatch()

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()

        if (!form.name || !form.image || !form.description || Number(form.price) < 0 || Number(form.quantity) === 0) {
            alert("Todos los campos son obligatorios")
            return
        }

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
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>Agregar producto</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar producto</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Input type="text" name="name" placeholder="Nombre del producto" value={form.name} onChange={handleChange} />
                    <Input type="text" name="image" placeholder="Imágen del producto (URL)" value={form.image} onChange={handleChange} />
                    <Textarea className="resize-none" name="description" placeholder="Descripción de la tienda" value={form.description} onChange={handleChange}></Textarea>
                    <Input type="text" name="price" placeholder="Precio" value={form.price} onChange={handleChange} />
                    <Input type="text" name="quantity" placeholder="Cantidad" value={form.quantity} onChange={handleChange} />
                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ProductCreationForm