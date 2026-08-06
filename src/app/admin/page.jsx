// "use client";

// import { useState, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//     Plus,
//     MoreVertical,
//     ExternalLink,
//     Trash2,
//     Rocket,
//     Pencil,
//     Search,
//     LayoutGrid,
//     Clock,
//     Globe,
//     FileText,
//     Sparkles,
//     X,
// } from "lucide-react";
// import toast from "react-hot-toast";

// import {
//     useCurrentUser,
//     useProjects,
//     useCreateProject,
//     useDeleteProject,
//     usePublishProject,
// } from "../../lib/queries";

// const PLAN_LABELS = {
//     free: "Free",
//     pro: "Pro",
//     proYearly: "Pro (Yearly)",
// };

// const FREE_LIMIT = 3;

// export default function DashboardPage() {
//     const router = useRouter();
//     const { data: userData, isLoading: userLoading } = useCurrentUser();
//     const { data: projectsData, isLoading: projectsLoading } = useProjects();

//     const createMutation = useCreateProject();
//     const deleteMutation = useDeleteProject();
//     const publishMutation = usePublishProject();

//     const [search, setSearch] = useState("");
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [newProjectName, setNewProjectName] = useState("");
//     const [activeMenuId, setActiveMenuId] = useState(null);
//     const [deleteTarget, setDeleteTarget] = useState(null);

//     const user = userData?.user;
//     const projects = useMemo(() => projectsData?.projects || [], [projectsData]);

//     const limit = user?.plan === "free" ? FREE_LIMIT : Infinity;
//     const usedCount = user?.projectsCreatedCount ?? 0;
//     const atLimit = usedCount >= limit;
//     const usagePct = limit === Infinity ? 0 : Math.min(100, (usedCount / limit) * 100);

//     const filteredProjects = useMemo(() => {
//         if (!search.trim()) return projects;
//         return projects.filter((p) =>
//             p.projectName.toLowerCase().includes(search.toLowerCase())
//         );
//     }, [projects, search]);

//     const stats = useMemo(() => {
//         const published = projects.filter((p) => p.isPublished).length;
//         const drafts = projects.length - published;
//         return { total: projects.length, published, drafts };
//     }, [projects]);

//     const handleCreate = () => {
//         if (atLimit) {
//             toast.error("Free plan limit reached. Upgrade to create more projects.");
//             return;
//         }
//         createMutation.mutate(
//             { projectName: newProjectName.trim() || "Untitled Project" },
//             {
//                 onSuccess: (data) => {
//                     toast.success("Project created");
//                     setShowCreateModal(false);
//                     setNewProjectName("");
//                     router.push(`/builder/${data.project._id}`);
//                 },
//                 onError: (err) => toast.error(err.message),
//             }
//         );
//     };

//     const handleDelete = (id) => {
//         deleteMutation.mutate(id, {
//             onSuccess: () => {
//                 toast.success("Project deleted");
//                 setDeleteTarget(null);
//             },
//             onError: (err) => toast.error(err.message),
//         });
//     };

//     const handlePublish = (id) => {
//         publishMutation.mutate(id, {
//             onSuccess: () => toast.success("Project published"),
//             onError: (err) => toast.error(err.message),
//         });
//         setActiveMenuId(null);
//     };

//     const loading = userLoading || projectsLoading;

//     return (
//         <div className="min-h-screen bg-black text-white">
//             {/* ── Top bar ── */}
//             <header className="border-b border-zinc-800 bg-[#0a0a0a]">
//                 <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
//                     <h1 className="font-bold text-xl">
//                         Craft<span className="text-indigo-400">Site</span>
//                     </h1>

//                     <div className="flex items-center gap-3">
//                         {user && (
//                             <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
//                                 <span
//                                     className={`h-1.5 w-1.5 rounded-full ${user.plan === "free" ? "bg-zinc-500" : "bg-indigo-400"
//                                         }`}
//                                 />
//                                 {PLAN_LABELS[user.plan] || "Free"} plan
//                             </span>
//                         )}
//                         <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
//                             {user?.name?.[0]?.toUpperCase() || "?"}
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             <main className="mx-auto max-w-7xl px-6 py-10">
//                 {/* ── Greeting + primary action ── */}
//                 <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
//                     <div>
//                         <p className="text-sm text-zinc-500 mb-1">
//                             {greeting()}
//                             {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
//                         </p>
//                         <h2 className="text-2xl font-semibold">Your projects</h2>
//                     </div>

//                     <button
//                         onClick={() => setShowCreateModal(true)}
//                         className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0"
//                     >
//                         <Plus size={16} />
//                         New Project
//                     </button>
//                 </div>

//                 {/* ── Stats row ── */}
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
//                     <StatCard icon={LayoutGrid} label="Total projects" value={stats.total} />
//                     <StatCard icon={Globe} label="Published" value={stats.published} />
//                     <StatCard icon={FileText} label="Drafts" value={stats.drafts} />
//                     <PlanUsageCard
//                         plan={user?.plan}
//                         usedCount={usedCount}
//                         limit={limit}
//                         usagePct={usagePct}
//                         atLimit={atLimit}
//                     />
//                 </div>

//                 {/* ── Search ── */}
//                 {projects.length > 0 && (
//                     <div className="relative mb-6 max-w-sm">
//                         <Search
//                             size={16}
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
//                         />
//                         <input
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                             placeholder="Search projects"
//                             className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
//                         />
//                     </div>
//                 )}

//                 {/* ── Content ── */}
//                 {loading ? (
//                     <LoadingGrid />
//                 ) : projects.length === 0 ? (
//                     <EmptyState onCreate={() => setShowCreateModal(true)} />
//                 ) : filteredProjects.length === 0 ? (
//                     <div className="text-center py-20 text-zinc-500 text-sm">
//                         No projects match &ldquo;{search}&rdquo;.
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {filteredProjects.map((project) => (
//                             <ProjectCard
//                                 key={project._id}
//                                 project={project}
//                                 menuOpen={activeMenuId === project._id}
//                                 onToggleMenu={() =>
//                                     setActiveMenuId(activeMenuId === project._id ? null : project._id)
//                                 }
//                                 onOpen={() => router.push(`/builder/${project._id}`)}
//                                 onPublish={() => handlePublish(project._id)}
//                                 onDelete={() => {
//                                     setDeleteTarget(project);
//                                     setActiveMenuId(null);
//                                 }}
//                                 publishing={publishMutation.isPending}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </main>

//             {/* ── Create modal ── */}
//             <AnimatePresence>
//                 {showCreateModal && (
//                     <Modal onClose={() => setShowCreateModal(false)}>
//                         <h3 className="text-lg font-semibold mb-1">New project</h3>
//                         <p className="text-sm text-zinc-500 mb-5">
//                             Give your site a name. You can change this anytime.
//                         </p>

//                         {atLimit ? (
//                             <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
//                                 You&apos;ve used all {limit} projects on the Free plan. Upgrade to
//                                 create more.
//                             </div>
//                         ) : (
//                             <>
//                                 <input
//                                     autoFocus
//                                     value={newProjectName}
//                                     onChange={(e) => setNewProjectName(e.target.value)}
//                                     onKeyDown={(e) => e.key === "Enter" && handleCreate()}
//                                     placeholder="e.g. Portfolio, Startup Landing"
//                                     className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 mb-5"
//                                 />
//                                 <button
//                                     onClick={handleCreate}
//                                     disabled={createMutation.isPending}
//                                     className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all py-3 rounded-xl text-sm font-semibold"
//                                 >
//                                     {createMutation.isPending ? "Creating..." : "Create project"}
//                                 </button>
//                             </>
//                         )}
//                     </Modal>
//                 )}
//             </AnimatePresence>

//             {/* ── Delete confirm modal ── */}
//             <AnimatePresence>
//                 {deleteTarget && (
//                     <Modal onClose={() => setDeleteTarget(null)}>
//                         <h3 className="text-lg font-semibold mb-1">Delete project?</h3>
//                         <p className="text-sm text-zinc-500 mb-6">
//                             &ldquo;{deleteTarget.projectName}&rdquo; will be permanently deleted.
//                             This can&apos;t be undone.
//                         </p>
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={() => setDeleteTarget(null)}
//                                 className="flex-1 py-3 rounded-xl text-sm font-medium border border-zinc-800 hover:bg-zinc-900 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={() => handleDelete(deleteTarget._id)}
//                                 disabled={deleteMutation.isPending}
//                                 className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-colors"
//                             >
//                                 {deleteMutation.isPending ? "Deleting..." : "Delete"}
//                             </button>
//                         </div>
//                     </Modal>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }

// /* ---------- pieces ---------- */

// function greeting() {
//     const h = new Date().getHours();
//     if (h < 12) return "Good morning";
//     if (h < 18) return "Good afternoon";
//     return "Good evening";
// }

// function StatCard({ icon: Icon, label, value }) {
//     return (
//         <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
//             <Icon size={16} className="text-zinc-500 mb-3" />
//             <p className="text-2xl font-semibold leading-none mb-1">{value}</p>
//             <p className="text-xs text-zinc-500">{label}</p>
//         </div>
//     );
// }

// function PlanUsageCard({ plan, usedCount, limit, usagePct, atLimit }) {
//     const isFree = plan === "free" || !plan;
//     return (
//         <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 col-span-2 sm:col-span-1">
//             <div className="flex items-center justify-between mb-3">
//                 <Sparkles size={16} className="text-zinc-500" />
//                 {isFree && atLimit && (
//                     <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
//                         Limit reached
//                     </span>
//                 )}
//             </div>
//             {isFree ? (
//                 <>
//                     <p className="text-2xl font-semibold leading-none mb-1">
//                         {usedCount}
//                         <span className="text-sm text-zinc-500">/{limit}</span>
//                     </p>
//                     <p className="text-xs text-zinc-500 mb-2">Projects used</p>
//                     <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
//                         <div
//                             className={`h-full rounded-full transition-all ${atLimit ? "bg-amber-500" : "bg-indigo-500"
//                                 }`}
//                             style={{ width: `${usagePct}%` }}
//                         />
//                     </div>
//                 </>
//             ) : (
//                 <>
//                     <p className="text-2xl font-semibold leading-none mb-1">∞</p>
//                     <p className="text-xs text-zinc-500">Unlimited projects</p>
//                 </>
//             )}
//         </div>
//     );
// }

// function ProjectCard({
//     project,
//     menuOpen,
//     onToggleMenu,
//     onOpen,
//     onPublish,
//     onDelete,
//     publishing,
// }) {
//     return (
//         <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors overflow-hidden">
//             {/* thumbnail area */}
//             <button
//                 onClick={onOpen}
//                 className="block w-full aspect-[16/10] bg-[#0d0d0d] relative overflow-hidden"
//             >
//                 <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-3/4 space-y-2 opacity-40">
//                         <div className="h-2 w-1/2 rounded bg-zinc-700" />
//                         <div className="h-2 w-full rounded bg-zinc-800" />
//                         <div className="h-2 w-3/4 rounded bg-zinc-800" />
//                         <div className="grid grid-cols-2 gap-2 mt-3">
//                             <div className="h-8 rounded bg-zinc-800" />
//                             <div className="h-8 rounded bg-zinc-800" />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
//                     <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black px-3 py-1.5 rounded-lg">
//                         <ExternalLink size={12} />
//                         Open in builder
//                     </span>
//                 </div>
//             </button>

//             {/* meta row */}
//             <div className="p-4 flex items-start justify-between gap-2">
//                 <div className="min-w-0">
//                     <p className="text-sm font-medium truncate">{project.projectName}</p>
//                     <div className="flex items-center gap-2 mt-1">
//                         <span
//                             className={`inline-flex items-center gap-1 text-[11px] ${project.isPublished ? "text-emerald-400" : "text-zinc-500"
//                                 }`}
//                         >
//                             <span
//                                 className={`h-1.5 w-1.5 rounded-full ${project.isPublished ? "bg-emerald-400" : "bg-zinc-600"
//                                     }`}
//                             />
//                             {project.isPublished ? "Published" : "Draft"}
//                         </span>
//                         <span className="text-zinc-700">·</span>
//                         <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
//                             <Clock size={10} />
//                             {timeAgo(project.updatedAt)}
//                         </span>
//                     </div>
//                 </div>

//                 <div className="relative shrink-0">
//                     <button
//                         onClick={onToggleMenu}
//                         className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
//                     >
//                         <MoreVertical size={16} />
//                     </button>

//                     <AnimatePresence>
//                         {menuOpen && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -4, scale: 0.96 }}
//                                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                                 exit={{ opacity: 0, y: -4, scale: 0.96 }}
//                                 transition={{ duration: 0.12 }}
//                                 className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl py-1"
//                             >
//                                 <MenuItem icon={Pencil} label="Open" onClick={onOpen} />
//                                 <MenuItem
//                                     icon={Rocket}
//                                     label={publishing ? "Publishing..." : "Publish"}
//                                     onClick={onPublish}
//                                     disabled={publishing}
//                                 />
//                                 <div className="h-px bg-zinc-800 my-1" />
//                                 <MenuItem
//                                     icon={Trash2}
//                                     label="Delete"
//                                     onClick={onDelete}
//                                     danger
//                                 />
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function MenuItem({ icon: Icon, label, onClick, danger, disabled }) {
//     return (
//         <button
//             onClick={onClick}
//             disabled={disabled}
//             className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors disabled:opacity-50 ${danger
//                     ? "text-red-400 hover:bg-red-500/10"
//                     : "text-zinc-300 hover:bg-zinc-800"
//                 }`}
//         >
//             <Icon size={14} />
//             {label}
//         </button>
//     );
// }

// function EmptyState({ onCreate }) {
//     return (
//         <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border border-dashed border-zinc-800">
//             <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
//                 <Sparkles size={24} className="text-indigo-400" />
//             </div>
//             <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
//             <p className="text-sm text-zinc-500 mb-6 max-w-xs">
//                 Start with a blank canvas or a template — your first site is a few
//                 clicks away.
//             </p>
//             <button
//                 onClick={onCreate}
//                 className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-5 py-2.5 rounded-xl text-sm font-semibold"
//             >
//                 <Plus size={16} />
//                 Create your first project
//             </button>
//         </div>
//     );
// }

// function LoadingGrid() {
//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[...Array(3)].map((_, i) => (
//                 <div
//                     key={i}
//                     className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
//                 >
//                     <div className="aspect-[16/10] bg-zinc-900 animate-pulse" />
//                     <div className="p-4 space-y-2">
//                         <div className="h-3 w-2/3 rounded bg-zinc-800 animate-pulse" />
//                         <div className="h-2 w-1/3 rounded bg-zinc-800 animate-pulse" />
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }

// function Modal({ children, onClose }) {
//     return (
//         <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//             <motion.div
//                 initial={{ opacity: 0, y: 12, scale: 0.97 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 12, scale: 0.97 }}
//                 transition={{ duration: 0.18 }}
//                 onClick={(e) => e.stopPropagation()}
//                 className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
//             >
//                 <button
//                     onClick={onClose}
//                     className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
//                 >
//                     <X size={18} />
//                 </button>
//                 {children}
//             </motion.div>
//         </motion.div>
//     );
// }

// function timeAgo(dateStr) {
//     if (!dateStr) return "";
//     const diff = Date.now() - new Date(dateStr).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return "just now";
//     if (mins < 60) return `${mins}m ago`;
//     const hrs = Math.floor(mins / 60);
//     if (hrs < 24) return `${hrs}h ago`;
//     const days = Math.floor(hrs / 24);
//     if (days < 7) return `${days}d ago`;
//     return new Date(dateStr).toLocaleDateString();
// }

// "use client";

// import { useState, useMemo } from "react";
// import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
// import {
//   Search,
//   Shield,
//   ShieldCheck,
//   Trash2,
//   ChevronDown,
//   Users,
//   FolderKanban,
//   Globe,
//   Crown,
// } from "lucide-react";
// import toast from "react-hot-toast";

// import {
//   useCurrentUser,
//   useAllUsers,
//   useUpdateUserRole,
//   useUpdateUserPlan,
//   useDeleteUser,
// } from "../../lib/queries";

// const mono = JetBrains_Mono({
//   subsets: ["latin"],
//   weight: ["400", "500"],
//   variable: "--font-mono",
// });

// const grotesk = Space_Grotesk({
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
//   variable: "--font-sans",
// });

// const PLAN_LABELS = { free: "Free", pro: "Pro", proYearly: "Pro · Annual" };
// const ROLE_OPTIONS = ["user", "admin"];
// const PLAN_OPTIONS = ["free", "pro", "proYearly"];

// export default function DashboardPage() {
//   const { data: currentUserData } = useCurrentUser();
//   const { data: usersData, isLoading } = useAllUsers();

//   const updateRoleMutation = useUpdateUserRole();
//   const updatePlanMutation = useUpdateUserPlan();
//   const deleteMutation = useDeleteUser();

//   const [search, setSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("all");
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const currentUser = currentUserData?.user;
//   const users = useMemo(() => usersData?.users || [], [usersData]);

//   const filtered = useMemo(() => {
//     return users.filter((u) => {
//       const matchesSearch =
//         !search.trim() ||
//         u.name.toLowerCase().includes(search.toLowerCase()) ||
//         u.email.toLowerCase().includes(search.toLowerCase());
//       const matchesRole = roleFilter === "all" || u.role === roleFilter;
//       return matchesSearch && matchesRole;
//     });
//   }, [users, search, roleFilter]);

//   const stats = useMemo(() => {
//     const admins = users.filter((u) => u.role === "admin").length;
//     const paid = users.filter((u) => u.plan !== "free").length;
//     const totalProjects = users.reduce((sum, u) => sum + (u.projectsCreatedCount || 0), 0);
//     return { total: users.length, admins, paid, totalProjects };
//   }, [users]);

//   const handleRoleChange = (id, role) => {
//     updateRoleMutation.mutate(
//       { id, role },
//       {
//         onSuccess: () => toast.success(`Role updated to ${role}`),
//         onError: (err) => toast.error(err.message),
//       }
//     );
//   };

//   const handlePlanChange = (id, plan) => {
//     updatePlanMutation.mutate(
//       { id, plan },
//       {
//         onSuccess: () => toast.success(`Plan updated to ${PLAN_LABELS[plan]}`),
//         onError: (err) => toast.error(err.message),
//       }
//     );
//   };

//   const handleDelete = (id) => {
//     deleteMutation.mutate(id, {
//       onSuccess: () => {
//         toast.success("User deleted");
//         setDeleteTarget(null);
//       },
//       onError: (err) => toast.error(err.message),
//     });
//   };

//   return (
//     <div
//       className={`${mono.variable} ${grotesk.variable} min-h-screen bg-[#0a0b0d] text-[#e8e6df] font-[family-name:var(--font-sans)] relative`}
//     >
//       <div
//         className="pointer-events-none fixed inset-0 opacity-[0.035]"
//         style={{
//           backgroundImage:
//             "linear-gradient(#c99b4a 1px, transparent 1px), linear-gradient(90deg, #c99b4a 1px, transparent 1px)",
//           backgroundSize: "48px 48px",
//         }}
//       />

//       {/* ── header ── */}
//       <header className="relative border-b border-white/[0.07]">
//         <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <Mark />
//             <span className="text-[15px] font-semibold tracking-tight">CraftSite</span>
//             <span className="ml-1 px-2 py-0.5 rounded-md bg-[#c99b4a]/10 border border-[#c99b4a]/25 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[#c99b4a]">
//               Admin
//             </span>
//           </div>

//           <div className="flex items-center gap-3">
//             <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#8b8577]">
//               {currentUser?.email}
//             </span>
//             <div className="h-8 w-8 rounded-full bg-[#1a1c1f] border border-white/10 flex items-center justify-center text-[12px] font-medium">
//               {currentUser?.name?.[0]?.toUpperCase() || "—"}
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="relative mx-auto max-w-6xl px-6 py-12">
//         <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#c99b4a] mb-2">
//           Platform registry
//         </p>
//         <h1 className="text-[28px] font-semibold tracking-tight mb-10">
//           User &amp; access management
//         </h1>

//         {/* ── platform stat rail ── */}
//         <div className="mb-10 rounded-xl border border-white/[0.08] bg-[#0e0f12] overflow-hidden">
//           <div className="grid grid-cols-2 sm:grid-cols-4">
//             <SpecCell icon={Users} label="Total users" value={stats.total} />
//             <SpecCell icon={ShieldCheck} label="Admins" value={stats.admins} accent="#c99b4a" />
//             <SpecCell icon={Crown} label="Paid accounts" value={stats.paid} accent="#4fd1a5" />
//             <SpecCell icon={FolderKanban} label="Projects (all)" value={stats.totalProjects} />
//           </div>
//         </div>

//         {/* ── filters ── */}
//         <div className="flex flex-wrap items-center gap-3 mb-6">
//           <div className="relative flex-1 min-w-[220px] max-w-xs">
//             <Search
//               size={14}
//               className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c584d] pointer-events-none"
//             />
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search name or email"
//               className="w-full rounded-lg border border-white/[0.08] bg-[#0e0f12] py-2.5 pl-9 pr-3 text-[13px] placeholder:text-[#5c584d] outline-none focus:border-[#c99b4a]/40 transition-colors font-[family-name:var(--font-mono)]"
//             />
//           </div>

//           <div className="flex rounded-lg border border-white/[0.08] bg-[#0e0f12] p-0.5 font-[family-name:var(--font-mono)] text-[11px]">
//             {["all", "user", "admin"].map((r) => (
//               <button
//                 key={r}
//                 onClick={() => setRoleFilter(r)}
//                 className={`px-3 py-1.5 rounded-md uppercase tracking-wide transition-colors ${
//                   roleFilter === r
//                     ? "bg-[#c99b4a] text-[#0a0b0d]"
//                     : "text-[#8b8577] hover:text-white"
//                 }`}
//               >
//                 {r}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── user registry table ── */}
//         <div className="rounded-xl border border-white/[0.08] bg-[#0e0f12] overflow-hidden">
//           <div className="grid grid-cols-[1fr_140px_150px_110px_40px] gap-4 px-5 py-3 border-b border-white/[0.07] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[#5c584d]">
//             <span>User</span>
//             <span>Role</span>
//             <span>Plan</span>
//             <span>Projects</span>
//             <span />
//           </div>

//           {isLoading ? (
//             <LoadingRows />
//           ) : filtered.length === 0 ? (
//             <p className="py-16 text-center text-[13px] text-[#5c584d] font-[family-name:var(--font-mono)]">
//               No users match this filter.
//             </p>
//           ) : (
//             filtered.map((u) => (
//               <UserRow
//                 key={u._id}
//                 user={u}
//                 isSelf={u._id === currentUser?._id}
//                 onRoleChange={(role) => handleRoleChange(u._id, role)}
//                 onPlanChange={(plan) => handlePlanChange(u._id, plan)}
//                 onDelete={() => setDeleteTarget(u)}
//               />
//             ))
//           )}
//         </div>
//       </main>

//       {/* ── delete confirm ── */}
//       {deleteTarget && (
//         <div
//           onClick={() => setDeleteTarget(null)}
//           className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-[#0e0f12] p-6 shadow-2xl"
//           >
//             <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-red-400/80 mb-2">
//               Cannot be undone
//             </p>
//             <h3 className="text-[19px] font-semibold mb-2">Delete user</h3>
//             <p className="text-[13px] text-[#8b8577] mb-6 leading-relaxed">
//               &ldquo;{deleteTarget.name}&rdquo; ({deleteTarget.email}) and their account
//               will be permanently removed.
//             </p>
//             <div className="flex gap-2.5">
//               <button
//                 onClick={() => setDeleteTarget(null)}
//                 className="flex-1 py-2.5 rounded-lg text-[13px] font-medium border border-white/[0.08] hover:bg-white/[0.03] transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => handleDelete(deleteTarget._id)}
//                 className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold bg-red-500/90 hover:bg-red-500 transition-colors"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- pieces ---------- */

// function Mark() {
//   return (
//     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//       <rect x="2" y="2" width="20" height="20" rx="4" stroke="#c99b4a" strokeWidth="1.6" />
//       <path d="M8 12h8M12 8v8" stroke="#c99b4a" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   );
// }

// function SpecCell({ icon: Icon, label, value, accent }) {
//   return (
//     <div className="px-5 py-4 border-r border-white/[0.06] last:border-r-0">
//       <Icon size={13} className="text-[#5c584d] mb-2.5" />
//       <p
//         className="font-[family-name:var(--font-mono)] text-[22px] font-medium leading-none mb-1.5"
//         style={{ color: accent }}
//       >
//         {String(value).padStart(2, "0")}
//       </p>
//       <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[#5c584d]">
//         {label}
//       </p>
//     </div>
//   );
// }

// function UserRow({ user, isSelf, onRoleChange, onPlanChange, onDelete }) {
//   return (
//     <div className="grid grid-cols-[1fr_140px_150px_110px_40px] gap-4 px-5 py-4 border-b border-white/[0.05] last:border-b-0 items-center hover:bg-white/[0.015] transition-colors">
//       <div className="min-w-0 flex items-center gap-3">
//         <div className="h-8 w-8 rounded-full bg-[#1a1c1f] border border-white/10 flex items-center justify-center text-[12px] font-medium shrink-0">
//           {user.name?.[0]?.toUpperCase() || "—"}
//         </div>
//         <div className="min-w-0">
//           <p className="text-[13px] font-medium truncate">
//             {user.name}
//             {isSelf && (
//               <span className="ml-1.5 text-[10px] text-[#5c584d] font-[family-name:var(--font-mono)]">
//                 (you)
//               </span>
//             )}
//           </p>
//           <p className="text-[11.5px] text-[#5c584d] truncate font-[family-name:var(--font-mono)]">
//             {user.email}
//           </p>
//         </div>
//       </div>

//       <RoleSelect value={user.role} disabled={isSelf} onChange={onRoleChange} />
//       <PlanSelect value={user.plan} onChange={onPlanChange} />

//       <span className="font-[family-name:var(--font-mono)] text-[13px] text-[#c4c1b8]">
//         {user.projectsCreatedCount ?? 0}
//       </span>

//       <button
//         onClick={onDelete}
//         disabled={isSelf}
//         title={isSelf ? "You can't delete your own account" : "Delete user"}
//         className="p-1.5 rounded-md text-[#5c584d] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#5c584d]"
//       >
//         <Trash2 size={14} />
//       </button>
//     </div>
//   );
// }

// function RoleSelect({ value, onChange, disabled }) {
//   return (
//     <div className="relative">
//       <select
//         value={value}
//         disabled={disabled}
//         onChange={(e) => onChange(e.target.value)}
//         className={`w-full appearance-none rounded-md border px-2.5 py-1.5 pr-7 text-[11.5px] font-[family-name:var(--font-mono)] uppercase tracking-wide outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
//           value === "admin"
//             ? "border-[#c99b4a]/30 bg-[#c99b4a]/[0.08] text-[#c99b4a]"
//             : "border-white/[0.08] bg-[#14161a] text-[#c4c1b8]"
//         }`}
//       >
//         {ROLE_OPTIONS.map((r) => (
//           <option key={r} value={r} className="bg-[#14161a] text-[#c4c1b8]">
//             {r}
//           </option>
//         ))}
//       </select>
//       <ChevronDown
//         size={12}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5c584d] pointer-events-none"
//       />
//     </div>
//   );
// }

// function PlanSelect({ value, onChange }) {
//   return (
//     <div className="relative">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full appearance-none rounded-md border border-white/[0.08] bg-[#14161a] px-2.5 py-1.5 pr-7 text-[11.5px] font-[family-name:var(--font-mono)] text-[#c4c1b8] outline-none cursor-pointer"
//       >
//         {PLAN_OPTIONS.map((p) => (
//           <option key={p} value={p} className="bg-[#14161a]">
//             {PLAN_LABELS[p]}
//           </option>
//         ))}
//       </select>
//       <ChevronDown
//         size={12}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5c584d] pointer-events-none"
//       />
//     </div>
//   );
// }

// function LoadingRows() {
//   return (
//     <>
//       {[...Array(4)].map((_, i) => (
//         <div key={i} className="grid grid-cols-[1fr_140px_150px_110px_40px] gap-4 px-5 py-4 border-b border-white/[0.05] last:border-b-0">
//           <div className="flex items-center gap-3">
//             <div className="h-8 w-8 rounded-full bg-white/[0.06] animate-pulse" />
//             <div className="space-y-1.5">
//               <div className="h-2.5 w-24 rounded-sm bg-white/[0.06] animate-pulse" />
//               <div className="h-2 w-32 rounded-sm bg-white/[0.06] animate-pulse" />
//             </div>
//           </div>
//           <div className="h-7 rounded-md bg-white/[0.06] animate-pulse" />
//           <div className="h-7 rounded-md bg-white/[0.06] animate-pulse" />
//           <div className="h-4 w-6 rounded-sm bg-white/[0.06] animate-pulse" />
//           <div />
//         </div>
//       ))}
//     </>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import {
  Search,
  ShieldCheck,
  Trash2,
  ChevronDown,
  Users,
  FolderKanban,
  Crown,
  LayoutGrid,
  Settings,
  LogOut,
  Save,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useCurrentUser,
  useAllUsers,
  useUpdateUserRole,
  useUpdateUserPlan,
  useDeleteUser,
  useLogout,
  useUpdateUserDetails,
  useChangePassword,
} from "../lib/queries";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });

const PLAN_LABELS = { free: "Free", pro: "Pro", proYearly: "Pro · Annual" };
const ROLE_OPTIONS = ["user", "admin"];
const PLAN_OPTIONS = ["free", "pro", "proYearly"];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState("overview");
  const { data: currentUserData } = useCurrentUser();
  const currentUser = currentUserData?.user;

  return (
    <div
      className={`${mono.variable} ${grotesk.variable} min-h-screen bg-[#0a0b0d] text-[#e8e6df] font-[family-name:var(--font-sans)] flex`}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#c99b4a 1px, transparent 1px), linear-gradient(90deg, #c99b4a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Sidebar tab={tab} setTab={setTab} user={currentUser} />

      <div className="relative flex-1 min-w-0">
        <TopBar user={currentUser} />
        <main className="px-10 py-10 max-w-5xl">
          {tab === "overview" && <OverviewTab />}
          {tab === "users" && <UsersTab currentUser={currentUser} />}
          {tab === "settings" && <SettingsTab user={currentUser} />}

        </main>
      </div>
    </div>
  );
}

/* ---------- shell ---------- */

function Sidebar({ tab, setTab, user }) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const items = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  return (
    <aside className="relative w-60 shrink-0 border-r border-white/[0.07] flex flex-col">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-white/[0.07]">
        <Mark />
        <span className="text-[15px] font-semibold tracking-tight">CraftSite</span>
      </div>

      <div className="px-4 pt-5">
        <span className="inline-flex px-2 py-0.5 rounded-md bg-[#c99b4a]/10 border border-[#c99b4a]/25 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[#c99b4a] mb-6 ml-2">
          Admin console
        </span>

        <nav className="space-y-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${tab === id
                ? "bg-[#c99b4a]/10 text-[#c99b4a]"
                : "text-[#8b8577] hover:text-white hover:bg-white/[0.04]"
                }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/15 transition-colors p-2  rounded-lg "
          >
            <LogOut size={14} />
            {/* Log out */}
          </button>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/[0.07] flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-[#1a1c1f] border border-white/10 flex items-center justify-center text-[12px] font-medium shrink-0">
          {user?.name?.[0]?.toUpperCase() || "—"}
        </div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium truncate">{user?.name}</p>
          <p className="text-[10.5px] text-[#5c584d] truncate font-[family-name:var(--font-mono)]">
            {user?.email}
          </p>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ user }) {
  return (
    <header className="relative h-16 border-b border-white/[0.07] flex items-center justify-end px-8">
      <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#5c584d] uppercase tracking-wider">
        {PLAN_LABELS[user?.plan] || "Free"} · signed in
      </span>
    </header>
  );
}

function Mark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="#c99b4a" strokeWidth="1.6" />
      <path d="M8 12h8M12 8v8" stroke="#c99b4a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- overview tab ---------- */

function OverviewTab() {
  const { data: usersData, isLoading } = useAllUsers();
  const users = useMemo(() => usersData?.users || [], [usersData]);

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === "admin").length;
    const paid = users.filter((u) => u.plan !== "free").length;
    const totalProjects = users.reduce((sum, u) => sum + (u.projectsCreatedCount || 0), 0);
    return { total: users.length, admins, paid, totalProjects };
  }, [users]);

  return (
    <>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#c99b4a] mb-2">
        Platform registry
      </p>
      <h1 className="text-[26px] font-semibold tracking-tight mb-8">Overview</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total users" value={stats.total} />
        <StatCard icon={ShieldCheck} label="Admins" value={stats.admins} accent="#c99b4a" />
        <StatCard icon={Crown} label="Paid accounts" value={stats.paid} accent="#4fd1a5" />
        <StatCard icon={FolderKanban} label="Projects (all)" value={stats.totalProjects} />
      </div>

      <div className="mt-10 rounded-xl border border-white/[0.08] bg-[#0e0f12] p-6">
        <p className="text-[13px] text-[#8b8577] leading-relaxed">
          {isLoading
            ? "Loading recent activity…"
            : `${stats.total} account${stats.total === 1 ? "" : "s"} registered, ${stats.paid} on a paid plan. Head to Users to manage roles, plans, and access.`}
        </p>
      </div>
    </>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0e0f12] p-5">
      <Icon size={13} className="text-[#5c584d] mb-3" />
      <p
        className="font-[family-name:var(--font-mono)] text-[24px] font-medium leading-none mb-1.5"
        style={{ color: accent }}
      >
        {String(value).padStart(2, "0")}
      </p>
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[#5c584d]">
        {label}
      </p>
    </div>
  );
}

/* ---------- users tab ---------- */

function UsersTab({ currentUser }) {
  const { data: usersData, isLoading } = useAllUsers();
  const updateRoleMutation = useUpdateUserRole();
  const updatePlanMutation = useUpdateUserPlan();
  const deleteMutation = useDeleteUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const users = useMemo(() => usersData?.users || [], [usersData]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = (id, role) =>
    updateRoleMutation.mutate(
      { id, role },
      {
        onSuccess: () => toast.success(`Role updated to ${role}`),
        onError: (err) => toast.error(err.message),
      }
    );

  const handlePlanChange = (id, plan) =>
    updatePlanMutation.mutate(
      { id, plan },
      {
        onSuccess: () => toast.success(`Plan updated to ${PLAN_LABELS[plan]}`),
        onError: (err) => toast.error(err.message),
      }
    );

  const handleDelete = (id) =>
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("User deleted");
        setDeleteTarget(null);
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#c99b4a] mb-2">
        Access control
      </p>
      <h1 className="text-[26px] font-semibold tracking-tight mb-8">Users</h1>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px] max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c584d] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full rounded-lg border border-white/[0.08] bg-[#0e0f12] py-2.5 pl-9 pr-3 text-[13px] placeholder:text-[#5c584d] outline-none focus:border-[#c99b4a]/40 transition-colors font-[family-name:var(--font-mono)]"
          />
        </div>

        <div className="flex rounded-lg border border-white/[0.08] bg-[#0e0f12] p-0.5 font-[family-name:var(--font-mono)] text-[11px]">
          {["all", "user", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-md uppercase tracking-wide transition-colors ${roleFilter === r ? "bg-[#c99b4a] text-[#0a0b0d]" : "text-[#8b8577] hover:text-white"
                }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#0e0f12] overflow-hidden">
        <div className="grid grid-cols-[1fr_140px_150px_110px_40px] gap-4 px-5 py-3 border-b border-white/[0.07] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[#5c584d]">
          <span>User</span>
          <span>Role</span>
          <span>Plan</span>
          <span>Projects</span>
          <span />
        </div>

        {isLoading ? (
          <LoadingRows />
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-[13px] text-[#5c584d] font-[family-name:var(--font-mono)]">
            No users match this filter.
          </p>
        ) : (
          filtered.map((u) => (
            <UserRow
              key={u._id}
              user={u}
              isSelf={u._id === currentUser?._id}
              onRoleChange={(role) => handleRoleChange(u._id, role)}
              onPlanChange={(plan) => handlePlanChange(u._id, plan)}
              onDelete={() => setDeleteTarget(u)}
            />
          ))
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete user"
          message={`"${deleteTarget.name}" (${deleteTarget.email}) will be permanently removed.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDelete(deleteTarget._id)}
        />
      )}
    </>
  );
}

function UserRow({ user, isSelf, onRoleChange, onPlanChange, onDelete }) {
  return (
    <div className="grid grid-cols-[1fr_140px_150px_110px_40px] gap-4 px-5 py-4 border-b border-white/[0.05] last:border-b-0 items-center hover:bg-white/[0.015] transition-colors">
      <div className="min-w-0 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-[#1a1c1f] border border-white/10 flex items-center justify-center text-[12px] font-medium shrink-0">
          {user.name?.[0]?.toUpperCase() || "—"}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-medium truncate">
            {user.name}
            {isSelf && <span className="ml-1.5 text-[10px] text-[#5c584d] font-[family-name:var(--font-mono)]">(you)</span>}
          </p>
          <p className="text-[11.5px] text-[#5c584d] truncate font-[family-name:var(--font-mono)]">{user.email}</p>
        </div>
      </div>

      <SelectField value={user.role} disabled={isSelf} onChange={onRoleChange} options={ROLE_OPTIONS} highlight={user.role === "admin"} />
      <SelectField value={user.plan} onChange={onPlanChange} options={PLAN_OPTIONS} labels={PLAN_LABELS} />

      <span className="font-[family-name:var(--font-mono)] text-[13px] text-[#c4c1b8]">
        {user.projectsCreatedCount ?? 0}
      </span>

      <button
        onClick={onDelete}
        disabled={isSelf}
        title={isSelf ? "You can't delete your own account" : "Delete user"}
        className="p-1.5 rounded-md text-[#5c584d] hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#5c584d]"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function SelectField({ value, onChange, options, labels, disabled, highlight }) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-md border px-2.5 py-1.5 pr-7 text-[11.5px] font-[family-name:var(--font-mono)] uppercase tracking-wide outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${highlight ? "border-[#c99b4a]/30 bg-[#c99b4a]/[0.08] text-[#c99b4a]" : "border-white/[0.08] bg-[#14161a] text-[#c4c1b8]"
          }`}
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#14161a] text-[#c4c1b8]">
            {labels ? labels[o] : o}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5c584d] pointer-events-none" />
    </div>
  );
}

function LoadingRows() {
  return (
    <>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="grid grid-cols-[1fr_140px_150px_110px_40px] gap-4 px-5 py-4 border-b border-white/[0.05] last:border-b-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/[0.06] animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-24 rounded-sm bg-white/[0.06] animate-pulse" />
              <div className="h-2 w-32 rounded-sm bg-white/[0.06] animate-pulse" />
            </div>
          </div>
          <div className="h-7 rounded-md bg-white/[0.06] animate-pulse" />
          <div className="h-7 rounded-md bg-white/[0.06] animate-pulse" />
          <div className="h-4 w-6 rounded-sm bg-white/[0.06] animate-pulse" />
          <div />
        </div>
      ))}
    </>
  );
}

/* ---------- settings tab (shared shape, reused in user dashboard too) ---------- */
function SettingsTab({ user }) {
  const updateDetails = useUpdateUserDetails();
  const changePw = useChangePassword();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = () => {
    updateDetails.mutate(
      { name, bio, avatar },
      {
        onSuccess: () => toast.success("Profile updated"),
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Fill in both password fields");
      return;
    }
    changePw.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed");
          setCurrentPassword("");
          setNewPassword("");
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  return (
    <>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#c99b4a] mb-2">
        Your account
      </p>
      <h1 className="text-[26px] font-semibold tracking-tight mb-8">Settings</h1>

      <div className="space-y-6 max-w-xl">
        {/* profile */}
        <section className="rounded-xl border border-white/[0.08] bg-[#0e0f12] p-6">
          <h2 className="text-[14px] font-semibold mb-1">Profile</h2>
          <p className="text-[12px] text-[#5c584d] mb-5">Public details for your account.</p>

          <div className="space-y-4">
            <Field label="Full name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Email">
              <input value={user?.email || ""} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
            </Field>
            <Field label="Avatar URL">
              <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://…" className={inputClass} />
            </Field>
            <Field label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={updateDetails.isPending}
            className="mt-5 inline-flex items-center gap-2 bg-[#c99b4a] hover:bg-[#d9ab5c] disabled:opacity-40 text-[#0a0b0d] transition-colors px-4 py-2.5 rounded-lg text-[13px] font-semibold"
          >
            <Save size={14} />
            {updateDetails.isPending ? "Saving…" : "Save changes"}
          </button>
        </section>

        {/* password */}
        <section className="rounded-xl border border-white/[0.08] bg-[#0e0f12] p-6">
          <h2 className="text-[14px] font-semibold mb-1">Password</h2>
          <p className="text-[12px] text-[#5c584d] mb-5">Update your account password.</p>

          <div className="space-y-4">
            <Field label="Current password">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="New password">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={changePw.isPending}
            className="mt-5 inline-flex items-center gap-2 border border-white/[0.1] hover:bg-white/[0.04] disabled:opacity-40 transition-colors px-4 py-2.5 rounded-lg text-[13px] font-semibold"
          >
            <KeyRound size={14} />
            {changePw.isPending ? "Updating…" : "Update password"}
          </button>
        </section>

        {/* session */}
        <section className="rounded-xl border border-red-500/15 bg-red-500/[0.03] p-6">
          <h2 className="text-[14px] font-semibold mb-1">Session</h2>
          <p className="text-[12px] text-[#5c584d] mb-5">Sign out of CraftSite on this device.</p>

          <button
            // onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-red-500/90 hover:bg-red-500 transition-colors px-4 py-2.5 rounded-lg text-[13px] font-semibold"
          >
            <LogOut size={14} />
            Log out
          </button>
        </section>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11.5px] font-medium text-[#8b8577] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/[0.08] bg-[#14161a] px-3.5 py-2.5 text-[13px] text-[#e8e6df] placeholder:text-[#5c584d] outline-none focus:border-[#c99b4a]/40 transition-colors";

function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div onClick={onCancel} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl border border-white/[0.08] bg-[#0e0f12] p-6 shadow-2xl">
        <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-red-400/80 mb-2">
          Cannot be undone
        </p>
        <h3 className="text-[19px] font-semibold mb-2">{title}</h3>
        <p className="text-[13px] text-[#8b8577] mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg text-[13px] font-medium border border-white/[0.08] hover:bg-white/[0.03] transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold bg-red-500/90 hover:bg-red-500 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}