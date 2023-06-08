import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image';


export default function confirmation() {
  return (
    <>
      <Head>
        <title>Confirmation</title>
      </Head>

      <div className="bg-gray-100">
        <div className="container-sk  justify-center items-center min-h-screen flex flex-col gap-4">
        <h1 className="font-bold lg:text-4xl md:text-3xl text-2xl">Thank you</h1>
        <p className="text-gray-700">Your order P0001 has been placed</p>
        <Link href="/" className="text-blue-500">Continue shopping</Link>
        <Image
      placeholder="blur"
      src="/success.png"
      width={500}
      height={500}
      className="p-5"
      alt="Picture of the author"
      blurDataURL="/blur.png"
    />


        </div>
      </div>
    </>
  );
}
