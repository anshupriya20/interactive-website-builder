import apiRequest from "./api";

export const registerUser = (data) =>
  apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) });
export const loginUser = (data) =>
  apiRequest("/auth/login", { method: "POST", body: JSON.stringify(data) });
export const logoutUser = () => apiRequest("/auth/logout", { method: "POST" });
export const getCurrentUser = () => apiRequest("/auth/me");
export const forgotPassword = (data) =>
  apiRequest("/auth/forgot-password", { method: "POST", body: JSON.stringify(data) });
export const resetPassword = (token, data) =>
  apiRequest(`/auth/reset-password/${token}`, { method: "POST", body: JSON.stringify(data) });
export const changePassword = (data) =>
  apiRequest("/auth/change-password", { method: "POST", body: JSON.stringify(data) });
export const updateUserDetails = (data) =>
  apiRequest("/auth/update-details", { method: "PUT", body: JSON.stringify(data) });
