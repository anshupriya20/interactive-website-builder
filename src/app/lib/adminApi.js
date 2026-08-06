import apiRequest from "./api";

export const getAllUsers = () => apiRequest("/user");

export const  getUserById = (id) => apiRequest(`/user/${id}`);

export const updateUserRole = (id, role) =>
  apiRequest(`/user/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) });

export const updateUserPlan = (id, plan) =>
  apiRequest(`/user/${id}/plan`, { method: "PUT", body: JSON.stringify({ plan }) });

export const deleteUser = (id) =>
  apiRequest(`/user/${id}/delete-user`, { method: "DELETE" });



