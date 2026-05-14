import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Orientation = "Landscape" | "Portrait" | "Square";

interface PrintSize {
  width: string;
  height: string;
  price: string;
}

interface Print {
  id: number;
  surfaceMaterial: string;
  sizes: PrintSize[];
}

interface Frame {
  id: number;
  surfaceMaterial: string;
  color: string;
  widthCm: string;
  extraPriceLkr: string;
}

interface OriginalArt {
  surfaceMaterial: string;
  widthCm: string;
  heightCm: string;
  priceLkr: string;
}

interface ArtworkForm {
  name: string;
  description: string;
  orientation: Orientation;
  mainImageUrl: string | null;
  supportingImageUrls: string[];
  originalArt: OriginalArt;
  offerFramingForOriginal: boolean | null;
  offerFramingForPrints: boolean | null;
  prints: Print[];
  frames: Frame[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
      {children}
    </p>
  );
}

function FieldLabel({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {children}
      {optional && (
        <span className="font-normal text-gray-400 ml-1">(optional)</span>
      )}
    </label>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean },
) {
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
      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none
        transition focus:ring-1 focus:ring-red-300 resize-y leading-relaxed"
    />
  );
}

// ─── Framing Opt-In Row ───────────────────────────────────────────────────────

function FramingOptIn({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-xs text-gray-500 font-medium">
        Do you wish to offer framing to this artwork?
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`px-4 py-1 rounded-full text-xs font-semibold border transition
            ${
              value === true
                ? "bg-red-500 border-red-500 text-white shadow-sm"
                : "border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`px-4 py-1 rounded-full text-xs font-semibold border transition
            ${
              value === false
                ? "bg-gray-700 border-gray-700 text-white shadow-sm"
                : "border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

// ─── Single-Select Surface Material Dropdown ──────────────────────────────────

const SURFACE_OPTIONS = ["Canvas", "Paper", "Wood", "Glass"];

function SurfaceMaterialSelect({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const select = (mat: string) => {
    onChange(mat);
    setOpen(false);
  };

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
              onClick={() => select(mat)}
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

// ─── Frames Panel ─────────────────────────────────────────────────────────────

function FramesPanel({
  frames,
  onUpdate,
  onAdd,
  onRemove,
}: {
  frames: Frame[];
  onUpdate: (id: number, key: keyof Frame, value: string) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-red-50 border border-red-100 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
        Frames Available
      </p>

      {frames.map((frame) => (
        <div
          key={frame.id}
          className="border border-red-100 rounded-2xl p-3 space-y-2 bg-white"
        >
          <div className="grid grid-cols-4 gap-2 text-xs text-red-300 font-medium">
            <span>Surface material</span>
            <span>Color</span>
            <span>Width (m)</span>
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
            <Input
              type="number"
              placeholder=""
              min={0}
              value={frame.widthCm}
              onChange={(e) => onUpdate(frame.id, "widthCm", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Frame price"
              min={0}
              value={frame.extraPriceLkr}
              onChange={(e) =>
                onUpdate(frame.id, "extraPriceLkr", e.target.value)
              }
            />
          </div>

          {frames.length > 1 && (
            <div className="flex justify-end">
              <button
                onClick={() => onRemove(frame.id)}
                className="text-xs text-red-400 hover:underline"
              >
                Remove frame
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={onAdd}
        className="text-xs text-red-400 border border-dashed border-red-300 rounded-2xl w-full py-2 hover:bg-red-100 transition bg-white"
      >
        + Add more frames
      </button>
    </div>
  );
}

// ─── Blank factories ──────────────────────────────────────────────────────────

const blankPrint = (): Print => ({
  id: Date.now() + Math.random(),
  surfaceMaterial: "",
  sizes: [{ width: "", height: "", price: "" }],
});

const blankFrame = (): Frame => ({
  id: Date.now() + Math.random(),
  surfaceMaterial: "",
  color: "",
  widthCm: "",
  extraPriceLkr: "",
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreateArtworkPage() {
  const [form, setForm] = useState<ArtworkForm>({
    name: "",
    description: "",
    orientation: "Landscape",
    mainImageUrl: null,
    supportingImageUrls: [],
    originalArt: {
      surfaceMaterial: "",
      widthCm: "",
      heightCm: "",
      priceLkr: "",
    },
    offerFramingForOriginal: null,
    offerFramingForPrints: null,
    prints: [blankPrint()],
    frames: [blankFrame()],
  });

  const [nameError, setNameError] = useState(false);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const suppInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof ArtworkForm>(
    key: K,
    value: ArtworkForm[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const setOA = <K extends keyof OriginalArt>(key: K, value: OriginalArt[K]) =>
    setForm((f) => ({ ...f, originalArt: { ...f.originalArt, [key]: value } }));

  // ─── Main Image (base64 for persistence) ─────────────────────────────────
  const handleMainFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setField("mainImageUrl", b64);
  };

  const removeMain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField("mainImageUrl", null);
    if (mainInputRef.current) mainInputRef.current.value = "";
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      const b64 = await fileToBase64(file);
      setField("mainImageUrl", b64);
    }
  };

  // ─── Supporting Images (base64 for persistence) ───────────────────────────
  const handleSuppFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const b64s = await Promise.all(files.map(fileToBase64));
    setForm((f) => ({
      ...f,
      supportingImageUrls: [...f.supportingImageUrls, ...b64s],
    }));
    if (suppInputRef.current) suppInputRef.current.value = "";
  };

  const removeSupp = (idx: number) =>
    setForm((f) => ({
      ...f,
      supportingImageUrls: f.supportingImageUrls.filter((_, i) => i !== idx),
    }));

  // ─── Prints ───────────────────────────────────────────────────────────────
  const updatePrint = (id: number, key: keyof Print, value: unknown) =>
    setForm((f) => ({
      ...f,
      prints: f.prints.map((p) => (p.id === id ? { ...p, [key]: value } : p)),
    }));

  const addPrint = () =>
    setForm((f) => ({ ...f, prints: [...f.prints, blankPrint()] }));

  const removePrint = (id: number) =>
    setForm((f) => ({ ...f, prints: f.prints.filter((p) => p.id !== id) }));

  const addSize = (id: number) =>
    setForm((f) => ({
      ...f,
      prints: f.prints.map((p) =>
        p.id === id
          ? { ...p, sizes: [...p.sizes, { width: "", height: "", price: "" }] }
          : p,
      ),
    }));

  const removeSize = (pid: number, idx: number) =>
    setForm((f) => ({
      ...f,
      prints: f.prints.map((p) =>
        p.id === pid ? { ...p, sizes: p.sizes.filter((_, i) => i !== idx) } : p,
      ),
    }));

  // ─── Frames ───────────────────────────────────────────────────────────────
  const updateFrame = (id: number, key: keyof Frame, value: string) =>
    setForm((f) => ({
      ...f,
      frames: f.frames.map((fr) =>
        fr.id === id ? { ...fr, [key]: value } : fr,
      ),
    }));

  const addFrame = () =>
    setForm((f) => ({ ...f, frames: [...f.frames, blankFrame()] }));

  const removeFrame = (id: number) =>
    setForm((f) => ({
      ...f,
      frames: f.frames.filter((fr) => fr.id !== id),
    }));

  // ─── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 2000);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      orientation: form.orientation,
      mainImageUrl: form.mainImageUrl ?? "",
      supportingImageUrls: form.supportingImageUrls,
      originalArt: {
        surfaceMaterial: form.originalArt.surfaceMaterial,
        widthCm: Number(form.originalArt.widthCm),
        heightCm: Number(form.originalArt.heightCm),
        priceLkr: Number(form.originalArt.priceLkr),
        isFramed: form.offerFramingForOriginal === true,
      },
      prints: form.prints.map((p) => ({
        surfaceMaterial: p.surfaceMaterial,
        sizes: p.sizes.map((s) => ({
          width: Number(s.width),
          height: Number(s.height),
          price: Number(s.price),
        })),
      })),
      frameOptions:
        form.offerFramingForOriginal || form.offerFramingForPrints
          ? form.frames.map((f) => ({
              material: f.surfaceMaterial,
              color: f.color,
              widthCm: Number(f.widthCm) || 0,
              extraPriceLkr: Number(f.extraPriceLkr) || 0,
            }))
          : [],
    };

    try {
      const res = await fetch("http://localhost:4000/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert("Artwork saved!");
    } catch (err: unknown) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all changes?")) {
      setForm({
        name: "",
        description: "",
        orientation: "Landscape",
        mainImageUrl: null,
        supportingImageUrls: [],
        originalArt: {
          surfaceMaterial: "",
          widthCm: "",
          heightCm: "",
          priceLkr: "",
        },
        offerFramingForOriginal: null,
        offerFramingForPrints: null,
        prints: [blankPrint()],
        frames: [blankFrame()],
      });
    }
  };

  const orientations: Orientation[] = ["Landscape", "Portrait", "Square"];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-[860px] mx-auto p-5 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold text-gray-800">Add Artwork</h1>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium"
          >
            Save Draft
          </button>
          <button
            onClick={handleDiscard}
            className="px-4 py-1.5 text-sm rounded-full bg-pink-100 text-red-500 hover:bg-pink-200 transition font-medium"
          >
            Discard Changes
          </button>
        </div>
      </div>

      {/* ── Top Row: Main Image + Supporting Images ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Main Image */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <FieldLabel>Main artwork image</FieldLabel>
          <div
            className="relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50
              transition cursor-pointer overflow-hidden mt-1 hover:border-red-300 hover:bg-red-50"
            style={{ height: 140 }}
            onClick={() => !form.mainImageUrl && mainInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {form.mainImageUrl ? (
              <>
                <img
                  src={form.mainImageUrl}
                  alt="Main artwork"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={removeMain}
                  className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition"
                >
                  ✕
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
                  🖼️
                </div>
                <p className="text-xs text-gray-400">
                  Click here to upload or drop files here
                </p>
              </div>
            )}
          </div>
          <input
            ref={mainInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleMainFile}
          />
        </div>

        {/* Supporting Images */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <FieldLabel>Supporting Images</FieldLabel>
          <div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50
              cursor-pointer hover:border-red-300 hover:bg-red-50 transition py-3 mt-1"
            onClick={() => suppInputRef.current?.click()}
          >
            <span className="text-xl text-gray-300">👆</span>
            <p className="text-xs text-red-400 font-medium">
              Click here to upload or drop files here
            </p>
          </div>
          {form.supportingImageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.supportingImageUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0"
                >
                  <img
                    src={url}
                    alt={`Supporting ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeSupp(i)}
                    className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            ref={suppInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSuppFiles}
          />
        </div>
      </div>

      {/* ── Name + Description + Orientation ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div>
          <FieldLabel>Name of the Art</FieldLabel>
          <Input
            type="text"
            placeholder=""
            maxLength={120}
            value={form.name}
            error={nameError}
            onChange={(e) => setField("name", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            rows={3}
            maxLength={600}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Orientation</FieldLabel>
          <div className="flex gap-2 mt-1">
            {orientations.map((o) => (
              <button
                key={o}
                onClick={() => setField("orientation", o)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition
                  ${
                    form.orientation === o
                      ? "bg-red-100 border-red-300 text-red-500"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Original Art ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <SectionLabel>Original Art</SectionLabel>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <FieldLabel>Surface material</FieldLabel>
            <Input
              type="text"
              placeholder="e.g. canvas, paper, wood"
              value={form.originalArt.surfaceMaterial}
              onChange={(e) => setOA("surfaceMaterial", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Size (m)</FieldLabel>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Width"
                min={1}
                value={form.originalArt.widthCm}
                onChange={(e) => setOA("widthCm", e.target.value)}
              />
              <span className="text-gray-300 text-xs flex-shrink-0">×</span>
              <Input
                type="number"
                placeholder="Height"
                min={1}
                value={form.originalArt.heightCm}
                onChange={(e) => setOA("heightCm", e.target.value)}
              />
            </div>
          </div>
          <div>
            <FieldLabel>Price (LKR)</FieldLabel>
            <Input
              type="number"
              placeholder="Enter the price"
              min={0}
              value={form.originalArt.priceLkr}
              onChange={(e) => setOA("priceLkr", e.target.value)}
            />
          </div>
        </div>

        <FramingOptIn
          value={form.offerFramingForOriginal}
          onChange={(val) => setField("offerFramingForOriginal", val)}
        />

        {form.offerFramingForOriginal === true && (
          <FramesPanel
            frames={form.frames}
            onUpdate={updateFrame}
            onAdd={addFrame}
            onRemove={removeFrame}
          />
        )}
      </div>

      {/* ── Prints ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
        <SectionLabel>Prints</SectionLabel>

        {form.prints.map((print) => (
          <div
            key={print.id}
            className="border border-gray-100 rounded-2xl p-3 space-y-2 bg-gray-50"
          >
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-medium">
              <span>Surface material</span>
              <span>Size (m)</span>
              <span>Price (LKR)</span>
            </div>

            {print.sizes.map((size, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                {idx === 0 ? (
                  <Input
                    placeholder="e.g. Canvas"
                    value={print.surfaceMaterial}
                    onChange={(e) =>
                      updatePrint(print.id, "surfaceMaterial", e.target.value)
                    }
                  />
                ) : (
                  <div />
                )}

                <div className="flex gap-1 items-center">
                  <Input
                    placeholder="Width"
                    value={size.width}
                    className="flex-1"
                    onChange={(e) => {
                      const updated = [...print.sizes];
                      updated[idx] = { ...updated[idx], width: e.target.value };
                      updatePrint(print.id, "sizes", updated);
                    }}
                  />
                  <span className="text-gray-300 text-xs flex-shrink-0">×</span>
                  <Input
                    placeholder="Height"
                    value={size.height}
                    className="flex-1"
                    onChange={(e) => {
                      const updated = [...print.sizes];
                      updated[idx] = { ...updated[idx], height: e.target.value };
                      updatePrint(print.id, "sizes", updated);
                    }}
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Input
                    placeholder="Enter the price"
                    value={size.price}
                    className="flex-1"
                    onChange={(e) => {
                      const updated = [...print.sizes];
                      updated[idx] = { ...updated[idx], price: e.target.value };
                      updatePrint(print.id, "sizes", updated);
                    }}
                  />
                  {print.sizes.length > 1 && (
                    <button
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
              <button
                onClick={() => addSize(print.id)}
                className="text-xs text-red-400 hover:underline"
              >
                + Add more sizes
              </button>
              {form.prints.length > 1 && (
                <button
                  onClick={() => removePrint(print.id)}
                  className="text-xs text-gray-400 hover:text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addPrint}
          className="text-xs text-red-400 border border-dashed border-red-200 rounded-2xl w-full py-2 hover:bg-red-50 transition"
        >
          + Add more surface materials
        </button>

        <FramingOptIn
          value={form.offerFramingForPrints}
          onChange={(val) => setField("offerFramingForPrints", val)}
        />

        {form.offerFramingForPrints === true && (
          <FramesPanel
            frames={form.frames}
            onUpdate={updateFrame}
            onAdd={addFrame}
            onRemove={removeFrame}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pb-8">
        <button
          onClick={handleDiscard}
          className="px-5 py-2 text-sm rounded-full border border-gray-300 text-gray-500 hover:border-gray-500 transition"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium"
        >
          ✓ Save Artwork
        </button>
      </div>
    </div>
  );
}