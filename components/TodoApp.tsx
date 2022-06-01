import classNames from "classnames";
import { faker } from "@faker-js/faker";

import { transact, useInit, useQuery, tx, id } from "instant-local-throwaway";
import { title } from "process";
import Link from "next/link";

enum Status {
  pending = "pending",
  complete = "complete",
  cancelled = "cancelled",
}

interface ITodo {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  body?: string;
  status: Status;
}

type IPayload = Partial<ITodo>;

function upsertTodo(payload: IPayload) {
  const now = new Date();

  const defaults = {
    status: Status.pending,
    title: "Untitled",
    createdAt: now,
    updatedAt: now,
  };

  const data: ITodo = {
    ...defaults,
    ...payload,
    id: payload.id || id(),
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

interface IDataDumper extends React.ComponentProps<"pre"> {
  data: any;
}
export const DataDumper = ({ className, data, ...props }: IDataDumper) => {
  return (
    <pre
      {...props}
      data-test-id="DataDumper"
      className={classNames(
        "font-mono text-sm p-2 mt-8 bg-gray-100 border border-gray-200 rounded",
        className,
      )}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};

interface ITodoList extends React.ComponentProps<"div"> {}
export const TodoList = ({ className, ...props }: ITodoList) => {
  const q = useQuery({
    posts: {},
  });
  const posts = q.posts as ITodo[];
  return (
    <div {...props} data-test-id="TodoList" className={classNames("", className)}>
      {posts.map((x) => {
        return (
          <div className="flex items-center first:border-t border-b  border-zinc-200" key={x.id}>
            <div className="block flex-shrink-0 flex-grow-0 p-2 bg-gray-200">
              <input
                className=""
                type="checkbox"
                checked={x.status === Status.complete}
                onChange={(e) => {
                  transact([
                    tx.posts[x.id].update({
                      status: e.target.checked ? Status.complete : Status.pending,
                    }),
                  ]);
                }}
              />
            </div>
            <Link href={`/todo/${x.id}`}>
              <a
                className={classNames("block px-2", {
                  "line-through opacity-60": x.status === Status.complete,
                })}>
                {x.title}
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

function Main() {
  const q = useQuery({
    posts: {},
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
          Add random todo
        </button>
        <button
          className="btn bg-gray-200 hover:bg-red-400"
          onClick={() => {
            removeTodos(posts);
          }}>
          clear
        </button>
      </div>
      <div className="my-2">
        <strong>{posts.length}</strong> posts
      </div>
      <TodoList />
    </div>
  );
}

type ITodoApp = React.ComponentProps<"div">;
const TodoApp = ({ className, ...props }: ITodoApp) => {
  const isLoading = useInit({ token: "28848c49-c2c3-499d-b9af-7c1fd396613d" });
  return (
    <div {...props} data-test-id="TodoApp" className={classNames("", className)}>
      {isLoading ? <div>Loading ...</div> : <Main />}
    </div>
  );
};

export default TodoApp;
