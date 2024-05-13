"use client";

import Image from "next/image";
import { Prisma } from "@prisma/client";
import DiscountBadge from "@/app/_components/discount-badge";
import {
  formatCurrency,
  calculateProductTotalPrice,
} from "@/app/_lib/_helpers/price";
import { Button } from "@/app/_components/ui/button";
import {
  BikeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TimerIcon,
} from "lucide-react";
import { useState } from "react";
import { Card } from "@/app/_components/ui/card";
import ProductList from "@/app/_components/product-list";

interface ProductDetailsPropos {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>;
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true;
    };
  }>[];
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsPropos) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantityClick = () => setQuantity((curr) => curr + 1);
  const handleDecreaseQuantityClick = () =>
    setQuantity((curr) => {
      if (curr === 1) return 1;

      return curr - 1;
    });

  return (
    <div className="py-5">
      {/* Restaurante */}
      <div className="flex items-center gap-[0.375rem] px-5">
        <div className="relative h-6 w-6">
          <Image
            src={product.restaurant.imageUrl}
            alt={product.restaurant.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {product.restaurant.name}
        </span>
      </div>

      {/* Nome do Produto */}
      <h1 className="mb-3 mt-1 px-5 text-xl font-semibold">{product.name}</h1>

      {/* Preço do produto e QUantidade */}
      <div className="flex justify-between gap-2 px-5">
        {/* Preço */}
        <div>
          {/* Preço com desconto */}
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-semibold">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h2>
            {product.discountPercentage > 0 && (
              <DiscountBadge product={product} />
            )}
          </div>
          {/* Preço Original */}
          <p className="text-sm text-muted-foreground">
            De: {formatCurrency(Number(product.price))}
          </p>
        </div>
        {/* Quantidade */}
        <div className="flex items-center gap-3 text-center">
          <Button
            size="icon"
            variant="ghost"
            className="border border-solid border-muted-foreground"
            onClick={handleDecreaseQuantityClick}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="w-4">{quantity}</span>
          <Button size="icon" onClick={handleIncreaseQuantityClick}>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      {/* Dados Entrega */}
      <div className="px-5">
        <Card className="mt-6 flex justify-around py-3">
          {/* Taxa de entrega */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Taxa de Entrega</span>
              <BikeIcon size={14} />
            </div>

            {Number(product.restaurant.deliveryFee) != 0 ? (
              <p className="text-xs font-semibold">
                {formatCurrency(Number(product.restaurant.deliveryFee))}
              </p>
            ) : (
              <p className="text-xs font-semibold">Grátis</p>
            )}
          </div>

          {/* Tempo de Entrega */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="text-xs">Tempo de Entrega</span>
              <TimerIcon size={14} />
            </div>
            <p className="flex gap-1 text-xs font-semibold">
              {product.restaurant.deliveryTimeMinutes}
              minutos
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 space-y-3 px-5">
        <h3 className="font-semibold">Sobre</h3>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>

      <div className="mt-6 space-y-3">
        <h3 className="px-5 font-semibold">Sucos</h3>
        <ProductList products={complementaryProducts} />
      </div>
    </div>
  );
};

export default ProductDetails;
