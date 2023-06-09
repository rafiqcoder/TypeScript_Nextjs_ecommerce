import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
interface ProductCardProps {
  data: {
    quantity: number;
    _id: string; 
    imageURL: string;
    name: string;
    price: number;
  };
  addToCart: (id: string, name: string, price: number, image: string) => void;
  cartItems: { [key: string]: any }[];
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;

}

const ProductCard: React.FC<ProductCardProps> = ({
  data,
  addToCart,
  cartItems,
increaseQuantity,
decreaseQuantity }) => {
  const [counterBar, setCounterBar] = React.useState(null);
  const [cartIds, setCartIds] = useState<string[]>([]);
  
useEffect(() => {
  const cartIds = cartItems.map((item) => item._id);
  setCartIds(cartIds);
  console.log("cartIds", cartIds);
}, [cartItems]);

  // console.log("cartItems", cartItems);
  // console.log("data", data);
  // 

  return (
    <div
      className={` ${
        !cartIds.includes(data._id) ? "grid grid-cols-4" : "grid grid-cols-3"
      } items-center gap-2 bg-white mb-2 p-2 relative`}
     
    >
      <Image
        placeholder="blur"
        src={data?.imageURL || `/no.jpg`}
        width={500}
        height={500}
        alt={data?.name}
        blurDataURL="/blur.png"
        className="h-12 w-12 lg:h-24 lg:w-24 object-contain"
      />

      <div className="col-span-2 flex flex-col sm:gap-5">
        <p className=" text-sm md:text-lg ">{data?.name}</p>
        <p className="lg:text-lg text-lg font-bold text-secundary mt-1">
          ${data?.price}
        </p>
      </div>
      {!cartIds.includes(data._id) && (
        <div className="flex justify-end ">
          <IconButton
            className="w-8 h-8 lg:w-12 lg:h-12 bg-primary hover:bg-orange-500 duration-300"
            onClick={() => {
                addToCart(data?._id, data?.name, data?.price, data?.imageURL);
            }}
          >
            <AddIcon className="lg:text-4xl text-white" />
          </IconButton>
        </div>
      )}

      {cartIds.includes(data._id) && (
        <div className="absolute bg-[#fff] bg-opacity-70 w-full h-full ">
          <div className="flex h-full justify-end items-center mr-2">
            <div className="flex gap-2 md:flex-row flex-col items-end md:items-center">
              <div className="flex flex-row items-center gap-2 bg-[#FF8000] p-1 px-3 rounded">
                <RemoveIcon
                  className="cursor-pointer text-white  text-sm md:text-3xl font-bold m-2"
                  onClick={() => {
                    decreaseQuantity(data?._id);
                  }}
                />
                <span className="text-white md:text-base text-sm min-w-[20px] m-2 mx-5  mr-4">
                  {data?.quantity}
                </span>
                <AddIcon
                  className="cursor-pointer text-white md:text-3xl text-sm m-2"
                  onClick={() => {
                    increaseQuantity(data?._id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
