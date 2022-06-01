import classNames from "classnames";
import { faker } from "@faker-js/faker";

import { transact, useInit, useQuery, tx, id } from "instant-local-throwaway";
import { title } from "process";

interface ITodo {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  body?: string;
}

type IPayload = Partial<ITodo>;

function upsertTodo(payload: IPayload) {
  const data: ITodo = {
    ...payload,
    id: payload.id || id(),
    title: payload.title || "Untitled",
    createdAt: payload.createdAt || new Date(),
    updatedAt: payload.updatedAt || payload.createdAt || new Date(),
  };

  const comment = { id: id(), body: faker.company.bs() };
  const post = tx.posts[data.id];
  console.log(post);
  transact([
    post.update(data),
    tx.comments[comment.id].update(comment),
    post.link({ comments: comment.id }),
  ]);
  console.log("saved!");
}

function removeTodos(xs: ITodo[]) {
  const models = xs.map((x) => tx.posts[x.id]);
  transact(models.map((x) => x.delete()));
}

function Main() {
  const q = useQuery({
    posts: {
      $: {
        orderBy: { createdAt: "asc" },
        limit: 2,
        offset: 0,
      },
    },
  });
  const posts = q.posts as ITodo[];

  return (
    <div data-test-id="" className="">
      <div data-test-id="Controls" className="flex items-center justify-start space-x-4 mt-4">
        <button
          className="btn"
          onClick={() => {
            upsertTodo({ title: faker.company.bs() });
          }}>
          add a post
        </button>
        <button
          className="btn bg-gray-200 hover:bg-red-400"
          onClick={() => {
            removeTodos(posts);
          }}>
          clear
        </button>
      </div>
      <pre className="font-mono text-sm p-2 mt-8 bg-gray-100 border border-gray-200 rounded">
        {JSON.stringify(posts, null, 2)}
      </pre>
    </div>
  );
}

type ITodoApp = React.ComponentProps<"div">;
const TodoApp = ({ className, ...props }: ITodoApp) => {
  const isLoading = useInit({ token: "28848c49-c2c3-499d-b9af-7c1fd396613d" });
  return (
    <div {...props} data-cy="TodoApp" className={classNames("", className)}>
      {isLoading ? <div>Loading ...</div> : <Main />}
    </div>
  );
};

export default TodoApp;
