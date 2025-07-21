"use client"

import ProductCreationForm from "@/components/product-creation-form";
import ProductList from "@/components/product-list";
import ShopCreationForm from "@/components/shop-creation-form";
import ShopItem from "@/components/shop-item";
import { Card, CardContent } from "@/components/ui/card";
import IShop from "@/interfaces/Shop.interface";
import { useAppSelector } from "@/store";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [shopId, setShopId] = useState<number | null>(null)
  const shops = useAppSelector(state => state.shops)

  const handleSelectShop = (data: IShop) => {
    setShopId(data.id === shopId ? null : data.id)
    
  }

  return (
    <main className="min-h-screen bg-gray-100 py-20 px-70">
      <div className="grid grid-cols-6 h-full gap-10">
        <div className="col-span-2">
          <div className="flex flex-col gap-2">
            {shops.length > 0 && shops.map((data) => (<ShopItem key={data.id} isSelected={data.id === shopId} onSelect={() => handleSelectShop(data)} data={data} />))}
            {shops.length === 0 && <p className="text-foreground text-center">No hay tiendas agregadas</p>}

            <ShopCreationForm />
          </div>
        </div>
        <div className="col-span-4">
          <ProductList shopId={shopId} />
        </div>
      </div>
    </main>
  );
}
