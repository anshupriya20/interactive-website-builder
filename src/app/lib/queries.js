import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserDetails,
} from "./authApi";
import {
  getMyProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  publishProject,
} from "./projectApi";

import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserPlan,
  deleteUser,
} from "./adminApi";

// ========================USER API=========================
export const useCurrentUser = () =>
  useQuery({ queryKey: ["me"], queryFn: getCurrentUser, retry: false });

export const useProjects = () =>
  useQuery({ queryKey: ["projects"], queryFn: getMyProjects });

export const useProject = (id) =>
  useQuery({
    queryKey: ["projects", id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => queryClient.setQueryData(["me"], data),
  });
};

// ── Mutations (writes) ──
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => queryClient.setQueryData(["me"], data),
  });
};

export const useForgotPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) =>
      queryClient.setDefaultOptions({ queries: { retry: false } }, data),
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) =>
      queryClient.setDefaultOptions({ queries: { retry: false } }, data),
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) =>
      queryClient.setDefaultOptions({ queries: { retry: false } }, data),
  });
};

export const useUpdateUserDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserDetails,
    onSuccess: (data) =>
      queryClient.setDefaultOptions({ queries: { retry: false } }, data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null); // instantly clear cached user
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

// =========================PROJECT API=========================
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id, data) => updateProject(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects", id] }),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
};

export const usePublishProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => publishProject(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
};

// =========================ADMIN API=========================
export const useAllUsers = () =>
  useQuery({ queryKey: ["admin", "users"], queryFn: getAllUsers });

export const useUserById = (id) =>
  useQuery({
    queryKey: ["admin", "users", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, role),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
};

export const useUpdateUserPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, plan }) => updateUserPlan(id, plan),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
};
