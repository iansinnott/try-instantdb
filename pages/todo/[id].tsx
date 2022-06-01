import React from "react";
import NextError from "next/error";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { transact, useQuery, tx, id as genId } from "instant-local-throwaway";
import { TodoDetailView, useInit } from "../../components/TodoApp";
import { useRouter } from "next/router";
import { Spinner } from "../../components/Loading";

const Page: NextPage = () => {
  const [error, setError] = React.useState<Error | null>(null);
  const router = useRouter();
  const isLoading = useInit();
  const id = router.query.id;
  const q = useQuery({
    posts: {
      $: { where: { id } },
    },
  });

  const post = q.posts[0];

  if (isLoading) {
    return (
      <div className="page-container">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    // @ts-ignore
    return <NextError title={`No post found for ID: ${id}`} statusCode={500} />;
  }

  return (
    <div className="page-container">
      <TodoDetailView todo={post} />
    </div>
  );
};

export default Page;
