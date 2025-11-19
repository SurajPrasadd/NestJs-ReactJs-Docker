import React from "react";
import { useUsers } from "./hooks/useUsers.ts";
import Checkout from "./components/Checkout.jsx";
import API from "./api/client";
import { loginUser } from "./api/auth";

export default function App() {
  const { data, isLoading, refetch } = useUsers();

  const handleAdd = async () => {
    try {
      await loginUser("admin@example.com", "password123");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-4 text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
      >
        Login
      </button>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <Checkout></Checkout>
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
      >
        Add User
      </button>
      <ul className="mt-4">
        {/* {data?.map((u: any) => (
          <li key={u.id} className="border-b py-1">
            {u.name} — {u.email}
          </li>
        ))} */}
      </ul>
    </div>
  );
}
