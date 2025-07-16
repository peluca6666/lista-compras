"use client"

import { FormEventHandler, useState } from "react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { useAppDispatch, useAppSelector } from "@/store"
import { addShop } from "@/store/features/shopsSlice"

const initialForm = {
    name: "",
    description: "",
    image: ""
}

const ShopCreationForm = () => {
    const shops = useAppSelector(state => state.shops)

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

        if (!form.name || !form.image || !form.description) {
            alert("Todos los campos son obligatorios")
            return
        }

        dispatch(addShop({
            ...form,
            id: (shops[shops.length - 1]?.id || 0) + 1,
            createdAt: new Date(),
            products: []
        }))

        setForm(initialForm)
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>Agregar tienda</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar tienda</DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <Input type="text" name="name" placeholder="Nombre de la tienda" value={form.name} onChange={handleChange} />
                    <Input type="text" name="image" placeholder="Imágen de la tienda (URL)" value={form.image} onChange={handleChange} />
                    <Textarea className="resize-none" name="description" placeholder="Descripción de la tienda" value={form.description} onChange={handleChange}></Textarea>
                    <Button type="submit">Guardar</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ShopCreationForm