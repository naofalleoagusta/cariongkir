import Button from "@ui_palette/Button";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: ongkir, refetch } = trpc.queries.costs.getCosts.useQuery({
    origin: 4609,
    destination: 369,
    weight: 20000,
    h: 10,
    l: 10,
    w: 10,
  });
  console.log(ongkir);
  // const [text,setText]=useState("");
  // const { data, } = trpc.queries.subdistricts.getAll.useQuery({
  //   query: "semarang",
  // });

  // console.log(data);
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <Button
        // onClick={() => {
        //   refetch();
        // }}
        >
          Refetch
        </Button>
      </main>
    </>
  );
};

export default Home;
