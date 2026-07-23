"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import {
  ExperienceItem,
  MAX_VIDEOS_PER_CATEGORY,
  MAX_VIDEO_SIZE_BYTES,
  PortfolioCategory,
  Profile,
  SoftwareItem,
  Stat,
  getPortfolioMediaSrc,
} from "@/lib/profile-data";
import {
  addPortfolioCategoryAction,
  addPortfolioPhotoAction,
  addPortfolioVideoAction,
  logoutAction,
  removePortfolioCategoryAction,
  removePortfolioPhotoAction,
  removePortfolioVideoAction,
  saveAboutAction,
  saveContactAction,
  saveExperienceAction,
  saveSkillsAction,
  uploadPortfolioPhotoAction,
} from "./actions";

type Tab = "about" | "experience" | "skills" | "contact" | "portfolio";

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "About Me" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
  { id: "portfolio", label: "Portfolio Photos" },
];

function SaveStatus({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error" | string;
}) {
  if (status === "saving")
    return <span className="text-sm text-muted">Menyimpan…</span>;
  if (status === "saved")
    return (
      <span className="text-sm text-accent">
        Tersimpan. Perubahan langsung tampil di halaman utama.
      </span>
    );
  if (status === "idle" || !status) return null;
  return <span className="text-sm text-accent-2">{status}</span>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-widest text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-lg border border-hairline/60 bg-bg-elevated px-4 py-3 text-paper outline-none transition-colors duration-200 focus:border-accent";

function SaveButton({
  pending,
  onClick,
}: {
  pending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-accent-ink transition-transform duration-200 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
    >
      {pending ? "Menyimpan…" : "Simpan perubahan"}
    </button>
  );
}

function AboutTab({ profile, stats }: { profile: Profile; stats: Stat[] }) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [nickname, setNickname] = useState(profile.nickname);
  const [roles, setRoles] = useState(profile.roles.join(", "));
  const [location, setLocation] = useState(profile.location);
  const [statList, setStatList] = useState(stats);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const updateStat = (i: number, field: keyof Stat, value: string) => {
    setStatList((prev) =>
      prev.map((s, idx) =>
        idx === i
          ? { ...s, [field]: field === "value" ? Number(value) || 0 : value }
          : s,
      ),
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      setStatus("");
      const res = await saveAboutAction({
        fullName,
        nickname,
        roles: roles
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        location,
        stats: statList,
      });
      setStatus(res.ok ? "saved" : res.error);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Nama lengkap">
        <input
          className={inputClass}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </Field>
      <Field label="Nama panggilan">
        <input
          className={inputClass}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </Field>
      <Field label="Roles (pisahkan dengan koma)">
        <input
          className={inputClass}
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
        />
      </Field>
      <Field label="Lokasi">
        <input
          className={inputClass}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-widest text-muted">
          Statistik
        </span>
        {statList.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-3">
            <input
              className={inputClass}
              type="number"
              value={s.value}
              onChange={(e) => updateStat(i, "value", e.target.value)}
              placeholder="Angka"
            />
            <input
              className={inputClass}
              value={s.suffix}
              onChange={(e) => updateStat(i, "suffix", e.target.value)}
              placeholder="Suffix (mis. +)"
            />
            <input
              className={inputClass}
              value={s.label}
              onChange={(e) => updateStat(i, "label", e.target.value)}
              placeholder="Label"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <SaveButton pending={pending} onClick={handleSave} />
        <SaveStatus status={status} />
      </div>
    </div>
  );
}

function ContactTab({ profile }: { profile: Profile }) {
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      setStatus("");
      const res = await saveContactAction({ email, phone, location });
      setStatus(res.ok ? "saved" : res.error);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <Field label="Email">
        <input
          className={inputClass}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Telepon / WhatsApp">
        <input
          className={inputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>
      <Field label="Lokasi">
        <input
          className={inputClass}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Field>
      <div className="flex items-center gap-4">
        <SaveButton pending={pending} onClick={handleSave} />
        <SaveStatus status={status} />
      </div>
    </div>
  );
}

function ExperienceTab({ items }: { items: ExperienceItem[] }) {
  const [list, setList] = useState<ExperienceItem[]>(items);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const update = (i: number, field: keyof ExperienceItem, value: string) => {
    setList((prev) =>
      prev.map((item, idx) =>
        idx === i
          ? {
              ...item,
              [field]: field === "points" ? value.split("\n") : value,
            }
          : item,
      ),
    );
  };

  const addItem = () =>
    setList((prev) => [
      ...prev,
      { company: "New Company", role: "Role", period: "Period", points: [] },
    ]);

  const removeItem = (i: number) =>
    setList((prev) => prev.filter((_, idx) => idx !== i));

  const moveItem = (i: number, dir: -1 | 1) => {
    setList((prev) => {
      const next = [...prev];
      const target = i + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });
  };

  const handleSave = () => {
    startTransition(async () => {
      setStatus("");
      const res = await saveExperienceAction(list);
      setStatus(res.ok ? "saved" : res.error);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {list.map((item, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-xl border border-hairline/60 p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted">
              Entry {i + 1}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => moveItem(i, -1)}
                className="text-xs uppercase tracking-widest text-muted hover:text-accent"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => moveItem(i, 1)}
                className="text-xs uppercase tracking-widest text-muted hover:text-accent"
              >
                Down
              </button>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-xs uppercase tracking-widest text-accent-2 hover:opacity-80"
              >
                Hapus
              </button>
            </div>
          </div>
          <Field label="Perusahaan">
            <input
              className={inputClass}
              value={item.company}
              onChange={(e) => update(i, "company", e.target.value)}
            />
          </Field>
          <Field label="Peran">
            <input
              className={inputClass}
              value={item.role}
              onChange={(e) => update(i, "role", e.target.value)}
            />
          </Field>
          <Field label="Periode">
            <input
              className={inputClass}
              value={item.period}
              onChange={(e) => update(i, "period", e.target.value)}
            />
          </Field>
          <Field label="Poin (satu per baris)">
            <textarea
              className={`${inputClass} min-h-28`}
              value={item.points.join("\n")}
              onChange={(e) => update(i, "points", e.target.value)}
            />
          </Field>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="self-start rounded-full border border-hairline/60 px-6 py-3 text-sm uppercase tracking-wide text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        + Tambah pengalaman
      </button>

      <div className="flex items-center gap-4">
        <SaveButton pending={pending} onClick={handleSave} />
        <SaveStatus status={status} />
      </div>
    </div>
  );
}

function SkillsTab({
  coreSkills,
  software,
}: {
  coreSkills: string[];
  software: SoftwareItem[];
}) {
  const [skills, setSkills] = useState(coreSkills);
  const [tools, setTools] = useState(software);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const updateSkill = (i: number, value: string) =>
    setSkills((prev) => prev.map((s, idx) => (idx === i ? value : s)));
  const addSkill = () => setSkills((prev) => [...prev, "New Skill"]);
  const removeSkill = (i: number) =>
    setSkills((prev) => prev.filter((_, idx) => idx !== i));

  const updateTool = (i: number, field: keyof SoftwareItem, value: string) =>
    setTools((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)),
    );
  const addTool = () =>
    setTools((prev) => [
      ...prev,
      {
        name: "New Tool",
        short: "Nt",
        colorFrom: "#000000",
        colorTo: "#ffffff",
      },
    ]);
  const removeTool = (i: number) =>
    setTools((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    startTransition(async () => {
      setStatus("");
      const res = await saveSkillsAction(skills, tools);
      setStatus(res.ok ? "saved" : res.error);
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-widest text-muted">
          Core skills
        </span>
        {skills.map((s, i) => (
          <div key={i} className="flex gap-3">
            <input
              className={`${inputClass} flex-1`}
              value={s}
              onChange={(e) => updateSkill(i, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="rounded-lg border border-hairline/60 px-4 text-xs uppercase tracking-wide text-accent-2 hover:opacity-80"
            >
              Hapus
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSkill}
          className="self-start rounded-full border border-hairline/60 px-6 py-3 text-sm uppercase tracking-wide text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          + Tambah skill
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs uppercase tracking-widest text-muted">
          Toolkit / software
        </span>
        {tools.map((t, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <input
              className={inputClass}
              value={t.name}
              onChange={(e) => updateTool(i, "name", e.target.value)}
              placeholder="Nama"
            />
            <input
              className={inputClass}
              value={t.short}
              onChange={(e) => updateTool(i, "short", e.target.value)}
              placeholder="Singkatan"
            />
            <input
              className={inputClass}
              value={t.colorFrom}
              onChange={(e) => updateTool(i, "colorFrom", e.target.value)}
              placeholder="#warna-from"
            />
            <input
              className={inputClass}
              value={t.colorTo}
              onChange={(e) => updateTool(i, "colorTo", e.target.value)}
              placeholder="#warna-to"
            />
            <button
              type="button"
              onClick={() => removeTool(i)}
              className="rounded-lg border border-hairline/60 px-4 text-xs uppercase tracking-wide text-accent-2 hover:opacity-80"
            >
              Hapus
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTool}
          className="self-start rounded-full border border-hairline/60 px-6 py-3 text-sm uppercase tracking-wide text-paper transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          + Tambah tool
        </button>
      </div>

      <div className="flex items-center gap-4">
        <SaveButton pending={pending} onClick={handleSave} />
        <SaveStatus status={status} />
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const VIDEO_CONTENT_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
];

function PortfolioCategoryEditor({
  category,
  onRemoveCategory,
  canRemoveCategory,
  removingCategory,
}: {
  category: PortfolioCategory;
  onRemoveCategory: () => void;
  canRemoveCategory: boolean;
  removingCategory: boolean;
}) {
  const [status, setStatus] = useState<Record<number, string>>({});
  const [pendingSlot, setPendingSlot] = useState<number | null>(null);
  const [pendingAction, startTransition] = useTransition();
  const [videos, setVideos] = useState(category.videos ?? []);
  const [videoStatus, setVideoStatus] = useState("");
  const [pendingVideo, startVideoTransition] = useTransition();

  const handleUpload =
    (slot: number) => async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const base64 = await fileToBase64(file);
      setPendingSlot(slot);
      startTransition(async () => {
        const res = await uploadPortfolioPhotoAction(category.id, slot, base64);
        setStatus((prev) => ({
          ...prev,
          [slot]: res.ok ? "saved" : res.error,
        }));
        setPendingSlot(null);
      });
      e.target.value = "";
    };

  const handleAdd = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    startTransition(async () => {
      const res = await addPortfolioPhotoAction(category.id, base64);
      setStatus((prev) => ({
        ...prev,
        [-1]: res.ok ? "saved" : res.error,
      }));
    });
    e.target.value = "";
  };

  const handleRemoveLast = () => {
    startTransition(async () => {
      const res = await removePortfolioPhotoAction(category.id);
      setStatus((prev) => ({
        ...prev,
        [-1]: res.ok ? "saved" : res.error,
      }));
    });
  };

  const handleUploadVideo = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      setVideoStatus("Ukuran video maksimal 3MB.");
      e.target.value = "";
      return;
    }
    if (videos.length >= MAX_VIDEOS_PER_CATEGORY) {
      setVideoStatus(
        `Maksimal ${MAX_VIDEOS_PER_CATEGORY} video per portofolio.`,
      );
      e.target.value = "";
      return;
    }
    if (!VIDEO_CONTENT_TYPES.includes(file.type)) {
      setVideoStatus("Format video tidak didukung (gunakan mp4, webm, mov, atau m4v).");
      e.target.value = "";
      return;
    }

    setVideoStatus("uploading");
    try {
      const blob = await upload(
        `portfolio/${category.id}/${Date.now()}-${file.name}`,
        file,
        {
          access: "private",
          handleUploadUrl: "/api/portfolio-video-upload",
        },
      );
      startVideoTransition(async () => {
        const res = await addPortfolioVideoAction(
          category.id,
          blob.pathname,
          file.size,
        );
        if (res.ok) {
          const nextSlot =
            videos.reduce((max, v) => Math.max(max, v.slot), 0) + 1;
          setVideos((prev) => [
            ...prev,
            { slot: nextSlot, pathname: blob.pathname },
          ]);
          setVideoStatus("saved");
        } else {
          setVideoStatus(res.error);
        }
      });
    } catch (error) {
      setVideoStatus(error instanceof Error ? error.message : "Upload gagal.");
    }
    e.target.value = "";
  };

  const handleRemoveVideo = (slot: number) => {
    startVideoTransition(async () => {
      const res = await removePortfolioVideoAction(category.id, slot);
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.slot !== slot));
        setVideoStatus("saved");
      } else {
        setVideoStatus(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-hairline/60 p-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-xl text-paper">
          {category.label}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-muted">
            {category.photos.length} foto · {videos.length}/{MAX_VIDEOS_PER_CATEGORY} video
          </span>
          <button
            type="button"
            onClick={onRemoveCategory}
            disabled={!canRemoveCategory || removingCategory}
            title={
              canRemoveCategory
                ? "Hapus portofolio ini"
                : "Minimal harus ada satu portofolio"
            }
            className="rounded-full border border-hairline/60 px-4 py-1.5 text-xs uppercase tracking-wide text-accent-2 transition-colors duration-200 hover:opacity-80 disabled:opacity-40"
          >
            {removingCategory ? "Menghapus…" : "Hapus portofolio"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {category.photos.map((photo) => {
          const slot = photo.slot;
          return (
            <div key={slot} className="flex flex-col gap-2">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-bg-elevated">
                <Image
                  src={getPortfolioMediaSrc(photo.pathname)}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <label className="cursor-pointer rounded-lg border border-hairline/60 px-3 py-2 text-center text-xs uppercase tracking-wide text-muted transition-colors duration-200 hover:border-accent hover:text-accent">
                {pendingAction && pendingSlot === slot
                  ? "Mengunggah…"
                  : "Ganti foto"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload(slot)}
                />
              </label>
              {status[slot] && status[slot] !== "saved" && (
                <span className="text-xs text-accent-2">{status[slot]}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full border border-hairline/60 px-6 py-3 text-sm uppercase tracking-wide text-paper transition-colors duration-200 hover:border-accent hover:text-accent">
          + Tambah foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAdd}
          />
        </label>
        {category.photos.length > 0 && (
          <button
            type="button"
            onClick={handleRemoveLast}
            className="rounded-full border border-hairline/60 px-6 py-3 text-sm uppercase tracking-wide text-accent-2 transition-colors duration-200 hover:opacity-80"
          >
            Hapus foto terakhir
          </button>
        )}
        {status[-1] && (
          <span
            className={
              status[-1] === "saved"
                ? "text-sm text-accent"
                : "text-sm text-accent-2"
            }
          >
            {status[-1] === "saved" ? "Tersimpan." : status[-1]}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-hairline/60 pt-4">
        <span className="text-xs uppercase tracking-widest text-muted">
          Video (klik untuk putar di halaman utama)
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {videos.map((video) => (
            <div key={video.slot} className="flex flex-col gap-2">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-bg-elevated">
                <video
                  src={getPortfolioMediaSrc(video.pathname)}
                  controls
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveVideo(video.slot)}
                disabled={pendingVideo}
                className="rounded-lg border border-hairline/60 px-3 py-2 text-center text-xs uppercase tracking-wide text-accent-2 transition-colors duration-200 hover:opacity-80 disabled:opacity-60"
              >
                Hapus video
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {videos.length < MAX_VIDEOS_PER_CATEGORY && (
            <label className="cursor-pointer rounded-full border border-hairline/60 px-6 py-3 text-sm uppercase tracking-wide text-paper transition-colors duration-200 hover:border-accent hover:text-accent">
              {pendingVideo ? "Mengunggah…" : "+ Tambah video"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleUploadVideo}
              />
            </label>
          )}
          <span className="text-xs text-muted">Maks. 3MB per video.</span>
          {videoStatus && (
            <span
              className={
                videoStatus === "saved"
                  ? "text-sm text-accent"
                  : "text-sm text-accent-2"
              }
            >
              {videoStatus === "saved" ? "Tersimpan." : videoStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioTab({
  categories: initialCategories,
}: {
  categories: PortfolioCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [pendingNew, startNewTransition] = useTransition();
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAccent, setNewAccent] = useState("#ff2f6e");

  const handleAddCategory = () => {
    const id = newId.trim().toLowerCase();
    if (!id || !newLabel.trim()) {
      setNewStatus("ID dan nama wajib diisi.");
      return;
    }
    startNewTransition(async () => {
      const res = await addPortfolioCategoryAction({
        id,
        label: newLabel,
        description: newDescription,
        accent: newAccent,
      });
      if (res.ok) {
        setCategories((prev) => [
          ...prev,
          {
            id,
            label: newLabel.trim(),
            description: newDescription.trim(),
            accent: newAccent.trim() || "#ff2f6e",
            photos: [],
            videos: [],
          },
        ]);
        setNewId("");
        setNewLabel("");
        setNewDescription("");
        setNewAccent("#ff2f6e");
        setNewStatus("saved");
      } else {
        setNewStatus(res.error);
      }
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    setPendingRemove(categoryId);
    startNewTransition(async () => {
      const res = await removePortfolioCategoryAction(categoryId);
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      } else {
        setNewStatus(res.error);
      }
      setPendingRemove(null);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-xl border border-hairline/60 p-5">
        <span className="font-display text-xl text-paper">
          Tambah portofolio baru
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className={inputClass}
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="ID (mis. new-brand)"
          />
          <input
            className={inputClass}
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Nama tampilan"
          />
          <input
            className={inputClass}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Deskripsi singkat"
          />
          <input
            className={inputClass}
            value={newAccent}
            onChange={(e) => setNewAccent(e.target.value)}
            placeholder="#warna-aksen"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleAddCategory}
            disabled={pendingNew}
            className="self-start rounded-full bg-accent px-6 py-3 text-sm font-medium uppercase tracking-wide text-accent-ink transition-transform duration-200 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
          >
            {pendingNew ? "Menyimpan…" : "+ Tambah portofolio"}
          </button>
          {newStatus && (
            <span
              className={
                newStatus === "saved"
                  ? "text-sm text-accent"
                  : "text-sm text-accent-2"
              }
            >
              {newStatus === "saved" ? "Tersimpan." : newStatus}
            </span>
          )}
        </div>
      </div>

      {categories.map((cat) => (
        <PortfolioCategoryEditor
          key={cat.id}
          category={cat}
          onRemoveCategory={() => handleRemoveCategory(cat.id)}
          canRemoveCategory={categories.length > 1}
          removingCategory={pendingRemove === cat.id}
        />
      ))}
    </div>
  );
}

export default function AdminDashboard({
  profile,
  stats,
  experience,
  coreSkills,
  software,
  portfolioCategories,
}: {
  profile: Profile;
  stats: Stat[];
  experience: ExperienceItem[];
  coreSkills: string[];
  software: SoftwareItem[];
  portfolioCategories: PortfolioCategory[];
}) {
  const [tab, setTab] = useState<Tab>("about");

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16 sm:px-10">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm uppercase tracking-[0.3em] text-accent">
            Admin panel
          </span>
          <h1 className="font-display mt-2 text-3xl text-paper sm:text-4xl">
            Kelola konten portofolio
          </h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border border-hairline/60 px-5 py-2.5 text-sm uppercase tracking-wide text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Keluar
          </button>
        </form>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 border-b border-hairline/60 pb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-5 py-2.5 text-sm uppercase tracking-wide transition-colors duration-200 ${
              tab === t.id
                ? "border-accent bg-accent text-accent-ink"
                : "border-hairline/60 text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "about" && <AboutTab profile={profile} stats={stats} />}
        {tab === "experience" && <ExperienceTab items={experience} />}
        {tab === "skills" && (
          <SkillsTab coreSkills={coreSkills} software={software} />
        )}
        {tab === "contact" && <ContactTab profile={profile} />}
        {tab === "portfolio" && (
          <PortfolioTab categories={portfolioCategories} />
        )}
      </div>
    </div>
  );
}
