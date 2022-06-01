import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div className="page-container">
      <h1 className="text-6xl font-bold">Instant Todo List</h1>

      <p className="mt-3 text-2xl">Write something</p>
    </div>
  );
};

export default Home;
