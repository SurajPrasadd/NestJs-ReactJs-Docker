import React from "react";
import { useUsers } from "./hooks/useUsers.ts";
import { api } from "./api/client.ts";

export default function App() {
  const { data, isLoading, refetch } = useUsers();

  const handleAdd = async () => {
    try {
      await api.post("/users", {
        name: `User ${Date.now()}`,
        email: `user${Date.now()}@mail.com`,
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-4 text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
      >
        Add User
      </button>
      <ul className="mt-4">
        {data?.map((u: any) => (
          <li key={u.id} className="border-b py-1">
            {u.name} — {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
