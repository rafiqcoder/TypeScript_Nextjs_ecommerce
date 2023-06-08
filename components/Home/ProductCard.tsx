import React from "react";
import Image from "next/image";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ProductCardProps {
  data: {
    _id: string; 
    imageURL: string;
    name: string;
    price: number;
  };
  addToCart: (id: string, name: string, price: number,image:string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ data, addToCart }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-2 bg-white   p-2">
      <Image
        placeholder="blur"
        src={data?.imageURL || "/no.jpg"}
        width={500}
        height={500}
        alt={data?.name}
        blurDataURL="/blur.png"
        className="h-12 w-12 lg:h-24 lg:w-24 object-contain"
      />

      <div className="flex flex-col gap-1 col-span-2">
        <p className="lg:text-xl text-lg font-bold">{data?.name}</p>
        <p className="lg:text-xl text-lg font-bold text-secundary mt-1">
          ${data?.price}
        </p>
      </div>
      <div className="flex justify-end ">
        <IconButton
          className="w-8 h-8 lg:w-16 lg:h-16 bg-primary hover:bg-orange-500 duration-300"
          onClick={() => addToCart(data._id, data?.name, data?.price,data?.imageURL)}
        >
          <AddIcon className="lg:text-4xl text-white" />
        </IconButton>
      </div>
    </div>
  );
};

export default ProductCard;
