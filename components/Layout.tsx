import Head from "next/head";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Try out InstantDB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col">{children}</main>

      <footer className="flex p-4 w-full items-center space-x-2 justify-start border-t">
        <span>{"🦶"}</span>
        <span>Oh what a footer</span>
        {/* &copy; Ian Sinnott {new Date().getFullYear()} */}
      </footer>
    </div>
  );
}
