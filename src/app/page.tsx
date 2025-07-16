"use client"

import ProductCreationForm from "@/components/product-creation-form";
import ShopCreationForm from "@/components/shop-creation-form";
import ShopItem from "@/components/shop-item";
import { Card, CardContent } from "@/components/ui/card";
import IShop from "@/interfaces/Shop.interface";
import { useAppSelector } from "@/store";
import { useEffect, useState } from "react";

export default function Home() {
  const [shop, setShop] = useState<IShop | null>(null)
  const shops = useAppSelector(state => state.shops)

  const handleSelectShop = (data: IShop) => {
    setShop(data.id === shop?.id ? null : data)
  }

  return (
    <main className="min-h-screen bg-gray-100 py-20 px-70">
      <div className="grid grid-cols-6 h-full gap-10">
        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            {shops.length > 0 && shops.map((data) => (<ShopItem key={data.id} isSelected={data.id === shop?.id} onSelect={() => handleSelectShop(data)} data={data} />))}
            {shops.length === 0 && <p className="text-foreground text-center">No hay tiendas agregadas</p>}

            <ShopCreationForm />
          </div>
        </div>
        <div className="col-span-4">
          <Card>
            <CardContent className="flex flex-col gap-5">
              {shop && <p className="text-lg text-zinc-500">{shop.name}</p>}
              {!shop && <p className="text-lg text-zinc-500">No hay tienda seleccionada</p>}
              {shop &&
                <>
                  <div className="flex flex-col gap-2">
                    {shop.products.map((data) => (<p key={data.id}>{data.name}</p>))}
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
        </div>
      </div>
    </main>
  );
}
