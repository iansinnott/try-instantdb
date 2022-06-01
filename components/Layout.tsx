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

      <footer className="flex w-full items-center justify-between border-t p-4">
        <div className="flex space-x-2 ">
          <span>{"🦶"}</span>
          <span>Oh what a footer</span>
        </div>
        <div>
          <a className="text-blue-600 underline" href="https://github.com/iansinnott/try-instantdb">
            Source Code
          </a>
        </div>
      </footer>
    </div>
  );
}
