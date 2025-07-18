import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import IShop from "@/interfaces/Shop.interface"
import { useAppSelector } from "@/store"
import ProductCreationForm from "../product-creation-form"
import ProductItem from "../product-item"

const ProductList: React.FC<{ shopId: number | null }> = ({ shopId }) => {
    const [shop, setShop] = useState<IShop | null>(null)
    const shops = useAppSelector(state => state.shops)

    useEffect(() => {
        const foundShop = shops.find((data) => data.id === shopId)
        setShop(foundShop || null)
    }, [shops, shopId])

    return (
        <Card>
            <CardContent className="flex flex-col gap-5">
                {shop && <p className="text-lg text-zinc-500">{shop.name}</p>}
                {!shop && <p className="text-lg text-zinc-500">No hay tienda seleccionada</p>}
                {shop &&
                    <>
                        <div className="flex flex-col gap-2">
                            {shop.products.map((data) => (<ProductItem key={data.id} data={data} />))}
                        </div>
                        <ProductCreationForm shop={shop} />
                        <div className="flex justify-between items-center">
                            <p>Cantidad total {shop.products.reduce((total, product) => total + product.quantity, 0)}</p>
                            <p>Cantidad total {shop.products.reduce((total, product) => total + (product.price * product.quantity), 0)}</p>
                        </div>
                    </>
                }
            </CardContent>
        </Card>
    )
}

export default ProductList