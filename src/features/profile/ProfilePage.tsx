import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, LoaderCircle, MapPin, Moon, Monitor, Save, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setTheme } from "../ui/uiSlice";
import { user as defaultUser } from "../../constants/mockData";
import type { ThemeMode } from "../../types";
import { PageHeader } from "../../components/ui/PageHeader";
import { getProfile, updateProfile as saveProfile, type ProfileUpdate } from "../../services/profileApi";
import { updateProfile } from "../auth/authSlice";

const fields: { label: string; name: keyof ProfileUpdate; type: "text" | "email"; autocomplete: string }[] = [
  { label: "Full name", name: "name", type: "text", autocomplete: "name" },
  { label: "Email address", name: "email", type: "email", autocomplete: "email" },
  { label: "Location", name: "location", type: "text", autocomplete: "address-level2" },
];

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const currentUser = useAppSelector((state) => state.auth.user) ?? defaultUser;
  const [profile, setProfile] = useState(currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const saveController = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getProfile(currentUser, controller.signal)
      .then(setProfile)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : "Unable to load your profile.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort();
      saveController.current?.abort();
    };
  }, [currentUser, loadAttempt]);

  const handleSave = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const controller = new AbortController();
    saveController.current = controller;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updatedProfile = await saveProfile(profile, controller.signal);
      if (!controller.signal.aborted) {
        setProfile(updatedProfile);
        dispatch(updateProfile(updatedProfile));
        setSaveSuccess(true);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setSaveError(error instanceof Error ? error.message : "Unable to save your profile. Please try again.");
      }
    } finally {
      if (!controller.signal.aborted) setIsSaving(false);
      if (saveController.current === controller) saveController.current = null;
    }
  };

  const options: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
    { mode: "light", label: "Light", icon: Sun },
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "system", label: "System", icon: Monitor },
  ];
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader eyebrow="Account" title="Profile" description="Manage your personal details and preferences." />
      <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-2xl bg-slate-900 p-6 text-white">
          <div className="grid size-20 place-items-center rounded-full bg-amber-200 text-xl font-bold text-slate-900">{profile.initials}</div>
          <h2 className="mt-5 font-display text-2xl font-semibold">{profile.name}</h2>
          <p className="mt-1 text-sm text-slate-400">{profile.role}</p>
          <div className="mt-8 space-y-3 border-t border-slate-700 pt-5 text-sm text-slate-300">
            <p>{profile.email}</p>
            <p className="flex items-center gap-2">
              <MapPin size={15} />
              {profile.location}
            </p>
            <p>Member since {profile.joined}</p>
          </div>
        </section>
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-semibold dark:text-white">Personal information</h2>
                <p className="mt-1 text-sm text-slate-500">Update the details used across your account.</p>
              </div>
              {isLoading && <span className="flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={16} /> Loading</span>}
            </div>
            {loadError ? (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300" role="alert">
                <span className="flex items-center gap-2"><AlertCircle size={16} />{loadError}</span>
                <button type="button" onClick={() => { setIsLoading(true); setLoadError(null); setLoadAttempt((attempt) => attempt + 1); }} className="font-semibold underline underline-offset-2">Try again</button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="mt-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {fields.map(({ label, name, type, autocomplete }) => (
                    <label key={name} className="block">
                      <span className="mb-1 block text-xs font-medium text-slate-500">{label}</span>
                      <input
                        autoComplete={autocomplete}
                        disabled={isLoading || isSaving}
                        name={name}
                        onChange={(event) => {
                          setProfile((current) => ({ ...current, [name]: event.target.value }));
                          setSaveError(null);
                          setSaveSuccess(false);
                        }}
                        required
                        type={type}
                        value={profile[name]}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-amber-300/20"
                      />
                    </label>
                  ))}
                  <ReadOnlyField label="Account type" value={profile.role} />
                </div>
                {(saveError || saveSuccess) && (
                  <p className={`mt-4 flex items-center gap-2 text-sm ${saveError ? "text-rose-600 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"}`} role={saveError ? "alert" : "status"}>
                    {saveError ? <AlertCircle size={16} /> : <Check size={16} />}
                    {saveError ?? "Profile updated successfully."}
                  </p>
                )}
                <div className="mt-5 flex justify-end">
                  <button type="submit" disabled={isLoading || isSaving} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
                    {isSaving ? <LoaderCircle className="animate-spin" size={16} /> : <Save size={16} />}
                    {isSaving ? "Saving" : "Save changes"}
                  </button>
                </div>
              </form>
            )}
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-lg font-semibold dark:text-white">Appearance</h2>
            <p className="mt-1 text-sm text-slate-500">Choose how Ledgerly looks for you.</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {options.map(({ mode, label, icon: Icon }) => (
                <motion.button
                  key={mode}
                  type="button"
                  onClick={() => dispatch(setTheme(mode))}
                  aria-pressed={theme === mode}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 420, damping: 28 }}
                  className={`isolate relative flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium ${theme === mode ? "border-amber-300 text-amber-800 dark:text-amber-200" : "border-slate-200 text-slate-500 dark:border-slate-700"}`}
                >
                  {theme === mode && <motion.span layoutId="theme-selection" className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-amber-50 dark:bg-amber-300/10" transition={{ type: "spring", stiffness: 360, damping: 32 }} />}
                  <motion.span className="relative z-10" animate={{ rotate: theme === mode ? 0 : -8, scale: theme === mode ? 1.08 : 1 }}>
                    <Icon size={18} />
                  </motion.span>
                  <span className="relative z-10">{label}</span>
                  {theme === mode && <Check className="absolute right-2 top-2 z-10 text-amber-600" size={14} />}
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
interface FieldProps {
  readonly label: string;
  readonly value: string;
}
function ReadOnlyField({ label, value }: Readonly<FieldProps>) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>
      <div className="rounded-lg bg-slate-100 px-3 py-2.5 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">{value}</div>
    </div>
  );
}
