import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data;
    },
  });
