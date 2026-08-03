import apiRequest from "./api";

export const createProject = (data) =>
  apiRequest("/projects/", { method: "POST", body: JSON.stringify(data) });

export const updateProject = (id, data) =>
  apiRequest(`/projects/update-details/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteProject = (id) =>
  apiRequest(`/projects/${id}/delete-project`, { method: "DELETE" });

export const getMyProjects = () => apiRequest("/projects/all-projects");

export const getProjectById = (id) => apiRequest(`/projects/${id}`);

export const publishProject = (id) =>
  apiRequest(`/projects/${id}/publish`, { method: "POST" });