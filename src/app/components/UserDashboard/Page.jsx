"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    MoreVertical,
    ExternalLink,
    Trash2,
    Rocket,
    Pencil,
    Search,
    LayoutGrid,
    Clock,
    Globe,
    FileText,
    Sparkles,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    useCurrentUser,
    useProjects,
    useCreateProject,
    useDeleteProject,
    usePublishProject,
} from "../../lib/queries";

const PLAN_LABELS = {
    free: "Free",
    pro: "Pro",
    proYearly: "Pro (Yearly)",
};

const FREE_LIMIT = 3;

export default function DashboardPage() {
    const router = useRouter();
    const { data: userData, isLoading: userLoading } = useCurrentUser();
    const { data: projectsData, isLoading: projectsLoading } = useProjects();

    const createMutation = useCreateProject();
    const deleteMutation = useDeleteProject();
    const publishMutation = usePublishProject();

    const [search, setSearch] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const user = userData?.user;
    const projects = useMemo(() => projectsData?.projects || [], [projectsData]);

    const limit = user?.plan === "free" ? FREE_LIMIT : Infinity;
    const usedCount = user?.projectsCreatedCount ?? 0;
    const atLimit = usedCount >= limit;
    const usagePct = limit === Infinity ? 0 : Math.min(100, (usedCount / limit) * 100);

    const filteredProjects = useMemo(() => {
        if (!search.trim()) return projects;
        return projects.filter((p) =>
            p.projectName.toLowerCase().includes(search.toLowerCase())
        );
    }, [projects, search]);

    const stats = useMemo(() => {
        const published = projects.filter((p) => p.isPublished).length;
        const drafts = projects.length - published;
        return { total: projects.length, published, drafts };
    }, [projects]);

    const handleCreate = () => {
        if (atLimit) {
            toast.error("Free plan limit reached. Upgrade to create more projects.");
            return;
        }
        createMutation.mutate(
            { projectName: newProjectName.trim() || "Untitled Project" },
            {
                onSuccess: (data) => {
                    toast.success("Project created");
                    setShowCreateModal(false);
                    setNewProjectName("");
                    router.push(`/builder/${data.project._id}`);
                },
                onError: (err) => toast.error(err.message),
            }
        );
    };

    const handleDelete = (id) => {
        deleteMutation.mutate(id, {
            onSuccess: () => {
                toast.success("Project deleted");
                setDeleteTarget(null);
            },
            onError: (err) => toast.error(err.message),
        });
    };

    const handlePublish = (id) => {
        publishMutation.mutate(id, {
            onSuccess: () => toast.success("Project published"),
            onError: (err) => toast.error(err.message),
        });
        setActiveMenuId(null);
    };

    const loading = userLoading || projectsLoading;

    return (
        <div className="min-h-screen bg-black text-white">
            {/* ── Top bar ── */}
            <header className="border-b border-zinc-800 bg-[#0a0a0a]">
                <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
                    <h1 className="font-bold text-xl">
                        Craft<span className="text-indigo-400">Site</span>
                    </h1>

                    <div className="flex items-center gap-3">
                        {user && (
                            <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${user.plan === "free" ? "bg-zinc-500" : "bg-indigo-400"
                                        }`}
                                />
                                {PLAN_LABELS[user.plan] || "Free"} plan
                            </span>
                        )}
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
                            {user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-10">
                {/* ── Greeting + primary action ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm text-zinc-500 mb-1">
                            {greeting()}
                            {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                        </p>
                        <h2 className="text-2xl font-semibold">Your projects</h2>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0"
                    >
                        <Plus size={16} />
                        New Project
                    </button>
                </div>

                {/* ── Stats row ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <StatCard icon={LayoutGrid} label="Total projects" value={stats.total} />
                    <StatCard icon={Globe} label="Published" value={stats.published} />
                    <StatCard icon={FileText} label="Drafts" value={stats.drafts} />
                    <PlanUsageCard
                        plan={user?.plan}
                        usedCount={usedCount}
                        limit={limit}
                        usagePct={usagePct}
                        atLimit={atLimit}
                    />
                </div>

                {/* ── Search ── */}
                {projects.length > 0 && (
                    <div className="relative mb-6 max-w-sm">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search projects"
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                )}

                {/* ── Content ── */}
                {loading ? (
                    <LoadingGrid />
                ) : projects.length === 0 ? (
                    <EmptyState onCreate={() => setShowCreateModal(true)} />
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 text-sm">
                        No projects match &ldquo;{search}&rdquo;.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                menuOpen={activeMenuId === project._id}
                                onToggleMenu={() =>
                                    setActiveMenuId(activeMenuId === project._id ? null : project._id)
                                }
                                onOpen={() => router.push(`/builder/${project._id}`)}
                                onPublish={() => handlePublish(project._id)}
                                onDelete={() => {
                                    setDeleteTarget(project);
                                    setActiveMenuId(null);
                                }}
                                publishing={publishMutation.isPending}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* ── Create modal ── */}
            <AnimatePresence>
                {showCreateModal && (
                    <Modal onClose={() => setShowCreateModal(false)}>
                        <h3 className="text-lg font-semibold mb-1">New project</h3>
                        <p className="text-sm text-zinc-500 mb-5">
                            Give your site a name. You can change this anytime.
                        </p>

                        {atLimit ? (
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                                You&apos;ve used all {limit} projects on the Free plan. Upgrade to
                                create more.
                            </div>
                        ) : (
                            <>
                                <input
                                    autoFocus
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                    placeholder="e.g. Portfolio, Startup Landing"
                                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 mb-5"
                                />
                                <button
                                    onClick={handleCreate}
                                    disabled={createMutation.isPending}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all py-3 rounded-xl text-sm font-semibold"
                                >
                                    {createMutation.isPending ? "Creating..." : "Create project"}
                                </button>
                            </>
                        )}
                    </Modal>
                )}
            </AnimatePresence>

            {/* ── Delete confirm modal ── */}
            <AnimatePresence>
                {deleteTarget && (
                    <Modal onClose={() => setDeleteTarget(null)}>
                        <h3 className="text-lg font-semibold mb-1">Delete project?</h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            &ldquo;{deleteTarget.projectName}&rdquo; will be permanently deleted.
                            This can&apos;t be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-3 rounded-xl text-sm font-medium border border-zinc-800 hover:bg-zinc-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteTarget._id)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-colors"
                            >
                                {deleteMutation.isPending ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ---------- pieces ---------- */

function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
}

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
            <Icon size={16} className="text-zinc-500 mb-3" />
            <p className="text-2xl font-semibold leading-none mb-1">{value}</p>
            <p className="text-xs text-zinc-500">{label}</p>
        </div>
    );
}

function PlanUsageCard({ plan, usedCount, limit, usagePct, atLimit }) {
    const isFree = plan === "free" || !plan;
    return (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-3">
                <Sparkles size={16} className="text-zinc-500" />
                {isFree && atLimit && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                        Limit reached
                    </span>
                )}
            </div>
            {isFree ? (
                <>
                    <p className="text-2xl font-semibold leading-none mb-1">
                        {usedCount}
                        <span className="text-sm text-zinc-500">/{limit}</span>
                    </p>
                    <p className="text-xs text-zinc-500 mb-2">Projects used</p>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${atLimit ? "bg-amber-500" : "bg-indigo-500"
                                }`}
                            style={{ width: `${usagePct}%` }}
                        />
                    </div>
                </>
            ) : (
                <>
                    <p className="text-2xl font-semibold leading-none mb-1">∞</p>
                    <p className="text-xs text-zinc-500">Unlimited projects</p>
                </>
            )}
        </div>
    );
}

function ProjectCard({
    project,
    menuOpen,
    onToggleMenu,
    onOpen,
    onPublish,
    onDelete,
    publishing,
}) {
    return (
        <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors overflow-hidden">
            {/* thumbnail area */}
            <button
                onClick={onOpen}
                className="block w-full aspect-[16/10] bg-[#0d0d0d] relative overflow-hidden"
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 space-y-2 opacity-40">
                        <div className="h-2 w-1/2 rounded bg-zinc-700" />
                        <div className="h-2 w-full rounded bg-zinc-800" />
                        <div className="h-2 w-3/4 rounded bg-zinc-800" />
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className="h-8 rounded bg-zinc-800" />
                            <div className="h-8 rounded bg-zinc-800" />
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white text-black px-3 py-1.5 rounded-lg">
                        <ExternalLink size={12} />
                        Open in builder
                    </span>
                </div>
            </button>

            {/* meta row */}
            <div className="p-4 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{project.projectName}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span
                            className={`inline-flex items-center gap-1 text-[11px] ${project.isPublished ? "text-emerald-400" : "text-zinc-500"
                                }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${project.isPublished ? "bg-emerald-400" : "bg-zinc-600"
                                    }`}
                            />
                            {project.isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="text-zinc-700">·</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                            <Clock size={10} />
                            {timeAgo(project.updatedAt)}
                        </span>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <button
                        onClick={onToggleMenu}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                transition={{ duration: 0.12 }}
                                className="absolute right-0 top-9 z-10 w-44 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl py-1"
                            >
                                <MenuItem icon={Pencil} label="Open" onClick={onOpen} />
                                <MenuItem
                                    icon={Rocket}
                                    label={publishing ? "Publishing..." : "Publish"}
                                    onClick={onPublish}
                                    disabled={publishing}
                                />
                                <div className="h-px bg-zinc-800 my-1" />
                                <MenuItem
                                    icon={Trash2}
                                    label="Delete"
                                    onClick={onDelete}
                                    danger
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function MenuItem({ icon: Icon, label, onClick, danger, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors disabled:opacity-50 ${danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
        >
            <Icon size={14} />
            {label}
        </button>
    );
}

function EmptyState({ onCreate }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24 rounded-2xl border border-dashed border-zinc-800">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                <Sparkles size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No projects yet</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">
                Start with a blank canvas or a template — your first site is a few
                clicks away.
            </p>
            <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
                <Plus size={16} />
                Create your first project
            </button>
        </div>
    );
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden"
                >
                    <div className="aspect-[16/10] bg-zinc-900 animate-pulse" />
                    <div className="p-4 space-y-2">
                        <div className="h-3 w-2/3 rounded bg-zinc-800 animate-pulse" />
                        <div className="h-2 w-1/3 rounded bg-zinc-800 animate-pulse" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Modal({ children, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>
                {children}
            </motion.div>
        </motion.div>
    );
}

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}