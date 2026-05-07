import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Orientation = "Landscape" | "Portrait" | "Square";

interface ArtworkForm {
  name: string;
  description: string;
  orientation: Orientation;
  mainImageUrl: string | null;
  supportingImageUrls: string[];
  originalArt: {
    surfaceMaterial: string;
    widthCm: string;
    heightCm: string;
    priceLkr: string;
    isFramed: boolean;
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
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
    <label className="block text-sm font-medium text-gray-600 mb-1">
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
      className={`w-full rounded-lg border bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition
        focus:bg-white focus:ring-2 focus:ring-red-400
        ${error ? "border-red-400" : "border-gray-200"}
        ${className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none
        transition focus:bg-white focus:ring-2 focus:ring-red-400 resize-y min-h-[100px] leading-relaxed"
    />
  );
}

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
      isFramed: true,
    },
  });

  const [nameError, setNameError] = useState(false);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const suppInputRef = useRef<HTMLInputElement>(null);

  const setField = <K extends keyof ArtworkForm>(key: K, value: ArtworkForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setOA = <K extends keyof ArtworkForm["originalArt"]>(
    key: K,
    value: ArtworkForm["originalArt"][K]
  ) => setForm((f) => ({ ...f, originalArt: { ...f.originalArt, [key]: value } }));

  // Main image
  const handleMainFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField("mainImageUrl", URL.createObjectURL(file));
  };

  const removeMain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setField("mainImageUrl", null);
    if (mainInputRef.current) mainInputRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) setField("mainImageUrl", URL.createObjectURL(file));
  };

  // Supporting images
  const handleSuppFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f));
    setForm((f) => ({ ...f, supportingImageUrls: [...f.supportingImageUrls, ...urls] }));
    if (suppInputRef.current) suppInputRef.current.value = "";
  };

  const removeSupp = (idx: number) =>
    setForm((f) => ({
      ...f,
      supportingImageUrls: f.supportingImageUrls.filter((_, i) => i !== idx),
    }));

  // Save / Discard
  // const handleSave = () => {
  //   if (!form.name.trim()) {
  //     setNameError(true);
  //     setTimeout(() => setNameError(false), 2000);
  //     return;
  //   }
  //   console.log("Artwork:", form);
  //   alert("Artwork saved! Check console.");
  // };
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
      isFramed: form.originalArt.isFramed,
    },
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
  } catch (err: any) {
    alert("Error: " + err.message);
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
        originalArt: { surfaceMaterial: "", widthCm: "", heightCm: "", priceLkr: "", isFramed: true },
      });
    }
  };

  const orientations: Orientation[] = ["Landscape", "Portrait", "Square"];

  return (
    <div className="max-w-[720px] mx-auto p-6 space-y-5">

      {/* Header */}
      <div className="flex items-end justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-800">
          Add <span className="text-red-500">Artwork</span>
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleDiscard}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-700 transition"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Save Draft
          </button>
        </div>
      </div>

      {/* ── Images ── */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <SectionLabel>Artwork Images</SectionLabel>

        {/* Main image */}
        <div>
          <FieldLabel>Main Image</FieldLabel>
          <div
            className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed
              transition cursor-pointer h-52 overflow-hidden
              ${form.mainImageUrl
                ? "border-gray-200 cursor-default"
                : "border-gray-200 bg-gray-50 hover:border-red-400 hover:bg-red-50"
              }`}
            onClick={() => !form.mainImageUrl && mainInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
          >
            {form.mainImageUrl ? (
              <>
                <img
                  src={form.mainImageUrl}
                  alt="Main artwork"
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={removeMain}
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs transition"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <span className="text-3xl">🖼️</span>
                <p className="text-sm text-gray-500">
                  <span className="text-red-500 font-medium">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
              </>
            )}
          </div>
          <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={handleMainFile} />
        </div>

        {/* Supporting images */}
        <div>
          <FieldLabel optional>Supporting Images</FieldLabel>
          <div className="flex flex-wrap gap-3 mt-1">
            {form.supportingImageUrls.map((url, i) => (
              <div key={i} className="relative w-[72px] h-[72px] rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                <img src={url} alt={`Supporting ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeSupp(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => suppInputRef.current?.click()}
              className="w-[72px] h-[72px] flex-shrink-0 flex flex-col items-center justify-center gap-1
                rounded-lg border-2 border-dashed border-gray-200 text-gray-400 text-xs
                hover:border-red-400 hover:text-red-400 hover:bg-red-50 transition"
            >
              <span className="text-xl leading-none">＋</span>
              Add
            </button>
          </div>
          <input ref={suppInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleSuppFiles} />
        </div>
      </div>

      {/* ── Artwork Details ── */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <SectionLabel>Artwork Details</SectionLabel>

        {/* Name */}
        <div>
          <FieldLabel>Name of the Art *</FieldLabel>
          <Input
            type="text"
            placeholder="e.g. Misty Mountains at Dawn"
            maxLength={120}
            value={form.name}
            error={nameError}
            onChange={(e) => setField("name", e.target.value)}
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.name.length}/120</p>
        </div>

        {/* Description */}
        <div>
          <FieldLabel optional>Description</FieldLabel>
          <Textarea
            placeholder="Tell the story behind your artwork…"
            maxLength={600}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.description.length}/600</p>
        </div>

        {/* Orientation */}
        <div>
          <FieldLabel>Orientation *</FieldLabel>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            {orientations.map((o, i) => (
              <button
                key={o}
                onClick={() => setField("orientation", o)}
                className={`flex-1 py-2.5 text-sm font-medium transition
                  ${i < orientations.length - 1 ? "border-r border-gray-200" : ""}
                  ${form.orientation === o
                    ? "bg-red-500 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                  }`}
              >
                {o === "Landscape" ? "⬛ " : o === "Portrait" ? "▮ " : "■ "}
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Original Art ── */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <SectionLabel>Original Art Details</SectionLabel>

        {/* Surface material */}
        <div>
          <FieldLabel>Surface Material</FieldLabel>
          <Input
            type="text"
            placeholder="e.g. Canvas, Paper, Wood panel"
            value={form.originalArt.surfaceMaterial}
            onChange={(e) => setOA("surfaceMaterial", e.target.value)}
          />
        </div>

        {/* Width + Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Width (cm)</FieldLabel>
            <Input
              type="number"
              placeholder="e.g. 60"
              min={1}
              value={form.originalArt.widthCm}
              onChange={(e) => setOA("widthCm", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Height (cm)</FieldLabel>
            <Input
              type="number"
              placeholder="e.g. 90"
              min={1}
              value={form.originalArt.heightCm}
              onChange={(e) => setOA("heightCm", e.target.value)}
            />
          </div>
        </div>

        {/* Price */}
        <div>
          <FieldLabel>Price (LKR) *</FieldLabel>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-red-400">
            <span className="px-3 py-2.5 bg-gray-100 text-sm font-medium text-gray-500 border-r border-gray-200 select-none">
              LKR
            </span>
            <input
              type="number"
              placeholder="0.00"
              min={0}
              value={form.originalArt.priceLkr}
              onChange={(e) => setOA("priceLkr", e.target.value)}
              className="flex-1 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:bg-white transition"
            />
          </div>
        </div>

        {/* Frame */}
        <div>
          <FieldLabel>Frame</FieldLabel>
          <div className="flex gap-3">
            {[
              { label: "🖼 Framed", value: true },
              { label: "📄 Not Framed", value: false },
            ].map(({ label, value }) => (
              <button
                key={String(value)}
                onClick={() => setOA("isFramed", value)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition
                  ${form.originalArt.isFramed === value
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 pb-8">
        <button
          onClick={handleDiscard}
          className="px-5 py-2.5 text-sm rounded-full border border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-700 transition"
        >
          Discard Changes
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 text-sm rounded-full bg-red-500 text-white hover:bg-red-600 transition"
        >
          ✓ Save Artwork
        </button>
      </div>

    </div>
  );
}