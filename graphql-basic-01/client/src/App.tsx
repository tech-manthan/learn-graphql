import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
      user {
        name
        email
        username
      }
    }
  }
`;

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  user: {
    name: string;
    email: string;
    username: string;
  };
};

function App() {
  const { loading, data, error } = useQuery<{
    getTodos: Todo[];
  }>(GET_TODOS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <>
      {data?.getTodos.map((todo) => {
        return (
          <div key={todo.id}>
            <h1>{todo.title}</h1>
            <p>Status : {todo.completed ? "Completed" : "Pending"}</p>
            <h2>Todo Creator Detail : </h2>
            <p>Name: {todo.user.name}</p>
            <p>Email: {todo.user.email}</p>
            <p>Username: {todo.user.username}</p>
          </div>
        );
      })}
    </>
  );
}

export default App;
