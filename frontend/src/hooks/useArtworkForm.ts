import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { parsePriceLkr } from "../components/common/NumericInput";
import type { ArtworkForm, Print, FrameOption, OriginalArt } from "../shared/types/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function deriveOrientation(w: string, h: string): string | null {
  const width  = parseFloat(w);
  const height = parseFloat(h);
  if (!width || !height) return null;
  if (width > height) return "Landscape";
  if (height > width) return "Portrait";
  return "Square";
}

const blankPrint = (): Print => ({
  id:              Date.now() + Math.random(),
  surfaceMaterial: "",
  sizes:           [{ width: "", height: "", price: "" }],
});

const blankFrame = (): FrameOption => ({
  id:              Date.now() + Math.random(),
  surfaceMaterial: "",
  color:           "",
  widthCm:         "",
  extraPriceLkr:   "",
});

const initialForm: ArtworkForm = {
  name:                    "",
  description:             "",
  category:                "",
  mainImageUrl:            null,
  supportingImageUrls:     [],
  originalArt:             { surfaceMaterial: "", widthCm: "", heightCm: "", priceLkr: "" },
  offerFramingForOriginal: null,
  offerFramingForPrints:   null,
  prints:                  [blankPrint()],
  frames:                  [blankFrame()],
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArtworkForm(showToast?: (msg: string, type: "success" | "error") => void) {
  const { accessToken } = useAuth();   // ← fixed: inside hook, correct name
  const navigate        = useNavigate();

  const [form,        setForm]        = useState<ArtworkForm>(initialForm);
  const [nameError,   setNameError]   = useState(false);
  const [submitError, setSubmitError] = useState("");

  const mainInputRef = useRef<HTMLInputElement>(null);
  const suppInputRef = useRef<HTMLInputElement>(null);

  // ─── Generic setters ─────────────────────────────────────────────────────

  const setField = <K extends keyof ArtworkForm>(key: K, value: ArtworkForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setOA = <K extends keyof OriginalArt>(key: K, value: OriginalArt[K]) =>
    setForm((f) => ({ ...f, originalArt: { ...f.originalArt, [key]: value } }));

  // ─── Image handlers ───────────────────────────────────────────────────────

  const handleMainFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField("mainImageUrl", await fileToBase64(file));
  };

  const removeMain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField("mainImageUrl", null);
    if (mainInputRef.current) mainInputRef.current.value = "";
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) setField("mainImageUrl", await fileToBase64(file));
  };

  const handleSuppFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const b64s  = await Promise.all(files.map(fileToBase64));
    setForm((f) => ({ ...f, supportingImageUrls: [...f.supportingImageUrls, ...b64s] }));
    if (suppInputRef.current) suppInputRef.current.value = "";
  };

  const removeSupp = (idx: number) =>
    setForm((f) => ({ ...f, supportingImageUrls: f.supportingImageUrls.filter((_, i) => i !== idx) }));

  // ─── Print handlers ───────────────────────────────────────────────────────

  const updatePrint = (id: number, key: keyof Print, value: unknown) =>
    setForm((f) => ({ ...f, prints: f.prints.map((p) => p.id === id ? { ...p, [key]: value } : p) }));

  const addPrint    = () => setForm((f) => ({ ...f, prints: [...f.prints, blankPrint()] }));
  const removePrint = (id: number) => setForm((f) => ({ ...f, prints: f.prints.filter((p) => p.id !== id) }));

  const addSize = (id: number) =>
    setForm((f) => ({
      ...f,
      prints: f.prints.map((p) =>
        p.id === id ? { ...p, sizes: [...p.sizes, { width: "", height: "", price: "" }] } : p
      ),
    }));

  const removeSize = (pid: number, idx: number) =>
    setForm((f) => ({
      ...f,
      prints: f.prints.map((p) =>
        p.id === pid ? { ...p, sizes: p.sizes.filter((_, i) => i !== idx) } : p
      ),
    }));

  // ─── Frame handlers ───────────────────────────────────────────────────────

  const updateFrame = (id: number, key: keyof FrameOption, value: string) =>
    setForm((f) => ({ ...f, frames: f.frames.map((fr) => fr.id === id ? { ...fr, [key]: value } : fr) }));

  const addFrame    = () => setForm((f) => ({ ...f, frames: [...f.frames, blankFrame()] }));
  const removeFrame = (id: number) => setForm((f) => ({ ...f, frames: f.frames.filter((fr) => fr.id !== id) }));

  // ─── Save / discard ───────────────────────────────────────────────────────

  const handleSave = async () => {
    setSubmitError("");
    if (!form.name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 2000);
      return;
    }
    if (!form.category) {
      setSubmitError("Please select a category (e.g. Oil, Tempera).");
      return;
    }

    const orientation =
      deriveOrientation(form.originalArt.widthCm, form.originalArt.heightCm) ?? "Square";

    const payload = {
      name:                form.name,
      description:         form.description,
      category:            form.category,
      orientation,
      mainImageUrl:        form.mainImageUrl ?? "",
      supportingImageUrls: form.supportingImageUrls,
      originalArt: {
        surfaceMaterial: form.originalArt.surfaceMaterial,
        widthCm:         parsePriceLkr(form.originalArt.widthCm) || 1,
        heightCm:        parsePriceLkr(form.originalArt.heightCm) || 1,
        priceLkr:        parsePriceLkr(form.originalArt.priceLkr),
        isFramed:        form.offerFramingForOriginal === true,
      },
      prints: form.prints.map((p) => ({
        surfaceMaterial: p.surfaceMaterial,
        sizes: p.sizes.map((s) => ({
          width:  parsePriceLkr(s.width) || 1,
          height: parsePriceLkr(s.height) || 1,
          price:  parsePriceLkr(s.price),
        })),
      })),
      frameOptions:
        form.offerFramingForOriginal || form.offerFramingForPrints
          ? form.frames.map((f) => ({
              material:      f.surfaceMaterial,
              color:         f.color,
              widthCm:       parsePriceLkr(f.widthCm),
              extraPriceLkr: parsePriceLkr(f.extraPriceLkr),
            }))
          : [],
    };

    try {
      const res = await fetch("/api/artworks", {
        method:      "POST",
        credentials: "include",           // ← send cookie along
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${accessToken}`,  // ← fixed
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast?.(data.message ?? "Artwork saved successfully!", "success");
      setTimeout(() => navigate("/artworks"), 1500); // slight delay so toast is seen
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all changes?")) navigate("/artworks");
  };

  const orientationPreview = deriveOrientation(
    form.originalArt.widthCm,
    form.originalArt.heightCm
  );

  return {
    form,
    nameError,
    submitError,
    mainInputRef,
    suppInputRef,
    orientationPreview,
    setField,
    setOA,
    handleMainFile,
    removeMain,
    onDrop,
    handleSuppFiles,
    removeSupp,
    updatePrint,
    addPrint,
    removePrint,
    addSize,
    removeSize,
    updateFrame,
    addFrame,
    removeFrame,
    handleSave,
    handleDiscard,
  };
}