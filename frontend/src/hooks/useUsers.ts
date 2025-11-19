import { useQuery } from "@tanstack/react-query";
import API from "../api/client";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await API.get("/users");
      return data;
    },
  });
