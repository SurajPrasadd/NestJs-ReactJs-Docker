import API from "./client";

// 🔹 Login User (Admin/User)
export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });

  const { accessToken, refreshToken } = res.data.data.token;

  // Save tokens in localStorage
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return res.data;
};

// 🔹 Logout User
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
