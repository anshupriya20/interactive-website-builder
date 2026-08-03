"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Fraunces, Space_Grotesk } from "next/font/google";

import { useRouter } from 'next/navigation';

import { useLogin, useRegister } from "../../lib/queries";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.4, ease: easeOut },
  }),
};

const paneVariants = {
  enter: (dir) => ({ opacity: 0, x: dir * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: easeOut } },
  exit: (dir) => ({
    opacity: 0,
    x: dir * -24,
    transition: { duration: 0.25, ease: easeOut },
  }),
};

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const uid = useId();

  const dir = mode === "register" ? 1 : -1;
  const strength = getStrength(regPassword);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "login") {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => router.replace("/dashboard"),
        }
      );
    } else {
      registerMutation.mutate(
        { name: regName, email: regEmail, password: regPassword },
        {
          onSuccess: () => router.replace("/dashboard"),
        }
      );
    }
  };


  return (
    <div
      className={`${fraunces.variable} ${grotesk.variable} relative min-h-screen w-full overflow-hidden bg-[#0d0e1a] font-[family-name:var(--font-body)]`}
    >
      {/* ambient premium background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(212,162,76,0.22),_transparent_65%)] blur-2xl"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-200px] right-[-160px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,_rgba(62,98,89,0.28),_transparent_65%)] blur-2xl"
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,14,26,0)_0%,rgba(13,14,26,0.7)_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="grid w-full max-w-[1100px] grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 shadow-[0_60px_140px_-40px_rgba(0,0,0,0.7)] md:grid-cols-[1.05fr_1fr]">
          {/* LEFT — journey panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(165deg,#1b1f3b_0%,#12142a_100%)] p-11 md:flex">
            <div className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M18 5 A9 9 0 1 0 18 19" stroke="#fcf8ff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                <path d="M15.5 7.5 A6 6 0 1 0 15.5 16.5" stroke="#fcf8ff" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.55" />
              </svg>
              <span className="font-[family-name:var(--font-display)] text-[19px] font-semibold text-[#f7f4ec]">
                Craft<span className="text-indigo-400">Site</span>
              </span>
            </div>

            <div className="max-w-[340px]">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#818cf8]/80">
                CraftSite · Build & Launch
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[30px] font-medium italic leading-[1.3] text-[#f7f4ec]">
                Every great website starts with a single block, not the full blueprint.
              </h1>
            </div>

            <RouteAnimation />
          </div>

          {/* RIGHT — glass auth card */}
          <div className="relative bg-[#12142a]/70 p-8 backdrop-blur-2xl sm:p-11">
            <div className="mb-7 flex items-center gap-7 border-b border-white/10">
              {["login", "register"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`relative pb-3.5 text-[15px] font-medium transition-colors ${mode === m ? "text-[#f7f4ec]" : "text-white/35 hover:text-white/60"
                    }`}
                >
                  {m === "login" ? "Log in" : "Sign up"}
                  {mode === m && (
                    <motion.span
                      layoutId="tab-indicator"
                      className="absolute -bottom-px left-0 h-[2px] w-full rounded-full bg-[#d4a24c]"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait" custom={dir} initial={false}>
              {mode === "login" ? (
                <motion.div
                  key="login"
                  custom={dir}
                  variants={paneVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <Header
                    title="Welcome back to CraftSite"
                    subtitle="Your canvas is waiting. Let's keep building."
                  />
                  <OAuthRow />
                  <Divider label="or continue with email" />

                  <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <Field custom={0} label="Email" htmlFor={`${uid}-l-email`}>
                      <input
                        id={`${uid}-l-email`}
                        type="email"
                        required
                        placeholder="you@example.com"
                        className={inputClass}
                        value={email} onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>

                    <Field custom={1} label="Password" htmlFor={`${uid}-l-pw`}>
                      <div className="relative">
                        <input
                          id={`${uid}-l-pw`}
                          type={showLoginPw ? "text" : "password"}
                          required
                          placeholder="Enter your password"
                          className={inputClass}
                          value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                        <PwToggle
                          shown={showLoginPw}
                          onClick={() => setShowLoginPw((s) => !s)}
                        />
                      </div>
                    </Field>

                    <motion.div
                      custom={2}
                      variants={fieldVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center justify-between text-[13px]"
                    >
                      <label className="flex items-center gap-2 text-white/55">
                        <input
                          type="checkbox"
                          className="h-[15px] w-[15px] accent-[#3e6259]"
                        />
                        Remember me
                      </label>
                      <a href="#" className="font-medium text-[#8fb6ab] hover:underline">
                        Forgot password?
                      </a>
                    </motion.div>

                    <SubmitButton custom={3} label="Log in" />
                    {loginMutation.isError && (
                      <p className="text-sm text-red-400">{loginMutation.error.message}</p>
                    )}                  </form>

                  <SwitchLine
                    custom={4}
                    prompt="New to CraftSite?"
                    action="Create an account"
                    onClick={() => setMode("register")}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  custom={dir}
                  variants={paneVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <Header
                    title="Build your first site"
                    subtitle="Set up your account and start creating in seconds."
                  />
                  <OAuthRow registering />
                  <Divider label="or use your email" />

                  <form
                    className="flex flex-col gap-4"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    <Field custom={0} label="Full name" htmlFor={`${uid}-r-name`}>
                      <input
                        id={`${uid}-r-name`}
                        type="text"
                        required
                        placeholder="Your name"
                        className={inputClass}
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                      />
                    </Field>

                    <Field custom={1} label="Email" htmlFor={`${uid}-r-email`}>
                      <input
                        id={`${uid}-r-email`}
                        type="email"
                        required
                        placeholder="you@example.com"
                        className={inputClass}
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </Field>

                    <Field custom={2} label="Password" htmlFor={`${uid}-r-pw`}>
                      <div className="relative">
                        <input
                          id={`${uid}-r-pw`}
                          type={showRegPw ? "text" : "password"}
                          required
                          placeholder="Create a password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className={inputClass}
                        />
                        <PwToggle
                          shown={showRegPw}
                          onClick={() => setShowRegPw((s) => !s)}
                        />
                      </div>
                      <div className="mt-1.5 flex gap-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.span
                            key={i}
                            className="h-[3px] flex-1 rounded-full bg-white/10"
                            animate={{
                              backgroundColor:
                                i < strength.score
                                  ? strength.color
                                  : "rgba(255,255,255,0.1)",
                            }}
                            transition={{ duration: 0.25 }}
                          />
                        ))}
                      </div>
                    </Field>

                    <SubmitButton custom={3} label="Create account" />
                    {registerMutation.isError && (
                      <p className="text-sm text-red-400">{registerMutation.error.message}</p>
                    )}

                  </form>

                  <SwitchLine
                    custom={4}
                    prompt="Already have an account?"
                    action="Log in"
                    onClick={() => setMode("login")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- shared bits ---------- */

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-[14.5px] text-[#f7f4ec] placeholder:text-white/25 outline-none transition focus:border-[#6f9a8e] focus:bg-white/[0.06] focus:ring-4 focus:ring-[#3e6259]/25";

function Header({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="font-[family-name:var(--font-display)] text-[25px] font-medium text-[#f7f4ec]">
        {title}
      </h2>
      <p className="mt-1 text-[14px] text-white/45">{subtitle}</p>
    </div>
  );
}

function Field({ label, htmlFor, children, custom }) {
  return (
    <motion.div
      custom={custom}
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-1.5"
    >
      <label htmlFor={htmlFor} className="text-[12.5px] font-medium text-white/60">
        {label}
      </label>
      {children}
    </motion.div>
  );
}

function PwToggle({ shown, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={shown ? "Hide password" : "Show password"}
      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/35 transition hover:text-white/70"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={shown ? "on" : "off"}
          initial={{ opacity: 0, rotate: -8 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 8 }}
          transition={{ duration: 0.15 }}
          className="flex"
        >
          {shown ? <EyeOff size={17} /> : <Eye size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function SubmitButton({ label, custom, pending }) {
  return (
    <motion.button
      custom={custom}
      variants={fieldVariants}
      disabled={pending}
      initial="hidden"
      animate="visible"
      type="submit"
      whileHover={{ y: -1 }}
      whileTap={{ y: 0, scale: 0.99 }}
      className="group relative mt-1 flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#fcf8ff] to-[#818cf8] px-5 py-3.5 text-[14.5px] font-semibold text-[#1b1f3b] shadow-[0_10px_30px_-10px_rgba(0, 0, 0, 0.2))]"
    >
      <span className="relative z-10">{pending ? "Please wait..." : label}</span>

      <ArrowRight
        size={16}
        className="relative z-10 transition-transform duration-200 group-hover:translate-x-1"
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-white/25"
        style={{ maskImage: "linear-gradient(75deg, transparent 40%, black 50%, transparent 60%)" }}
        animate={{ x: ["-100%", "160%"] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
      />
    </motion.button>
  );
}

function SwitchLine({ prompt, action, onClick, custom }) {
  return (
    <motion.p
      custom={custom}
      variants={fieldVariants}
      initial="hidden"
      animate="visible"
      className="mt-5 text-center text-[13.5px] text-white/45"
    >
      {prompt}{" "}
      <button
        type="button"
        onClick={onClick}
        className="font-semibold text-[#8fb6ab] hover:underline"
      >
        {action}
      </button>
    </motion.p>
  );
}

function Divider({ label }) {
  return (
    <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.06em] text-white/30">
      <span className="h-px flex-1 bg-white/10" />
      {label}
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function OAuthRow({ registering = false }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        aria-label={registering ? "Sign up with Google" : "Continue with Google"}
        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[14px] font-medium text-[#f7f4ec] transition hover:border-white/25 hover:bg-white/[0.07]"
      >
        <svg viewBox="0 0 18 18" width="17" height="17">
          <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z" />
          <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.98v2.33A9 9 0 0 0 9 18z" />
          <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.03l2.97-2.33z" />
          <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.97l2.97 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
        </svg>
        Google
      </motion.button>

      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        aria-label={registering ? "Sign up with GitHub" : "Continue with GitHub"}
        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[14px] font-medium text-[#f7f4ec] transition hover:border-white/25 hover:bg-white/[0.07]"
      >
        <svg viewBox="0 0 24 24" width="17" height="17">
          <path
            fill="#f7f4ec"
            d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.52-1.33-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a10.98 10.98 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .32.21.67.8.56A10.97 10.97 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"
          />
        </svg>
        GitHub
      </motion.button>
    </div>
  );
}

function RouteAnimation() {
  return (
    <div className="relative mt-8">
      <svg viewBox="0 0 380 190" className="w-full">
        <motion.path
          d="M20,150 C90,150 70,60 140,60 C200,60 190,130 250,130 C300,130 300,40 360,40"
          fill="none"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: easeOut, delay: 0.2 }}
        />
        {[
          { x: 20, y: 150, label: "Depart", dx: 14, dy: 4, delay: 0.9 },
          { x: 200, y: 60, label: "Évora, overnight", dx: 14, dy: 4, delay: 1.5 },
          { x: 360, y: 40, label: "Arrive Faro", dx: -52, dy: -14, delay: 2.1 },
        ].map((wp, i) => (
          <motion.g
            key={i}
            transform={`translate(${wp.x},${wp.y})`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: wp.delay, duration: 0.4 }}
          >
            <circle r="9" fill="none" stroke="#818cf8" strokeWidth="1.4" opacity="0.5" />
            <circle r="3.5" fill="#818cf8" />
            <text
              x={wp.dx}
              y={wp.dy}
              fontSize="11"
              fill="rgba(247,244,236,0.72)"
              fontFamily="var(--font-body)"
            >
              {wp.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

function getStrength(v) {
  let score = 0;
  if (v.length >= 6) score++;
  if (v.length >= 10) score++;
  if (/[0-9]/.test(v) && /[a-zA-Z]/.test(v)) score++;
  if (/[^a-zA-Z0-9]/.test(v)) score++;
  const colors = ["#e8927c", "#e8927c", "#d4a24c", "#3e6259"];
  return { score, color: colors[Math.max(score - 1, 0)] };
}

