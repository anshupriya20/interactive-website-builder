"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import {
  Plus,
  MoreVertical,
  Trash2,
  Rocket,
  ExternalLink,
  Search,
  X,
  ArrowUpRight,
  LayoutGrid,
  Settings,
  LogOut,
  Save,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useCurrentUser,
  useProjects,
  useCreateProject,
  useDeleteProject,
  usePublishProject,
  useLogout,
  useUpdateUserDetails,
  useChangePassword,
} from "../../lib/queries";

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });

const PLAN_LABELS = { free: "Free", pro: "Pro", proYearly: "Pro · Annual" };
const FREE_LIMIT = 3;

export default function UserDashboardPage() {
  const [tab, setTab] = useState("projects");
  const { data: userData } = useCurrentUser();
  const user = userData?.user;

  return (
    <div className={`${mono.variable} ${grotesk.variable} min-h-screen bg-[#0a0b0d] text-[#e8e6df] font-[family-name:var(--font-sans)] flex`}>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#c99b4a 1px, transparent 1px), linear-gradient(90deg, #c99b4a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Sidebar tab={tab} setTab={setTab} user={user} />

      <div className="relative flex-1 min-w-0">
        <TopBar user={user} />
        <main className="px-10 py-10 max-w-5xl">
          {tab === "projects" && <ProjectsTab />}
          {tab === "settings" && <SettingsTab user={user} />}
        </main>
      </div>
    </div>
  );
}

/* ---------- shell ---------- */

function Sidebar({ tab, setTab, user }) {
  const items = [
    { id: "projects", label: "Projects", icon: LayoutGrid },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="relative w-60 shrink-0 border-r border-white/[0.07] flex flex-col">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-white/[0.07]">
        <Mark />
        <span className="text-[15px] font-semibold tracking-tight">CraftSite</span>
      </div>

      <nav className="px-4 pt-5 space-y-1">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
              tab === id ? "bg-[#c99b4a]/10 text-[#c99b4a]" : "text-[#8b8577] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-white/[0.07] flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-full bg-[#1a1c1f] border border-white/10 flex items-center justify-center text-[12px] font-medium shrink-0">
          {user?.name?.[0]?.toUpperCase() || "—"}
        </div>
        <div className="min-w-0">
          <p className="text-[12.5px] font-medium truncate">{user?.name}</p>
          <p className="text-[10.5px] text-[#5c584d] truncate font-[family-name:var(--font-mono)]">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ user }) {
  return (
    <header className="relative h-16 border-b border-white/[0.07] flex items-center justify-end px-8">
      <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#5c584d] uppercase tracking-wider">
        {PLAN_LABELS[user?.plan] || "Free"} plan
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

/* ---------- projects tab ---------- */

function ProjectsTab() {
  const router = useRouter();
  const { data: userData, isLoading: userLoading } = useCurrentUser();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();

  const createMutation = useCreateProject();
  const deleteMutation = useDeleteProject();
  const publishMutation = usePublishProject();

  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const user = userData?.user;
  const projects = useMemo(() => projectsData?.projects || [], [projectsData]);
  const limit = user?.plan === "free" ? FREE_LIMIT : Infinity;
  const used = user?.projectsCreatedCount ?? 0;
  const atLimit = used >= limit;
  const pct = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    return projects.filter((p) => p.projectName.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  const published = projects.filter((p) => p.isPublished).length;

  const handleCreate = () => {
    if (atLimit) {
      toast.error("Free plan limit reached — upgrade to add more projects.");
      return;
    }
    createMutation.mutate(
      { projectName: newName.trim() || "Untitled Project" },
      {
        onSuccess: (data) => {
          toast.success("Project created");
          setShowCreate(false);
          setNewName("");
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
    setOpenMenuId(null);
  };

  const loading = userLoading || projectsLoading;

  return (
    <>
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#c99b4a] mb-2">
            {greeting()} · {dateLabel()}
          </p>
          <h1 className="text-[26px] font-semibold tracking-tight">
            {user?.name ? `${user.name.split(" ")[0]}'s workspace` : "Your workspace"}
          </h1>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 bg-[#c99b4a] hover:bg-[#d9ab5c] text-[#0a0b0d] transition-colors px-4 py-2.5 rounded-lg text-[13px] font-semibold"
        >
          <Plus size={15} strokeWidth={2.5} />
          New project
        </button>
      </div>

      <div className="mb-8 rounded-xl border border-white/[0.08] bg-[#0e0f12] overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          <SpecCell label="Total" value={projects.length} />
          <SpecCell label="Published" value={published} accent="#4fd1a5" />
          <SpecCell label="Drafts" value={projects.length - published} />
          <UsageGauge plan={user?.plan} used={used} limit={limit} pct={pct} atLimit={atLimit} />
        </div>
      </div>

      {projects.length > 0 && (
        <div className="relative mb-6 max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5c584d] pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter projects"
            className="w-full rounded-lg border border-white/[0.08] bg-[#0e0f12] py-2.5 pl-9 pr-3 text-[13px] placeholder:text-[#5c584d] outline-none focus:border-[#c99b4a]/40 transition-colors font-[family-name:var(--font-mono)]"
          />
        </div>
      )}

      {loading ? (
        <LoadingRows />
      ) : projects.length === 0 ? (
        <EmptyState onCreate={() => setShowCreate(true)} />
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-sm text-[#5c584d] font-[family-name:var(--font-mono)]">
          No matches for &ldquo;{search}&rdquo;
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              menuOpen={openMenuId === project._id}
              onToggleMenu={() => setOpenMenuId(openMenuId === project._id ? null : project._id)}
              onOpen={() => router.push(`/builder/${project._id}`)}
              onPublish={() => handlePublish(project._id)}
              onDelete={() => {
                setDeleteTarget(project);
                setOpenMenuId(null);
              }}
              publishing={publishMutation.isPending}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showCreate && (
          <Modal onClose={() => setShowCreate(false)}>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[#c99b4a] mb-2">
              New project
            </p>
            <h3 className="text-[19px] font-semibold mb-5">Name your site</h3>

            {atLimit ? (
              <div className="rounded-lg border border-[#c99b4a]/25 bg-[#c99b4a]/[0.06] p-4 text-[13px] text-[#e0c890] leading-relaxed">
                You&apos;ve used {limit}/{limit} projects on the Free plan. Upgrade to keep building.
              </div>
            ) : (
              <>
                <input
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="Portfolio, Startup Landing…"
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0e0f12] px-4 py-3 text-[14px] placeholder:text-[#5c584d] outline-none focus:border-[#c99b4a]/40 transition-colors mb-5"
                />
                <button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                  className="w-full bg-[#c99b4a] hover:bg-[#d9ab5c] disabled:opacity-40 text-[#0a0b0d] transition-colors py-3 rounded-lg text-[13px] font-semibold"
                >
                  {createMutation.isPending ? "Creating…" : "Create project"}
                </button>
              </>
            )}
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <Modal onClose={() => setDeleteTarget(null)}>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-red-400/80 mb-2">
              Cannot be undone
            </p>
            <h3 className="text-[19px] font-semibold mb-2">Delete project</h3>
            <p className="text-[13px] text-[#8b8577] mb-6 leading-relaxed">
              &ldquo;{deleteTarget.projectName}&rdquo; and all its pages will be permanently removed.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-medium border border-white/[0.08] hover:bg-white/[0.03] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget._id)}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold bg-red-500/90 hover:bg-red-500 disabled:opacity-40 transition-colors"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
function dateLabel() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SpecCell({ label, value, accent }) {
  return (
    <div className="px-5 py-4 border-r border-white/[0.06] last:border-r-0">
      <p className="font-[family-name:var(--font-mono)] text-[22px] font-medium leading-none mb-1.5" style={{ color: accent }}>
        {String(value).padStart(2, "0")}
      </p>
      <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[#5c584d]">{label}</p>
    </div>
  );
}

function UsageGauge({ plan, used, limit, pct, atLimit }) {
  const isFree = plan === "free" || !plan;
  const r = 15;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="px-5 py-4 flex items-center gap-3">
      {isFree ? (
        <>
          <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90 shrink-0">
            <circle cx="20" cy="20" r={r} fill="none" stroke="#1c1e22" strokeWidth="3" />
            <circle
              cx="20" cy="20" r={r} fill="none"
              stroke={atLimit ? "#e0904f" : "#c99b4a"}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.4s ease" }}
            />
          </svg>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[13px] leading-none mb-1.5">
              {used}<span className="text-[#5c584d]">/{limit}</span>
            </p>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[#5c584d]">Used</p>
          </div>
        </>
      ) : (
        <>
          <div className="h-10 w-10 rounded-full border border-[#c99b4a]/30 flex items-center justify-center shrink-0">
            <span className="text-[#c99b4a] text-[15px]">∞</span>
          </div>
          <div>
            <p className="font-[family-name:var(--font-mono)] text-[13px] leading-none mb-1.5">Unlimited</p>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.1em] text-[#5c584d]">Capacity</p>
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({ project, menuOpen, onToggleMenu, onOpen, onPublish, onDelete, publishing }) {
  return (
    <div className="group relative rounded-xl border border-white/[0.08] bg-[#0e0f12] hover:border-[#c99b4a]/25 transition-colors ">
      <button onClick={onOpen} className="block w-full aspect-[16/10] relative bg-[#0a0b0d]">
        {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((pos, i) => (
          <span key={i} className={`absolute ${pos} h-3 w-3 border-[#c99b4a] opacity-0 group-hover:opacity-100 transition-opacity duration-200`} style={{ transitionDelay: `${i * 30}ms` }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 space-y-1.5 opacity-30">
            <div className="h-1.5 w-1/2 rounded-sm bg-[#8b8577]" />
            <div className="h-1.5 w-full rounded-sm bg-[#3a3d43]" />
            <div className="h-1.5 w-3/4 rounded-sm bg-[#3a3d43]" />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 text-[11px] font-medium bg-[#c99b4a] text-[#0a0b0d] px-3 py-1.5 rounded-md">
            Open <ArrowUpRight size={12} strokeWidth={2.5} />
          </span>
        </div>
      </button>

      <div className="p-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium truncate mb-1">{project.projectName}</p>
          <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10.5px]">
            <span className={`h-1.5 w-1.5 rounded-full ${project.isPublished ? "bg-[#4fd1a5]" : "bg-[#5c584d]"}`} />
            <span className={project.isPublished ? "text-[#4fd1a5]" : "text-[#5c584d]"}>{project.isPublished ? "LIVE" : "DRAFT"}</span>
            <span className="text-[#3a3d43]">·</span>
            <span className="text-[#5c584d]">{timeAgo(project.updatedAt)}</span>
          </div>
        </div>

        <div className="relative shrink-0">
          <button onClick={onToggleMenu} className="p-1.5 rounded-md text-[#5c584d] hover:text-white hover:bg-white/[0.06] transition-colors">
            <MoreVertical size={15} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-9 z-10 w-40 rounded-lg border border-white/[0.08] bg-[#14161a] shadow-2xl py-1"
              >
                <MenuItem icon={ExternalLink} label="Open" onClick={onOpen} />
                <MenuItem icon={Rocket} label={publishing ? "Publishing…" : "Publish"} onClick={onPublish} disabled={publishing} />
                <div className="h-px bg-white/[0.06] my-1" />
                <MenuItem icon={Trash2} label="Delete" onClick={onDelete} danger />
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
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-left transition-colors disabled:opacity-40 ${
        danger ? "text-red-400 hover:bg-red-500/10" : "text-[#c4c1b8] hover:bg-white/[0.05]"
      }`}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-xl border border-dashed border-white/[0.08]">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="mb-5">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#c99b4a" strokeWidth="1.3" opacity="0.5" />
        <path d="M8 12h8M12 8v8" stroke="#c99b4a" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <h3 className="text-[16px] font-semibold mb-1.5">Nothing on the bench yet</h3>
      <p className="text-[13px] text-[#5c584d] mb-6 max-w-xs leading-relaxed">Start from a blank canvas — your first project is one click away.</p>
      <button onClick={onCreate} className="inline-flex items-center gap-2 bg-[#c99b4a] hover:bg-[#d9ab5c] text-[#0a0b0d] transition-colors px-5 py-2.5 rounded-lg text-[13px] font-semibold">
        <Plus size={15} strokeWidth={2.5} />
        Create your first project
      </button>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-xl border border-white/[0.08] bg-[#0e0f12] overflow-hidden">
          <div className="aspect-[16/10] bg-[#0a0b0d] animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-2.5 w-2/3 rounded-sm bg-white/[0.06] animate-pulse" />
            <div className="h-2 w-1/3 rounded-sm bg-white/[0.06] animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.16 }} onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-xl border border-white/[0.08] bg-[#0e0f12] p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-[#5c584d] hover:text-white transition-colors">
          <X size={16} />
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
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString();
}

/* ---------- settings tab ---------- */

function SettingsTab({ user }) {
  const router = useRouter();
  const updateDetails = useUpdateUserDetails();
  const changePw = useChangePassword();
  const logoutMutation = useLogout();

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

  const handleLogout = () => {
    logoutMutation.mutate(undefined, { onSuccess: () => router.push("/login") });
  };

  return (
    <>
      <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[#c99b4a] mb-2">
        Your account
      </p>
      <h1 className="text-[26px] font-semibold tracking-tight mb-8">Settings</h1>

      <div className="space-y-6 max-w-xl">
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
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
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

        <section className="rounded-xl border border-white/[0.08] bg-[#0e0f12] p-6">
          <h2 className="text-[14px] font-semibold mb-1">Password</h2>
          <p className="text-[12px] text-[#5c584d] mb-5">Update your account password.</p>

          <div className="space-y-4">
            <Field label="Current password">
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
            </Field>
            <Field label="New password">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
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

        <section className="rounded-xl border border-red-500/15 bg-red-500/[0.03] p-6">
          <h2 className="text-[14px] font-semibold mb-1">Session</h2>
          <p className="text-[12px] text-[#5c584d] mb-5">Sign out of CraftSite on this device.</p>

          <button
            onClick={handleLogout}
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