// src/pages/CreateArtworkPage.tsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ART_CATEGORIES } from "../constants/artCategories";
import NumericInput, { parsePriceLkr } from "../components/common/NumericInput";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PrintSize {
  width:  string;
  height: string;
  price:  string;
}

interface Print {
  id:              number;
  surfaceMaterial: string;
  sizes:           PrintSize[];
}

interface FrameOption {
  id:           number;
  surfaceMaterial: string;
  color:        string;
  widthCm:      string;
  extraPriceLkr: string;
}

interface OriginalArt {
  surfaceMaterial: string;
  widthCm:         string;
  heightCm:        string;
  priceLkr:        string;
}

interface ArtworkForm {
  name:                   string;
  description:            string;
  category:               string;
  mainImageUrl:           string | null;
  supportingImageUrls:    string[];
  originalArt:            OriginalArt;
  offerFramingForOriginal: boolean | null;
  offerFramingForPrints:   boolean | null;
  prints:                 Print[];
  frames:                 FrameOption[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Derive orientation label from width and height numbers */
function deriveOrientation(w: string, h: string): string | null {
  const width  = parseFloat(w);
  const height = parseFloat(h);
  if (!width || !height) return null;
  if (width > height) return "Landscape";
  if (height > width) return "Portrait";
  return "Square";
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
      {children}
    </p>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {children}
      {optional && <span className="font-normal text-gray-400 ml-1">(optional)</span>}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const { error, className, ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition
        focus:ring-1 focus:ring-red-300
        ${error ? "border-red-400" : "border-gray-200"}
        ${className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800
        outline-none transition focus:ring-1 focus:ring-red-300 resize-y leading-relaxed"
    />
  );
}

// ─── Framing opt-in toggle ────────────────────────────────────────────────────

function FramingOptIn({
  value,
  onChange,
}: {
  value:    boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-xs text-gray-500 font-medium">
        Offer framing for this artwork?
      </span>
      <div className="flex gap-2">
        {[true, false].map((opt) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-1 rounded-full text-xs font-semibold border transition
              ${value === opt
                ? opt
                  ? "bg-red-500 border-red-500 text-white shadow-sm"
                  : "bg-gray-700 border-gray-700 text-white shadow-sm"
                : "border-gray-300 text-gray-500 hover:bg-gray-50"}`}
          >
            {opt ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Surface material dropdown ────────────────────────────────────────────────

const SURFACE_OPTIONS = ["Canvas", "Paper", "Wood", "Glass"];

function SurfaceMaterialSelect({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-left outline-none flex justify-between items-center"
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected || "Select here"}
        </span>
        <span className="text-gray-400 text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-md mt-1 overflow-hidden">
          {SURFACE_OPTIONS.map((mat) => (
            <div
              key={mat}
              onClick={() => { onChange(mat); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-50
                ${selected === mat ? "bg-red-50 text-red-500 font-medium" : "text-gray-700"}`}
            >
              {mat}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Frames panel ─────────────────────────────────────────────────────────────

function FramesPanel({
  frames,
  onUpdate,
  onAdd,
  onRemove,
}: {
  frames:   FrameOption[];
  onUpdate: (id: number, key: keyof FrameOption, value: string) => void;
  onAdd:    () => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-red-50 border border-red-100 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
        Frame Options
      </p>
      {frames.map((frame) => (
        <div key={frame.id} className="border border-red-100 rounded-2xl p-3 space-y-2 bg-white">
          <div className="grid grid-cols-4 gap-2 text-xs text-red-300 font-medium">
            <span>Material</span>
            <span>Color</span>
            <span>Width (cm)</span>
            <span>Price (LKR)</span>
          </div>
          <div className="grid grid-cols-4 gap-2 items-start">
            <SurfaceMaterialSelect
              selected={frame.surfaceMaterial}
              onChange={(val) => onUpdate(frame.id, "surfaceMaterial", val)}
            />
            <Input
              placeholder="e.g. black"
              value={frame.color}
              onChange={(e) => onUpdate(frame.id, "color", e.target.value)}
            />
            <NumericInput
              placeholder="0"
              value={frame.widthCm}
              onChange={(v) => onUpdate(frame.id, "widthCm", v)}
            />
            <NumericInput
              placeholder="Price"
              value={frame.extraPriceLkr}
              onChange={(v) => onUpdate(frame.id, "extraPriceLkr", v)}
            />
          </div>
          {frames.length > 1 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onRemove(frame.id)}
                className="text-xs text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="text-xs text-red-400 border border-dashed border-red-300 rounded-2xl w-full py-2 hover:bg-red-100 transition bg-white"
      >
        + Add frame option
      </button>
    </div>
  );
}

// ─── Blank factories ──────────────────────────────────────────────────────────

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

// ─── Main component ───────────────────────────────────────────────────────────

export default function CreateArtworkPage() {
  const { token } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState<ArtworkForm>({
    name:                   "",
    description:            "",
    category:               "",
    mainImageUrl:           null,
    supportingImageUrls:    [],
    originalArt:            { surfaceMaterial: "", widthCm: "", heightCm: "", priceLkr: "" },
    offerFramingForOriginal: null,
    offerFramingForPrints:   null,
    prints:                 [blankPrint()],
    frames:                 [blankFrame()],
  });

  const [nameError,   setNameError]   = useState(false);
  const [submitError, setSubmitError] = useState("");
  const mainInputRef = useRef<HTMLInputElement>(null);
  const suppInputRef = useRef<HTMLInputElement>(null);

  // ─── Field setters ──────────────────────────────────────────────────────────

  const setField = <K extends keyof ArtworkForm>(key: K, value: ArtworkForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setOA = <K extends keyof OriginalArt>(key: K, value: OriginalArt[K]) =>
    setForm((f) => ({ ...f, originalArt: { ...f.originalArt, [key]: value } }));

  // ─── Image handlers ─────────────────────────────────────────────────────────

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

  // ─── Print handlers ─────────────────────────────────────────────────────────

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

  // ─── Frame handlers ─────────────────────────────────────────────────────────

  const updateFrame = (id: number, key: keyof FrameOption, value: string) =>
    setForm((f) => ({ ...f, frames: f.frames.map((fr) => fr.id === id ? { ...fr, [key]: value } : fr) }));

  const addFrame    = () => setForm((f) => ({ ...f, frames: [...f.frames, blankFrame()] }));
  const removeFrame = (id: number) => setForm((f) => ({ ...f, frames: f.frames.filter((fr) => fr.id !== id) }));

  // ─── Save ───────────────────────────────────────────────────────────────────

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

    // Derive orientation from dimensions — no manual select needed
    const orientation =
      deriveOrientation(form.originalArt.widthCm, form.originalArt.heightCm) ?? "Square";

    const payload = {
      name:               form.name,
      description:        form.description,
      category:           form.category,
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
      const res  = await fetch("/api/artworks", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      navigate("/artworks");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all changes?")) navigate("/artworks");
  };

  // Orientation preview — computed live from the size fields
  const orientationPreview = deriveOrientation(
    form.originalArt.widthCm,
    form.originalArt.heightCm
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-[860px] mx-auto p-5 space-y-4 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold text-gray-800">Add Artwork</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className="px-4 py-1.5 text-sm rounded-full bg-pink-100 text-red-500 hover:bg-pink-200 transition font-medium"
          >
            Discard
          </button>
        </div>
      </div>

      {/* Error banner */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {submitError}
        </div>
      )}

      {/* Images row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Main image */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <FieldLabel>Main artwork image</FieldLabel>
          <div
            className="relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2
              border-dashed border-gray-200 bg-gray-50 transition cursor-pointer overflow-hidden mt-1
              hover:border-red-300 hover:bg-red-50"
            style={{ height: 140 }}
            onClick={() => !form.mainImageUrl && mainInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {form.mainImageUrl ? (
              <>
                <img src={form.mainImageUrl} alt="Main" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeMain}
                  className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition"
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">🖼️</div>
                <p className="text-xs text-gray-400">Click or drop image here</p>
              </div>
            )}
          </div>
          <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainFile} />
        </div>

        {/* Supporting images */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <FieldLabel>Supporting images</FieldLabel>
          <div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
              border-gray-200 bg-gray-50 cursor-pointer hover:border-red-300 hover:bg-red-50 transition py-3 mt-1"
            onClick={() => suppInputRef.current?.click()}
          >
            <span className="text-xl text-gray-300">👆</span>
            <p className="text-xs text-red-400 font-medium">Click or drop images here</p>
          </div>
          {form.supportingImageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.supportingImageUrls.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                  <img src={url} alt={`Supporting ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeSupp(i)}
                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <input ref={suppInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSuppFiles} />
        </div>
      </div>

      {/* Name + description */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div>
          <FieldLabel>Name of the artwork</FieldLabel>
          <Input
            type="text"
            maxLength={120}
            value={form.name}
            error={nameError}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel optional>Description</FieldLabel>
          <Textarea
            rows={3}
            maxLength={600}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
      </div>

      {/* Original art */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <SectionLabel>Original Art</SectionLabel>

        <div>
          <FieldLabel>Category</FieldLabel>
          <select
            value={form.category}
            onChange={(e) => setField("category", e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:ring-1 focus:ring-red-300"
          >
            <option value="">Select category</option>
            {ART_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <FieldLabel>Surface material</FieldLabel>
            <Input
              type="text"
              placeholder="e.g. canvas, paper"
              value={form.originalArt.surfaceMaterial}
              onChange={(e) => setOA("surfaceMaterial", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Size (cm)</FieldLabel>
            <div className="flex gap-2 items-center">
              <NumericInput
                placeholder="Width"
                value={form.originalArt.widthCm}
                onChange={(v) => setOA("widthCm", v)}
                className="flex-1"
              />
              <span className="text-gray-300 text-xs flex-shrink-0">×</span>
              <NumericInput
                placeholder="Height"
                value={form.originalArt.heightCm}
                onChange={(v) => setOA("heightCm", v)}
                className="flex-1"
              />
            </div>
            {/* Live orientation preview derived from dimensions */}
            {orientationPreview && (
              <p className="text-xs text-red-400 font-medium mt-1">
                Orientation: {orientationPreview}
              </p>
            )}
          </div>
          <div>
            <FieldLabel>Price (LKR)</FieldLabel>
            <NumericInput
              placeholder="Enter price"
              value={form.originalArt.priceLkr}
              onChange={(v) => setOA("priceLkr", v)}
            />
          </div>
        </div>
        <FramingOptIn
          value={form.offerFramingForOriginal}
          onChange={(val) => setField("offerFramingForOriginal", val)}
        />
        {form.offerFramingForOriginal === true && (
          <FramesPanel frames={form.frames} onUpdate={updateFrame} onAdd={addFrame} onRemove={removeFrame} />
        )}
      </div>

      {/* Prints */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <SectionLabel>Prints</SectionLabel>
        {form.prints.map((print) => (
          <div key={print.id} className="border border-gray-100 rounded-2xl p-3 space-y-2 bg-gray-50">
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-medium">
              <span>Surface material</span>
              <span>Size (cm)</span>
              <span>Price (LKR)</span>
            </div>
            {print.sizes.map((size, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                {idx === 0 ? (
                  <Input
                    placeholder="e.g. Canvas"
                    value={print.surfaceMaterial}
                    onChange={(e) => updatePrint(print.id, "surfaceMaterial", e.target.value)}
                  />
                ) : (
                  <div />
                )}
                <div className="flex gap-1 items-center">
                  <NumericInput
                    placeholder="W"
                    value={size.width}
                    className="flex-1"
                    onChange={(v) => {
                      const updated = [...print.sizes];
                      updated[idx] = { ...updated[idx], width: v };
                      updatePrint(print.id, "sizes", updated);
                    }}
                  />
                  <span className="text-gray-300 text-xs flex-shrink-0">×</span>
                  <NumericInput
                    placeholder="H"
                    value={size.height}
                    className="flex-1"
                    onChange={(v) => {
                      const updated = [...print.sizes];
                      updated[idx] = { ...updated[idx], height: v };
                      updatePrint(print.id, "sizes", updated);
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <NumericInput
                    placeholder="Price"
                    value={size.price}
                    className="flex-1"
                    onChange={(v) => {
                      const updated = [...print.sizes];
                      updated[idx] = { ...updated[idx], price: v };
                      updatePrint(print.id, "sizes", updated);
                    }}
                  />
                  {print.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(print.id, idx)}
                      className="text-red-400 hover:text-red-600 text-xs ml-1 flex-shrink-0"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={() => addSize(print.id)} className="text-xs text-red-400 hover:underline">
                + Add size
              </button>
              {form.prints.length > 1 && (
                <button type="button" onClick={() => removePrint(print.id)} className="text-xs text-gray-400 hover:text-red-400">
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addPrint}
          className="text-xs text-red-400 border border-dashed border-red-200 rounded-2xl w-full py-2 hover:bg-red-50 transition"
        >
          + Add surface material
        </button>
        <FramingOptIn
          value={form.offerFramingForPrints}
          onChange={(val) => setField("offerFramingForPrints", val)}
        />
        {form.offerFramingForPrints === true && (
          <FramesPanel frames={form.frames} onUpdate={updateFrame} onAdd={addFrame} onRemove={removeFrame} />
        )}
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={handleDiscard}
          className="px-5 py-2 text-sm rounded-full border border-gray-300 text-gray-500 hover:border-gray-500 transition"
        >
          Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium"
        >
          ✓ Save Artwork
        </button>
      </div>
    </div>
  );
}