import IProduct from "./Product.interface"

interface IShop {
    id: number
    name: string
    description: string
    image: string

    products: IProduct[]

    createdAt: Date
}

export default IShop