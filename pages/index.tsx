import { Container, TextField } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { KeyboardEvent, useEffect, useState } from "react";
import CardData from "../components/Home/CardData";
import ProductCard from "../components/Home/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageURL: string; // Add the 'imageURL' property here
}
interface CartItem extends Product {
  quantity: number;
}

interface IndexProps {
  products: Product[];
}

export default function Index({ products }: IndexProps): JSX.Element {
  const [searchTerm, setSearchTerm] = useState("");
  const [mixProducts, setMixProducts] = useState(products);
  const [searchResults, setSearchResults] = useState<Product[]>(mixProducts);
const [refresh, setRefresh] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  console.log("searchTerm", searchTerm);

  //pushing cart items to the mixProducts array

  const notIncluededInCart = mixProducts.filter((product) => {
    const exist = cartItems.find((item) => item._id === product._id);
    return !exist;
  });

  useEffect(() => {
    setMixProducts([...cartItems, ...notIncluededInCart ]);
    //new array of cart ids
    console.log(mixProducts);
    setSearchResults(mixProducts);
  }, [cartItems, refresh]);
  
  console.log("cartItems", cartItems);

  const handleSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") {
      setSearchResults(mixProducts);
      return;
    } else if (searchTerm.length < 3 && e.key === "Enter") {
      setSearchResults(mixProducts);
      return;
    } else {
      const filteredResults = mixProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filteredResults);
    }
  };

  const addToCart = (
    _id: string,
    name: string,
    price: number,
    image: string
  ) => {
    const existingItem = cartItems.find((item) => item._id === _id);
    if (existingItem) {
      const updatedItems = cartItems.map((item) =>
        item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedItems);
      setRefresh(!refresh);
    } else {
      const newItem: CartItem = {
        _id,
        name,
        price,
        quantity: 1,
        imageURL: image, // Provide the imageURL here
      };
      setCartItems([...cartItems, newItem]);
      setRefresh(!refresh);
    }
      setRefresh(!refresh);
  };

  //do infinite scroll
  const [visibleItems, setVisibleItems] = useState(5);
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (scrollTop + clientHeight === scrollHeight) {
      // User has scrolled to the bottom
      setScrollPosition(scrollTop);
      setVisibleItems((prevVisibleItems) => prevVisibleItems + 5);
    }
  };

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
    setRefresh(!refresh);
  };
  console.log("cartItems", cartItems);

  // Function to decrease quantity
  const decreaseQuantity = (_id: string) => {
    
    const exist = cartItems.find((item) => item._id === _id);
    if (exist && exist.quantity > 1) {
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === _id && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        // if (item._id === _id && item.quantity ===1 ) {
        //   return item._id !== _id;
        // }
        setRefresh(!refresh);
        return item;
      });
      setCartItems(updatedCartItems);
      setRefresh(!refresh);
    } else {
      const updatedCartItems = cartItems.filter((item) => item._id !== _id);
      setCartItems(updatedCartItems);
      setRefresh(!refresh);
    }
    setRefresh(!refresh);
  };

  console.log("searchResults", searchResults);

  return (
    <>
      <Head>
        <title>Buy Products</title>
      </Head>

      <div className="bg-[#F7F7F9] ">
        <Container className="container max-w-[1024px] mx-auto min-h-screen flex justify-center items-center">
          <div className="grid md:grid-cols-2 gap-4 lg:gap-16 grid-cols-1 lg:p-20 md:p-10 p-5 bg-[#F7F7F9] w-full">
            <div className="">
              <h1 className="lg:text-2xl md:text-xl text-lg font-bold">
                Products
              </h1>

              <TextField
                className="bg-white mt-2"
                size="small"
                fullWidth
                placeholder="search here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => handleSearch(e)}
              ></TextField>

              <div
                className="mt-5 flex flex-col gap-4 max-h-[500px] overflow-auto"
                onScroll={handleScroll}
              >
                {searchResults?.slice(0, visibleItems).map((data) => (
                  <div className="" key={data._id}>
                    <ProductCard
                      data={data}
                      addToCart={addToCart}
                      cartItems={cartItems}
                      refresh={setRefresh}
                      increaseQuantity={increaseQuantity}
                      decreaseQuantity={decreaseQuantity}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="">
              <CardData
                cartItems={cartItems}
                setCartItems={setCartItems}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const apiUrl = process.env.API_URL || "";

  try {
    if (!apiUrl) {
      throw new Error("API_URL is not set");
    }

    const response = await axios.get(apiUrl);
    const data = response?.data?.products;

    return {
      props: {
        products: data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        products: [],
      },
    };
  }
}
