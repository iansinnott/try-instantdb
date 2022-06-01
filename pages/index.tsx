import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const TodoApp = dynamic(() => import("../components/TodoApp"), { ssr: false });

const Home: NextPage = () => {
  return (
    <div className="page-container">
      <h1 className="text-6xl font-bold">Instant Todo List</h1>
      <TodoApp />
    </div>
  );
};

export default Home;
