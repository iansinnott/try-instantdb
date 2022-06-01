import classNames from "classnames";
import { faker } from "@faker-js/faker";

import { transact, useInit as useInitInstantDB, useQuery, tx, id } from "instant-local-throwaway";
import { title } from "process";
import Link from "next/link";
import { useCallback } from "react";
import { Spinner } from "./Loading";

export enum Status {
  pending = "pending",
  complete = "complete",
  cancelled = "cancelled",
}

export interface ITodo {
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

interface ITodoDetailView extends React.ComponentProps<"div"> {
  todo: ITodo;
}
export const TodoDetailView = ({ className, todo, ...props }: ITodoDetailView) => {
  const updateBody = useCallback(
    (x: string) => {
      transact([tx.posts[todo.id].update({ body: x })]);
    },
    [todo.id],
  );
  return (
    <div
      {...props}
      data-test-id="TodoDetailView"
      className={classNames("flex flex-col space-y-4", className)}>
      <h3 className="text-3xl capitalize">{todo.title}</h3>
      <div className="flex space-x-4">
        <div
          className={classNames("text-xs uppercase font-bold  px-1 py-px rounded", {
            "bg-amber-700 text-white": todo.status === Status.pending,
            "bg-green-300": todo.status === Status.complete,
          })}>
          {todo.status}
        </div>
        <div className="text-sm italic">Last updated {todo.updatedAt.toLocaleString()}</div>
      </div>
      <form>
        <textarea
          name="body"
          id="body"
          className="bg-slate-200 w-full p-2 rounded min-h-[200px]"
          onChange={(e) => {
            updateBody(e.target.value);
          }}
          value={todo.body || ""}
          placeholder="Details..."></textarea>
        <small className="block italic">
          Note: This <code>textarea</code> will not work very well.
        </small>
      </form>
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

export const useInit = () => useInitInstantDB({ token: "28848c49-c2c3-499d-b9af-7c1fd396613d" });

type ITodoApp = React.ComponentProps<"div">;
const TodoApp = ({ className, ...props }: ITodoApp) => {
  const isLoading = useInit();
  return (
    <div {...props} data-test-id="TodoApp" className={classNames("", className)}>
      {isLoading ? <Spinner /> : <Main />}
    </div>
  );
};

export default TodoApp;
