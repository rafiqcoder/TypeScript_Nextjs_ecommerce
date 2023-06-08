import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface CartItem {
  _id: string;
  name: string;
  imageURL: string;
  price: number;
  quantity: number;
}

interface CardDataProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export default function CardData({ cartItems, setCartItems }: CardDataProps) {
  const vat = 0.18;
  const shippingcost = 0;

  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();

  let deliveryDate = new Date(currentDate);

  // Check if it's Friday, Saturday, or Sunday
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    // Add the remaining days until Monday
    deliveryDate.setDate(currentDate.getDate() + (8 - dayOfWeek));
  } else {
    // Add 1 day to the current date
    deliveryDate.setDate(currentDate.getDate() + 1);
  }

  const deliveryDay = deliveryDate.getDate();
  const deliveryMonth = deliveryDate.getMonth() + 1; //january is 0
  const deliveryYear = deliveryDate.getFullYear();

  const formattedDate = `${deliveryDay}/${deliveryMonth}/${deliveryYear}`;

  // Function to increase quantity
  const increaseQuantity = (_id: string) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === _id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  // Function to decrease quantity
  const decreaseQuantity = (_id: string) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === _id && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  //remove from cart
  const deleteCartItem = (_id: string) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== _id);
    setCartItems(updatedCartItems);
  };

  // Calculate the total price of all items in the cart
  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  // Calculate the total price of all items in the cart
  const [totalcost, setTotalCost] = useState(0.0);
  const calculateTotalPrice = () => {
    let totalPrice = 0;

    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    const shippingCost = totalPrice * 0.1;
    const formattedTotalPrice = totalPrice.toFixed(2);
    setTotalCost(parseFloat(formattedTotalPrice));
  };

  // console.log("cartItems",cartItems)
  return (
    <div>
      <h4 className="lg:text-2xl md:text-xl text-lg font-bold">Cart</h4>

      <div className="px-2 bg-white mt-5 max-h-[500px] overflow-auto md:py-5">
        {cartItems?.length > 0 ? (
          cartItems?.length > 0 &&
          cartItems?.map((data, index) => {
            return (
              <div
                className="grid grid-cols-4 items-center gap-2 bg-white    p-2"
                key={index}
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

                <div className="col-span-2 flex flex-col gap-1">
                  <p className="lg:text-xl text-sm md:text-lg font-bold break-all ">
                    {data?.name}
                  </p>
                  <p className="lg:text-xl text-lg font-bold text-secundary mt-1">
                    ${data?.price}
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="flex gap-2 md:flex-row flex-col items-end md:items-center">
                    <div className="flex flex-row items-center gap-2 bg-primary p-1 md:p-3">
                      <RemoveIcon
                        className="cursor-pointer text-white md:text-base text-sm"
                        onClick={() => {
                          decreaseQuantity(data?._id);
                        }}
                      />

                      <span className="text-white md:text-base text-sm min-w-[20px]">
                        {data?.quantity}
                      </span>
                      <AddIcon
                        className="cursor-pointer text-white md:text-base text-sm"
                        onClick={() => {
                          increaseQuantity(data?._id);
                        }}
                      />
                    </div>
                    <DeleteIcon
                      className="text-red-700 cursor-pointer"
                      onClick={() => {
                        deleteCartItem(data?._id);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col justify-center items-center py-5 lg:py-10">
            <ShoppingBasketIcon className="lg:text-8xl md:text-4xl text-3xl text-center" />
            <p className="text-gray-700 lg:text-3xl md:text-2xl text-xl font-bold">
              Your Cart is empty.
            </p>
            <p className="mt-3 lg:text-2xl md:text-xl text-lg text-gray-700">
              Seems like you haven&apos;t chosen what to buy.
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2 justify-center">
        <LocalShippingIcon className="text-blue-500" />{" "}
        <span>Buy now and get it by {formattedDate}</span>
      </div>

      <div className="mt-5 bg-white p-5">
        <div className="flex justify-between ">
          <p className="w-fit">Products</p> <p>${totalcost}</p>
        </div>
        <div className="flex justify-between bg-warning">
          <p className="w-fit">Shipping Cost</p>
          {}
          <p>${cartItems?.length > 0 ? (totalcost * 0.1).toFixed(2) : 0}</p>
        </div>
        <div className="flex justify-between ">
          <p className="w-fit">Taxes</p>{" "}
          <p>${cartItems?.length > 0 ? (totalcost * vat).toFixed(2) : 0}</p>
        </div>
        <div className="flex justify-between mt-4 ">
          <p className="w-fit font-bold ">Total</p>{" "}
          <p className="text-rose-600">
            $
            {cartItems?.length > 0
              ? (totalcost + totalcost * 0.1).toFixed(2)
              : 0}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {cartItems?.length < 1 ? (
          <div className=" cursor-not-allowed ">
            <Button
            
              variant="contained"
              className="border-2 border-t-2  border-[#DDDDDD] rounded-md text-[#C1C1C1]  w-full lg:py-3 lg:text-xl uppercase shadow-sm hover:bg-gray-100"
            >
              Place&nbsp;Order
            </Button>
          </div>
        ) : (
          <Link href="/confirmation">
            <Button
              variant="contained"
              className="text-black bg-primary hover:bg-orange-600 capitalize w-full lg:py-3 lg:text-xl"
            >
              Place&nbsp;Order
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
